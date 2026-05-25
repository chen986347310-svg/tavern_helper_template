import { describe, expect, it } from 'vitest';

import { appendTrainingRecord, getP2RoutineByTime, settleP2TrainingEvent, type Phase2RuntimeState } from './phase2Runtime';

const baseState: Phase2RuntimeState = {
  堕落度: 40,
  牝阴决层数: 2,
  当前日课: '候命',
  当前支配者: '',
  当前命令: '',
  命令强度: 0,
  今日调教次数: 0,
  待执行日课: [],
  最近调教结算: '',
  调教记录: [],
  支配次数: { 白芷: 0, 苏芸: 0, 纪兰: 0, 沈月秋: 0, 柳素衣: 0 },
};

describe('phase2Runtime', () => {
  it('按时辰与地点给出牝奴期日课建议', () => {
    expect(getP2RoutineByTime({ 时辰: '晨时', 地点: '莲灯前苑' })).toMatchObject({ 日课: '晨课点名', 支配者: '纪兰' });
    expect(getP2RoutineByTime({ 时辰: '酉时', 地点: '阴阳池' })).toMatchObject({ 日课: '阴阳池验身', 支配者: '沈月秋' });
    expect(getP2RoutineByTime({ 时辰: '亥时', 地点: '掌门殿偏殿' })).toMatchObject({ 日课: '寝前复命', 支配者: '柳素衣' });
  });

  it('结算 P2 调教事件会更新日课、支配者、命令、次数和记录', () => {
    const result = settleP2TrainingEvent({
      state: baseState,
      event: {
        时辰: '酉时',
        地点: '阴阳池',
        支配者: '沈月秋',
        命令: '抬首应名，不准遮住牝印',
        公开度: '半私密',
        后果标签: ['验身', '牝印发热'],
      },
    });

    expect(result.next).toMatchObject({
      当前日课: '阴阳池验身',
      当前支配者: '沈月秋',
      当前命令: '抬首应名，不准遮住牝印',
      命令强度: 55,
      今日调教次数: 1,
      最近调教结算: '沈月秋在阴阳池执行阴阳池验身：抬首应名，不准遮住牝印。',
    });
    expect(result.next.支配次数.沈月秋).toBe(1);
    expect(result.next.调教记录).toHaveLength(1);
    expect(result.next.调教记录[0]).toMatchObject({ 支配者: '沈月秋', 羞名等级: '传开' });
    expect(result.worldEvent).toMatchObject({ 类型: 'P2日课', 地点: '阴阳池', 后果标签: ['验身', '牝印发热'] });
  });

  it('公开示众会提升羞名等级与命令强度', () => {
    const result = settleP2TrainingEvent({
      state: baseState,
      event: {
        时辰: '午时',
        地点: '听风廊',
        支配者: '纪兰',
        命令: '当众复述自己的新名',
        公开度: '公开',
        后果标签: ['公开示众'],
      },
    });

    expect(result.next.命令强度).toBe(70);
    expect(result.next.调教记录[0].羞名等级).toBe('挂牌');
    expect(result.worldEvent.已生成风声).toBe(true);
    expect(result.shameRumor).toMatchObject({
      来源: '公开示众',
      羞名等级: '挂牌',
      是否可承接: true,
    });
  });

  it('私密 P2 调教事件不返回羞名风声', () => {
    const result = settleP2TrainingEvent({
      state: baseState,
      event: {
        时辰: '亥时',
        地点: '锁心静室',
        支配者: '白芷',
        命令: '低声候命',
        公开度: '私密',
        后果标签: ['低声命令'],
      },
    });

    expect(result.worldEvent.已生成风声).toBe(false);
    expect(result.shameRumor).toBeNull();
  });

  it('调教记录最多保留最近10条', () => {
    const existing = Array.from({ length: 10 }, (_, index) => ({
      id: `old_${index}`,
      时辰: '晨时' as const,
      支配者: '纪兰',
      摘要: `旧记录 ${index}`,
      羞名等级: '微闻' as const,
    }));

    const result = appendTrainingRecord(existing, {
      id: 'new_1',
      时辰: '午时',
      支配者: '苏芸',
      摘要: '新记录',
      羞名等级: '传开',
    });

    expect(result).toHaveLength(10);
    expect(result[0].摘要).toBe('旧记录 1');
    expect(result.at(-1)?.摘要).toBe('新记录');
  });
});
