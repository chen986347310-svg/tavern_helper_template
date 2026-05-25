import { describe, expect, it } from 'vitest';

import { buildContrabandPrompt } from './contrabandPrompt';

describe('buildContrabandPrompt', () => {
  it('没有当前相关禁器时不注入提示词', () => {
    const result = buildContrabandPrompt({
      系统: { 场景上下文: { 在场NPC: ['白芷'], 公开度: '公开' }, 待处理交互: [] },
      道具: { 装备: { 玩家: ['透视罗裙'], 白芷: [], 苏芸: ['阴蒂环'] } },
    });

    expect(result).toBeNull();
  });

  it('只为玩家和在场 NPC 生成禁器短摘要，不带出离场 NPC 禁器', () => {
    const result = buildContrabandPrompt({
      系统: { 场景上下文: { 在场NPC: ['白芷'], 公开度: '半私密' }, 待处理交互: [] },
      道具: {
        装备: {
          玩家: ['铃铛项圈'],
          白芷: ['阴蒂环'],
          苏芸: ['命铃锁喉环'],
        },
      },
    });

    expect(result?.visible.content).toContain('当前禁器锚点');
    expect(result?.visible.content).toContain('玩家：听铃颈环（铃铛项圈，启羞器阶/颈项）');
    expect(result?.visible.content).toContain('白芷：命门欲环（阴蒂环，化器器阶/阴蒂）');
    expect(result?.visible.content).not.toContain('苏芸');
    expect(result?.visible.content).toContain('不要每回合机械复述');
  });

  it('扫描文本包含逻辑名、显示名、器阶和交互类型，用于激活绿灯世界书', () => {
    const result = buildContrabandPrompt({
      系统: {
        场景上下文: { 在场NPC: ['白芷'], 公开度: '公开' },
        待处理交互: [{ 类型: '装备道具', 目标: '白芷', 道具: '阴蒂环' }],
      },
      道具: { 装备: { 玩家: [], 白芷: ['阴蒂环'] } },
    });

    expect(result?.scan.position).toBe('none');
    expect(result?.scan.should_scan).toBe(true);
    expect(result?.scan.content).toContain('禁器叙事规则');
    expect(result?.scan.content).toContain('阴蒂环');
    expect(result?.scan.content).toContain('命门欲环');
    expect(result?.scan.content).toContain('化器器阶');
    expect(result?.scan.content).toContain('装备道具');
    expect(result?.visible.content.length).toBeLessThan(360);
  });
});
