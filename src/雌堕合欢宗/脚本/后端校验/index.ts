// ========
// 自动注入状态栏占位符
// ========

import { validateVariables } from './validate';
import { createNarrativePromptRuntime, findStatDataForNarrativePrompt } from './narrativePromptRuntime';
import { applySanitizedCommandFallback, sanitizeMvuCommands } from './mvuCommandSanitizer';
import { selectP2DominanceBaseline } from './p2DominanceBaseline';

const narrativePromptRuntime = createNarrativePromptRuntime({
  getStatData: () => findStatDataForNarrativePrompt(message_id => Mvu.getMvuData({ type: 'message', message_id })?.stat_data),
  injectPrompts,
  uninjectPrompts,
});

await waitGlobalInitialized('Mvu');

function getRecentStatDataHistory(): Record<string, unknown>[] {
  const history: Record<string, unknown>[] = [];
  for (let offset = -1; offset >= -8; offset--) {
    try {
      const statData = _.get(Mvu.getMvuData({ type: 'message', message_id: offset }), 'stat_data');
      if (statData && typeof statData === 'object') history.push(statData as Record<string, unknown>);
    } catch {}
  }
  return history;
}

eventOn(tavern_events.MESSAGE_SENT, () => narrativePromptRuntime.refresh('message_sent'));
eventOn(tavern_events.GENERATION_STARTED, () => narrativePromptRuntime.refresh('generation_started'));
eventOn(tavern_events.GENERATE_BEFORE_COMBINE_PROMPTS, () => narrativePromptRuntime.refresh('before_combine_prompts'));
eventOn(tavern_events.GENERATION_ENDED, narrativePromptRuntime.clear);
eventOn(tavern_events.CHAT_CHANGED, narrativePromptRuntime.clear);

eventOn(Mvu.events.BEFORE_MESSAGE_UPDATE, data => {
  if (data && data.message_content && typeof data.message_content === 'string') {
    if (!data.message_content.includes('<StatusPlaceHolderImpl/>')) {
      data.message_content += '\n<StatusPlaceHolderImpl/>';
    }
  }
});

eventOn(Mvu.events.COMMAND_PARSED, (...args: any[]) => {
  const commands = args.find(arg => Array.isArray(arg));
  const diagnostics = sanitizeMvuCommands(commands);
  if (typeof window !== 'undefined') {
    (window as any).__HEHUAN_MVU_COMMAND_SANITIZER_LAST__ = diagnostics;
  }
});

eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables, old_variables) => {
  const new_data = _.get(new_variables, 'stat_data');
  const event_old_data = _.get(old_variables, 'stat_data');

  if (!new_data || !event_old_data) return;

  const old_data = selectP2DominanceBaseline({
    newData: new_data,
    eventOldData: event_old_data,
    candidateHistory: getRecentStatDataHistory(),
  });

  applySanitizedCommandFallback(new_data, (window as any).__HEHUAN_MVU_COMMAND_SANITIZER_LAST__);
  validateVariables(new_data, old_data);
  applySanitizedCommandFallback(new_data, (window as any).__HEHUAN_MVU_COMMAND_SANITIZER_LAST__);
});
// ═══════════════════
// L2 CDP 测试钩子
// ═══════════════════
if (typeof window !== 'undefined') {
  (window as any).__HEHUAN_MVU_COMMAND_SANITIZER_LAST__ = {
    strategy: 'path_scoring_v2',
    scanned: 0,
    kept: 0,
    dropped: 0,
    droppedCommands: [],
    keptCommands: [],
    selectedPathCount: 0,
  };
  (window as any).__HEHUAN_NARRATIVE_PROMPT_SNAPSHOT__ = () => narrativePromptRuntime.getSnapshot();
  (window as any).__TEST_refreshNarrativePrompts = (reason = 'test_manual_refresh') => {
    narrativePromptRuntime.refresh(reason);
    return narrativePromptRuntime.getSnapshot();
  };

  function __TEST_computeDiff(before: string, after: string) {
    const changes: Array<{ path: string; from: unknown; to: unknown }> = [];
    const bObj = JSON.parse(before);
    const aObj = JSON.parse(after);
    function walk(b: unknown, a: unknown, path: string) {
      if (
        typeof b === 'object' &&
        b !== null &&
        typeof a === 'object' &&
        a !== null &&
        !Array.isArray(b) &&
        !Array.isArray(a)
      ) {
        const bRecord = b as Record<string, unknown>;
        const aRecord = a as Record<string, unknown>;
        const keys = new Set([...Object.keys(bRecord), ...Object.keys(aRecord)]);
        for (const k of keys) {
          walk(bRecord[k], aRecord[k], path ? path + '.' + k : k);
        }
      } else if (JSON.stringify(b) !== JSON.stringify(a)) {
        changes.push({ path: path, from: b, to: a });
      }
    }
    walk(bObj, aObj, '');
    return changes;
  }

  (window as any).__TEST_applyValidatedUpdate = async function (
    pairs: Array<[string, unknown]>,
  ): Promise<{ stat_data: Record<string, unknown>; trace: Array<{ path: string; from: unknown; to: unknown }> }> {
    const event_old_data = structuredClone(_.get(Mvu.getMvuData({ type: 'message', message_id: 'latest' }), 'stat_data'));
    const old_data = selectP2DominanceBaseline({
      newData: event_old_data,
      eventOldData: event_old_data,
      candidateHistory: getRecentStatDataHistory(),
    });
    const new_data = structuredClone(event_old_data);

    for (let i = 0; i < pairs.length; i++) {
      _.set(new_data, pairs[i][0], pairs[i][1]);
    }

    const before = JSON.stringify(new_data);
    validateVariables(new_data, old_data);
    const after = JSON.stringify(new_data);
    const trace = before !== after ? __TEST_computeDiff(before, after) : [];

    const mvuData = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
    const clone = structuredClone(mvuData);
    clone.stat_data = new_data;
    await Mvu.replaceMvuData(clone, { type: 'message', message_id: 'latest' });

    return { stat_data: new_data, trace: trace };
  };
}
