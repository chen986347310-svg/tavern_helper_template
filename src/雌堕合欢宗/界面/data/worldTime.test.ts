import { describe, expect, it } from 'vitest';

import {
  advanceTime,
  appendWorldEventRecord,
  createWorldEventRecord,
  estimateEventCost,
  suggestNpcSchedule,
  settleDesireSea,
  settleWorldRuntime,
  type DesireSeaState,
  type TimeState,
} from './worldTime';

const baseTime: TimeState = {
  当前日: 1,
  时辰: '晨时',
  剩余天数: 30,
  时段进度: 0,
  最近耗时: '',
  最近结算原因: '',
  最近事件类型: '',
  是否过夜: false,
};

const baseDesireSea: DesireSeaState = {
  搜寻进度: 0,
  警戒等级: '平静',
  遮蔽剩余时段: 0,
  遮蔽来源: '',
  最近暴露原因: '',
  已被定位: false,
};

describe('worldTime runtime settlement', () => {
  it('普通对话不推进时辰，但写入最近结算原因', () => {
    const cost = estimateEventCost({ 类型: '对话' });
    const next = advanceTime(baseTime, cost);

    expect(cost.slots).toBe(0);
    expect(next.时辰).toBe('晨时');
    expect(next.剩余天数).toBe(30);
    expect(next.最近结算原因).toContain('普通对话');
  });

  it('扫地推进一个时段，追查风声也推进一个时段', () => {
    expect(advanceTime(baseTime, estimateEventCost({ 类型: '扫地' })).时辰).toBe('午时');
    expect(advanceTime(baseTime, estimateEventCost({ 类型: '追查风声' })).时辰).toBe('午时');
  });

  it('亥时推进后过夜并减少剩余天数', () => {
    const next = advanceTime({ ...baseTime, 时辰: '亥时', 时段进度: 3 }, estimateEventCost({ 类型: '追查风声' }));

    expect(next.当前日).toBe(2);
    expect(next.时辰).toBe('晨时');
    expect(next.剩余天数).toBe(29);
    expect(next.是否过夜).toBe(true);
  });

  it('时间延长增加剩余天数并记录原因', () => {
    const next = settleWorldRuntime({
      time: { ...baseTime, 剩余天数: 3 },
      desireSea: baseDesireSea,
      action: { 类型: '使用物品', 道具: '时间延长' },
      context: { 地点: '醉玉小筑', 公开度: '私密', 在场NPC: [] },
    });

    expect(next.time.剩余天数).toBe(4);
    expect(next.time.最近结算原因).toContain('时间延长');
    expect(next.record.后果标签).toContain('时间延长');
  });

  it('NSFW 增加欲海搜寻进度，遮蔽期只产生极低暴露', () => {
    const exposed = settleDesireSea(baseDesireSea, { 类型: 'NSFW', 强度: '深度' });
    const shielded = settleDesireSea({ ...baseDesireSea, 遮蔽剩余时段: 2, 遮蔽来源: '欲海遮蔽符' }, { 类型: 'NSFW', 强度: '深度' });

    expect(exposed.搜寻进度).toBeGreaterThanOrEqual(24);
    expect(exposed.警戒等级).toBe('微动');
    expect(shielded.搜寻进度).toBeLessThanOrEqual(3);
    expect(shielded.遮蔽剩余时段).toBe(1);
    expect(shielded.最近暴露原因).toContain('遮蔽');
  });

  it('投欲钥直接锁定，改变阵法改写欲海压力', () => {
    const locked = settleDesireSea(baseDesireSea, { 类型: '使用物品', 道具: '投欲钥' });
    const rewritten = settleDesireSea({ ...baseDesireSea, 搜寻进度: 80, 警戒等级: '警觉' }, { 类型: '改变阵法' });

    expect(locked).toMatchObject({ 搜寻进度: 100, 警戒等级: '锁定', 已被定位: true });
    expect(rewritten).toMatchObject({ 搜寻进度: 0, 警戒等级: '已改写', 已被定位: false });
  });

  it('事件后果账本记录摘要、时间、地点、NPC 和标签', () => {
    const record = createWorldEventRecord({
      action: { 类型: '追查风声', 风声ID: 'rumor_1' },
      time: { ...baseTime, 时辰: '午时' },
      context: { 地点: '听风廊', 公开度: '半私密', 在场NPC: ['白芷'] },
      tags: ['风声追查'],
      summary: '玩家追查听风廊的旧誓风声。',
    });

    expect(record).toMatchObject({
      类型: '追查风声',
      摘要: '玩家追查听风廊的旧誓风声。',
      日: 1,
      时辰: '午时',
      地点: '听风廊',
      涉及NPC: ['白芷'],
      公开度: '半私密',
      后果标签: ['风声追查'],
      已生成风声: false,
    });
    expect(record.id).toContain('event_1_午时_追查风声');
  });

  it('根据时辰与地点推荐 NPC 日程候选', () => {
    expect(suggestNpcSchedule({ 时辰: '午时', 地点: '药庐暖阁' }).map(item => item.npc)).toContain('苏芸');
    expect(suggestNpcSchedule({ 时辰: '酉时', 地点: '阴阳池' }).map(item => item.npc)).toContain('沈月秋');
    expect(suggestNpcSchedule({ 时辰: '亥时', 地点: '掌门殿偏殿' }).map(item => item.npc)).toContain('柳素衣');
  });

  it('事件记录追加时最多保留最近20条', () => {
    const existing = Array.from({ length: 20 }, (_, index) =>
      createWorldEventRecord({
        action: { 类型: `旧事件${index}` },
        time: { 当前日: 1, 时辰: '晨时' },
        context: { 地点: '莲灯前苑', 公开度: '公开', 在场NPC: [] },
        tags: ['旧记录'],
        summary: `旧事件 ${index}`,
      }),
    );
    const nextRecord = createWorldEventRecord({
      action: { 类型: '追查风声' },
      time: { 当前日: 2, 时辰: '午时' },
      context: { 地点: '听风廊', 公开度: '半私密', 在场NPC: ['白芷'] },
      tags: ['风声追查'],
      summary: '新的风声事件',
    });

    const result = appendWorldEventRecord(existing, nextRecord);

    expect(result).toHaveLength(20);
    expect(result[0].摘要).toBe('旧事件 1');
    expect(result.at(-1)?.摘要).toBe('新的风声事件');
  });
});
