// ========
// 自动注入状态栏占位符
// ========

import { validateVariables } from './validate';

await waitGlobalInitialized('Mvu');

eventOn(Mvu.events.BEFORE_MESSAGE_UPDATE, (data) => {
  if (data && data.message_content && typeof data.message_content === "string") {
    if (!data.message_content.includes("<StatusPlaceHolderImpl/>")) {
      data.message_content += "\n<StatusPlaceHolderImpl/>";
    }
  }
});

eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables, old_variables) => {
  const new_data = _.get(new_variables, 'stat_data');
  const old_data = _.get(old_variables, 'stat_data');

  if (!new_data || !old_data) return;

  validateVariables(new_data, old_data);
});
// ═══════════════════
// L2 CDP 测试钩子
// ═══════════════════
if (typeof window !== 'undefined') {
  function __TEST_computeDiff(before, after) {
    const changes = [];
    const bObj = JSON.parse(before);
    const aObj = JSON.parse(after);
    function walk(b, a, path) {
      if (typeof b === 'object' && b !== null && typeof a === 'object' && a !== null && !Array.isArray(b) && !Array.isArray(a)) {
        const keys = new Set([...Object.keys(b), ...Object.keys(a)]);
        for (const k of keys) {
          walk(b[k], a[k], path ? path + '.' + k : k);
        }
      } else if (JSON.stringify(b) !== JSON.stringify(a)) {
        changes.push({ path: path, from: b, to: a });
      }
    }
    walk(bObj, aObj, '');
    return changes;
  }

  window.__TEST_applyValidatedUpdate = async function(pairs) {
    const old_data = structuredClone(
      _.get(Mvu.getMvuData({ type: 'message', message_id: 'latest' }), 'stat_data')
    );
    const new_data = structuredClone(old_data);

    for (let i = 0; i < pairs.length; i++) {
      _.set(new_data, pairs[i][0], pairs[i][1]);
    }

    const before = JSON.stringify(new_data);
    validateVariables(new_data, old_data);
    const after = JSON.stringify(new_data);
    const trace = (before !== after) ? __TEST_computeDiff(before, after) : [];

    const mvuData = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
    const clone = structuredClone(mvuData);
    clone.stat_data = new_data;
    await Mvu.replaceMvuData(clone, { type: "message", message_id: "latest" });

    return { stat_data: new_data, trace: trace };
  };
}
