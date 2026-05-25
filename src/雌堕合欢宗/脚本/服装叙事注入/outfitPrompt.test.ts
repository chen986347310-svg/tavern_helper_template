import { describe, expect, it } from 'vitest';

import { buildOutfitPrompt } from './outfitPrompt';

describe('buildOutfitPrompt', () => {
  it('没有当前相关装备时不注入提示词', () => {
    const result = buildOutfitPrompt({
      系统: { 场景上下文: { 在场NPC: ['白芷'], 公开度: '公开' }, 待处理交互: [] },
      道具: { 装备: { 玩家: [], 白芷: [], 苏芸: ['透视罗裙'] } },
    });

    expect(result).toBeNull();
  });

  it('只为玩家和在场 NPC 生成短摘要，不带出离场 NPC 装备', () => {
    const result = buildOutfitPrompt({
      系统: { 场景上下文: { 在场NPC: ['白芷'], 公开度: '公开' }, 待处理交互: [] },
      道具: {
        装备: {
          玩家: ['牝奴纹衣'],
          白芷: ['透视罗裙'],
          苏芸: ['苏芸仙奴服'],
        },
      },
    });

    expect(result?.visible.content).toContain('当前服装锚点');
    expect(result?.visible.content).toContain('玩家：牝纹噬身衣（牝奴纹衣）');
    expect(result?.visible.content).toContain('白芷：湿雾贴身裙（透视罗裙）');
    expect(result?.visible.content).not.toContain('苏芸');
    expect(result?.visible.content).toContain('不要每回合机械复述');
  });

  it('扫描文本包含逻辑名和显示名，用于激活绿灯世界书但不直接发给 AI', () => {
    const result = buildOutfitPrompt({
      系统: {
        场景上下文: { 在场NPC: ['白芷'], 公开度: '半私密' },
        待处理交互: [{ 类型: '装备道具', 目标: '白芷', 道具: '透视罗裙' }],
      },
      道具: { 装备: { 玩家: [], 白芷: ['透视罗裙'] } },
    });

    expect(result?.scan.position).toBe('none');
    expect(result?.scan.should_scan).toBe(true);
    expect(result?.scan.content).toContain('透视罗裙');
    expect(result?.scan.content).toContain('湿雾贴身裙');
    expect(result?.scan.content).toContain('装备道具');
    expect(result?.visible.content.length).toBeLessThan(260);
  });
});
