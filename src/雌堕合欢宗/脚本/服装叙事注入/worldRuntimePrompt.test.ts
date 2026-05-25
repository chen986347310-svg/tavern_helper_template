import { describe, expect, it } from 'vitest';

import { buildWorldRuntimePrompt } from './worldRuntimePrompt';

describe('buildWorldRuntimePrompt', () => {
  it('队列为空但有场景钩子时注入轻量世界运行账本提示', () => {
    const result = buildWorldRuntimePrompt({
      系统: {
        当前场景: '阴阳池外围',
        待处理交互: [],
        场景上下文: {
          地点: '阴阳池',
          子区域: '外围玉阶',
          公开度: '半私密',
          在场NPC: [],
          故事钩子: ['等待酉时苏芸到来', '观察玉阶地形'],
        },
        时间状态: { 最近事件类型: '移动与观察' },
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.id).toBe('hehuan-world-runtime-summary');
    expect(result!.visible.content).toContain('系统.时间状态');
    expect(result!.visible.content).toContain('系统.场景上下文');
    expect(result!.visible.content).toContain('剧情.事件记录');
    expect(result!.visible.content).toContain('add /剧情/事件记录/-');
    expect(result!.visible.content.length).toBeLessThan(520);
    expect(result!.scan.content).toContain('世界运行账本');
    expect(result!.scan.content).toContain('剧情.事件记录');
  });

  it('有待处理交互时退让给 pending action prompt，避免重复 visible 强约束', () => {
    const result = buildWorldRuntimePrompt({
      系统: {
        当前场景: '听风廊',
        待处理交互: [{ 类型: '追查风声' }],
        场景上下文: { 地点: '听风廊', 故事钩子: ['旧誓风声'] },
      },
    });

    expect(result).toBeNull();
  });

  it('普通空状态不注入，避免无意义 token 噪声', () => {
    const result = buildWorldRuntimePrompt({
      系统: {
        当前场景: '莲灯前苑',
        待处理交互: [],
        场景上下文: { 地点: '莲灯前苑', 故事钩子: [] },
        时间状态: { 最近事件类型: '' },
      },
    });

    expect(result).toBeNull();
  });

  it('牝奴期即使无队列也注入 P2 日课与事件账本提示', () => {
    const result = buildWorldRuntimePrompt({
      系统: {
        阶段: '牝奴期',
        当前场景: '莲灯前苑',
        待处理交互: [],
        场景上下文: { 地点: '莲灯前苑', 故事钩子: [] },
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('P2日课');
    expect(result!.visible.content).toContain('牝奴.调教记录');
    expect(result!.visible.content).toContain('剧情.事件记录');
  });

  it('牝奴期无队列自然楼层也提示同步当前日课、支配者、命令和调教结算', () => {
    const result = buildWorldRuntimePrompt({
      系统: {
        阶段: '牝奴期',
        当前场景: '阴阳池底',
        待处理交互: [],
        场景上下文: {
          地点: '阴阳池底',
          子区域: '玉阶底端',
          公开度: '半私密',
          在场NPC: ['苏芸'],
          故事钩子: ['苏芸的绣鞋踩在手背上'],
        },
        时间状态: { 最近事件类型: '对话' },
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('牝奴.当前日课');
    expect(result!.visible.content).toContain('牝奴.当前支配者');
    expect(result!.visible.content).toContain('牝奴.当前命令');
    expect(result!.visible.content).toContain('牝奴.今日调教次数');
    expect(result!.visible.content).toContain('牝奴.最近调教结算');
    expect(result!.visible.content).toContain('add /牝奴/调教记录/-');
    expect(result!.visible.content).toContain('道具.装备.玩家');
    expect(result!.visible.content).toContain('执事库发付不是商城购买');
    expect(result!.scan.content).toContain('牝奴.当前命令');
    expect(result!.scan.content).toContain('调教记录');
    expect(result!.scan.content).toContain('法器匣');
    expect(result!.scan.content).toContain('羞名风声');
  });
});
