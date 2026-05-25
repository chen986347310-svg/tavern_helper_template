import { describe, expect, it } from 'vitest';
import { createNarrativeEntryForPurchase, hasPendingPurchase, insertEntryRumor } from './narrativeEntry';
import { 特殊剧情 } from './scenes';

describe('narrativeEntry', () => {
  it('为剧情钥匙生成固定可追查风声与线索状态', () => {
    const entry = createNarrativeEntryForPurchase('白芷旧誓线');

    expect(entry).toMatchObject({
      key: '白芷旧誓线',
      status: {
        类型: '剧情钥匙',
        状态: '可追查',
        风声ID: 'story_baizhi_old_oath_1',
        关联名称: '白芷旧誓线',
        关联NPC: '白芷',
        推荐场景: ['听风廊', '锁心静室', '阴阳池'],
        触发次数: 0,
      },
      rumor: {
        id: 'story_baizhi_old_oath_1',
        来源: '剧情钥匙',
        地点: '听风廊',
        相关NPC: ['白芷'],
        状态: '未读',
      },
    });
    expect(entry?.rumor.风声文本).toContain('玉扣');
    expect(entry?.rumor.故事钩子).toContain('白芷旧誓');
  });

  it('所有剧情钥匙都有固定风声种子，避免新增钥匙漏配入口', () => {
    for (const story of 特殊剧情) {
      const entry = createNarrativeEntryForPurchase(story.名称);

      expect(entry, `${story.名称} 缺少剧情钥匙风声入口`).not.toBeNull();
      expect(entry?.status).toMatchObject({
        类型: '剧情钥匙',
        状态: '可追查',
        关联名称: story.名称,
        关联NPC: story.NPC,
      });
      expect(entry?.status.风声ID).toMatch(/^story_.+_1$/);
      expect(entry?.rumor).toMatchObject({
        id: entry?.status.风声ID,
        来源: '剧情钥匙',
        状态: '未读',
      });
    }
  });

  it('为场景令牌生成入口风声与线索状态', () => {
    const entry = createNarrativeEntryForPurchase('阴阳池');

    expect(entry).toMatchObject({
      key: '阴阳池',
      status: {
        类型: '场景令牌',
        状态: '可追查',
        风声ID: 'scene_yinyang_pool_1',
        关联名称: '阴阳池',
        推荐场景: ['阴阳池'],
        触发次数: 0,
      },
      rumor: {
        id: 'scene_yinyang_pool_1',
        来源: '场景令牌',
        地点: '阴阳池',
        状态: '未读',
      },
    });
    expect(entry?.rumor.风声文本).toContain('偏池禁制');
  });

  it('购买即生效特殊事件不生成可追查入口风声', () => {
    expect(createNarrativeEntryForPurchase('欲海回声')).toBeNull();
    expect(createNarrativeEntryForPurchase('投欲钥')).toBeNull();
    expect(createNarrativeEntryForPurchase('改变阵法')).toBeNull();
  });

  it('插入风声时按 id 去重并在满载时替换普通未读风声', () => {
    const entry = createNarrativeEntryForPurchase('白芷旧誓线')!;
    const current = [
      { id: 'normal-1', 来源: '弟子传闻', 地点: '药庐', 风声文本: '普通风声一', 状态: '未读' },
      { id: 'normal-2', 来源: '弟子传闻', 地点: '经阁', 风声文本: '普通风声二', 状态: '未读' },
      { id: 'normal-3', 来源: '弟子传闻', 地点: '莲灯前苑', 风声文本: '普通风声三', 状态: '未读' },
    ];

    const result = insertEntryRumor(current, entry.rumor);

    expect(result).toHaveLength(3);
    expect(result.map(rumor => rumor.id)).toEqual(['normal-2', 'normal-3', 'story_baizhi_old_oath_1']);
    expect(insertEntryRumor(result, entry.rumor)).toEqual(result);
  });

  it('不替换追查中和系统入口风声', () => {
    const entry = createNarrativeEntryForPurchase('阴阳池')!;
    const current = [
      { id: 'story-1', 来源: '剧情钥匙', 地点: '听风廊', 风声文本: '剧情风声', 状态: '未读' },
      { id: 'scene-1', 来源: '场景令牌', 地点: '药庐暖阁', 风声文本: '场景风声', 状态: '未读' },
      { id: 'pending-1', 来源: '弟子传闻', 地点: '莲灯前苑', 风声文本: '追查中', 状态: '追查中' },
    ];

    expect(insertEntryRumor(current, entry.rumor)).toEqual(current);
  });

  it('可识别同名购买待处理，避免重复入队', () => {
    expect(hasPendingPurchase([{ 类型: '购买物品', 道具: '白芷旧誓线' }], '白芷旧誓线')).toBe(true);
    expect(hasPendingPurchase([{ 类型: '追查风声', 道具: '白芷旧誓线' }], '白芷旧誓线')).toBe(false);
  });
});
