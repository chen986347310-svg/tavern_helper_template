import { describe, expect, it } from 'vitest';
import { selectP2DominanceBaseline } from './p2DominanceBaseline';

const record = {
  id: 'p2_酉时_阴阳池_苏芸_1',
  时辰: '酉时',
  支配者: '苏芸',
  摘要: '苏芸在阴阳池执行阴阳池验身。',
  羞名等级: '传开',
};

function makeP2Data(suyunCount: number, records = [record]) {
  return {
    系统: { 阶段: '牝奴期' },
    牝奴: {
      调教记录: records,
      支配次数: { 白芷: 0, 苏芸: suyunCount, 纪兰: 2, 沈月秋: 3, 柳素衣: 4 },
    },
  };
}

describe('selectP2DominanceBaseline', () => {
  it('同一调教记录集下最新楼层支配次数漂移时选择最近历史中的较低可信基准', () => {
    const newData = makeP2Data(3);
    const eventOldData = makeP2Data(3);
    const cleanHistory = makeP2Data(2);

    const baseline = selectP2DominanceBaseline({
      newData,
      eventOldData,
      candidateHistory: [eventOldData, cleanHistory],
    });

    expect(baseline.牝奴.支配次数.苏芸).toBe(2);
  });

  it('存在新增调教记录时不回退到旧基准', () => {
    const newData = makeP2Data(3, [record, { ...record, id: 'p2_亥时_偏殿_苏芸_2' }]);
    const eventOldData = makeP2Data(2);

    const baseline = selectP2DominanceBaseline({
      newData,
      eventOldData,
      candidateHistory: [makeP2Data(1)],
    });

    expect(baseline).toBe(eventOldData);
  });

  it('最新楼层清空调教记录时选择最近历史中的非空账本基准', () => {
    const newData = makeP2Data(2, []);
    const eventOldData = makeP2Data(2, []);
    const ledgerHistory = makeP2Data(2, [record]);

    const baseline = selectP2DominanceBaseline({
      newData,
      eventOldData,
      candidateHistory: [eventOldData, ledgerHistory],
    });

    expect(baseline.牝奴.调教记录).toEqual([record]);
  });
});
