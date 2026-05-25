import { buildContrabandPrompt } from '../服装叙事注入/contrabandPrompt';
import { buildOutfitPrompt } from '../服装叙事注入/outfitPrompt';
import { buildPendingActionPrompt } from '../服装叙事注入/pendingActionPrompt';
import { buildWorldRuntimePrompt } from '../服装叙事注入/worldRuntimePrompt';

type InjectionPrompt = {
  id: string;
  position: 'in_chat' | 'none';
  depth: number;
  role: 'system' | 'assistant' | 'user';
  content: string;
  should_scan?: boolean;
};

type InjectPrompts = (prompts: InjectionPrompt[]) => { uninject: () => void };

type InjectionSnapshot = {
  reason: string;
  pendingCount: number;
  promptIds: string[];
  hasP2PendingAction: boolean;
  hasWorldRuntimePrompt: boolean;
  injected: boolean;
};

function getPendingActions(data: Record<string, unknown>): Array<Record<string, unknown>> {
  const actions = (data as { 系统?: { 待处理交互?: unknown } }).系统?.待处理交互;
  return Array.isArray(actions) ? (actions as Array<Record<string, unknown>>) : [];
}

function hasP2PendingAction(actions: Array<Record<string, unknown>>): boolean {
  return actions.some(action => action.剧情线 === '牝奴羞名' || String(action.AI短提示 ?? '').includes('P2羞名'));
}

function hasValidWorldRuntimeState(data: Record<string, unknown> | null | undefined): boolean {
  const system = (data as { 系统?: Record<string, unknown> } | null | undefined)?.系统;
  if (!system || typeof system !== 'object') return false;
  if (system.阶段 === '牝奴期') return true;
  if (typeof system.当前追查风声ID === 'string' && system.当前追查风声ID.trim()) return true;
  if (typeof system.当前场景 === 'string' && system.当前场景.trim()) return true;
  return false;
}

export function findStatDataForNarrativePrompt(getByMessageId: (messageId: number | 'latest') => Record<string, unknown> | null | undefined) {
  const latest = getByMessageId('latest') ?? {};
  if (getPendingActions(latest).length > 0) return latest;

  for (const messageId of [-1, -2, -3, -4, -5]) {
    const data = getByMessageId(messageId);
    if (data && getPendingActions(data).length > 0) return data;
  }

  if (hasValidWorldRuntimeState(latest)) return latest;

  for (const messageId of [-1, -2, -3, -4, -5]) {
    const data = getByMessageId(messageId);
    if (hasValidWorldRuntimeState(data)) return data!;
  }

  return latest;
}

export function createNarrativePromptRuntime(deps: {
  getStatData: () => Record<string, unknown>;
  injectPrompts: InjectPrompts;
  uninjectPrompts: (ids: string[]) => void;
}) {
  let uninjectCurrent: (() => void) | null = null;
  let snapshot: InjectionSnapshot = {
    reason: 'init',
    pendingCount: 0,
    promptIds: [],
    hasP2PendingAction: false,
    hasWorldRuntimePrompt: false,
    injected: false,
  };

  const ids = {
    outfit: ['hehuan-current-outfit-summary', 'hehuan-current-outfit-scan'],
    contraband: ['hehuan-current-contraband-summary', 'hehuan-current-contraband-scan'],
    pending: ['hehuan-pending-action-summary', 'hehuan-pending-action-scan'],
    worldRuntime: ['hehuan-world-runtime-summary', 'hehuan-world-runtime-scan'],
  };

  function clear() {
    uninjectCurrent?.();
    uninjectCurrent = null;
    deps.uninjectPrompts(ids.outfit);
    deps.uninjectPrompts(ids.contraband);
    deps.uninjectPrompts(ids.pending);
    deps.uninjectPrompts(ids.worldRuntime);
  }

  function refresh(reason = 'refresh') {
    const data = deps.getStatData();
    const actions = getPendingActions(data);
    const prompts = [buildOutfitPrompt(data), buildContrabandPrompt(data), buildPendingActionPrompt(data), buildWorldRuntimePrompt(data)]
      .filter(Boolean)
      .flatMap(prompt => [prompt!.visible, prompt!.scan]);

    clear();
    snapshot = {
      reason,
      pendingCount: actions.length,
      promptIds: prompts.map(prompt => prompt.id),
      hasP2PendingAction: hasP2PendingAction(actions),
      hasWorldRuntimePrompt: prompts.some(prompt => ids.worldRuntime.includes(prompt.id)),
      injected: prompts.length > 0,
    };
    if (prompts.length === 0) return;
    uninjectCurrent = deps.injectPrompts(prompts).uninject;
  }

  function getSnapshot() {
    return { ...snapshot, promptIds: [...snapshot.promptIds] };
  }

  return { refresh, clear, getSnapshot };
}
