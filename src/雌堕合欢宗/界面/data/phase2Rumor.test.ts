import { describe, expect, it } from 'vitest';

import { appendP2ShameRumor, createP2ShameRumorFromEvent } from './phase2Rumor';
import type { WorldEventRecord } from './worldTime';

const baseEvent: WorldEventRecord = {
  id: 'event_1_午时_P2日课_听风廊',
  类型: 'P2日课',
  摘要: '纪兰在听风廊执行听风复名：当众复述自己的新名。',
  日: 1,
  时辰: '午时',
  地点: '听风廊',
  涉及NPC: ['纪兰'],
  公开度: '公开',
  后果标签: ['公开示众', '听命'],
  已生成风声: true,
};

describe('phase2Rumor', () => {
  it('公开示众事件生成可承接的 P2 羞名风声', () => {
    const rumor = createP2ShameRumorFromEvent(baseEvent);

    expect(rumor).toMatchObject({
      id: 'p2_shame_event_1_午时_P2日课_听风廊',
      来源: '公开示众',
      地点: '听风廊',
      相关NPC: ['纪兰'],
      紧急度: '高',
      状态: '未读',
      凝视来源: '弟子低语',
      羞名等级: '挂牌',
      羞名标签: ['公开示众', '听命'],
      反噬日课: '听风复名',
      是否可承接: true,
    });
    expect(rumor?.风声文本).toContain('听风廊');
    expect(rumor?.风声文本).toContain('纪兰');
    expect(rumor?.故事钩子).toContain('公开凝视');
  });

  it('半私密调教余波生成传开级风声', () => {
    const rumor = createP2ShameRumorFromEvent({
      ...baseEvent,
      id: 'event_1_酉时_P2日课_阴阳池',
      地点: '阴阳池',
      涉及NPC: ['沈月秋'],
      公开度: '半私密',
      后果标签: ['验身', '牝印发热'],
      摘要: '沈月秋在阴阳池执行阴阳池验身：抬首应名。',
    });

    expect(rumor).toMatchObject({
      来源: '调教余波',
      凝视来源: '执事记录',
      羞名等级: '传开',
      反噬日课: '阴阳池验身',
      是否可承接: true,
    });
  });

  it('私密事件默认不生成羞名风声', () => {
    const rumor = createP2ShameRumorFromEvent({
      ...baseEvent,
      公开度: '私密',
      后果标签: ['低声命令'],
      已生成风声: false,
    });

    expect(rumor).toBeNull();
  });

  it('插入羞名风声时复用三条上限与去重规则', () => {
    const current = [
      { id: 'story-1', 来源: '剧情钥匙', 地点: '听风廊', 风声文本: '旧誓风声', 状态: '未读' },
      { id: 'scene-1', 来源: '场景令牌', 地点: '阴阳池', 风声文本: '阴阳池入口', 状态: '未读' },
      { id: 'normal-1', 来源: '弟子传闻', 地点: '药庐', 风声文本: '普通风声', 状态: '未读' },
    ];
    const rumor = createP2ShameRumorFromEvent(baseEvent)!;

    const result = appendP2ShameRumor(current, rumor);

    expect(result).toHaveLength(3);
    expect(result.map(item => item.id)).toEqual(['story-1', 'scene-1', rumor.id]);
    expect(appendP2ShameRumor(result, rumor)).toEqual(result);
  });
});
