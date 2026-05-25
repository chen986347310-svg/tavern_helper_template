import { describe, expect, it } from 'vitest';

import { buildPendingActionPrompt } from './pendingActionPrompt';

describe('buildPendingActionPrompt', () => {
  it('没有待处理交互时不注入提示词', () => {
    const result = buildPendingActionPrompt({
      系统: { 待处理交互: [], 场景上下文: { 在场NPC: ['白芷'] }, 灵石: 2000, 当前场景: '醉玉小筑' },
    });

    expect(result).toBeNull();
  });

  // --- Phase 1: 按类型生成叙事指令 ---

  it('购买普通物品注入最低承认底线指令', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '购买物品', 目标: '玩家', 道具: '铃铛项圈', 道具显示名: '听铃颈环', AI短提示: '声音外显' }],
        场景上下文: { 在场NPC: [] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('听铃颈环');
    expect(result!.visible.content).toContain('铃铛项圈');
    expect(result!.visible.content).toContain('承认该道具已入手');
    expect(result!.visible.content).not.toContain('高优先级承接');
  });

  it('购买即生效道具注入高优先级承接指令', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '购买物品', 目标: '玩家', 道具: '欲海回声', 道具显示名: '欲海回声', AI短提示: '听见青云道人残存意识' }],
        场景上下文: { 在场NPC: [] },
        灵石: 30000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('高优先级承接');
    expect(result!.visible.content).toContain('欲海回声');
    expect(result!.visible.content).toContain('购买即生效');
    expect(result!.visible.content).toContain('不得被开场叙事或NPC互动压过');
  });

  it('购买投欲钥注入高优先级承接', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '购买物品', 目标: '玩家', 道具: '投欲钥', 道具显示名: '投欲钥', AI短提示: '主动BAD END触发' }],
        场景上下文: { 在场NPC: [] },
        灵石: 100000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('高优先级承接');
    expect(result!.visible.content).toContain('投欲钥');
  });

  it('使用物品注入效果写出指令', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '使用物品', 目标: '玩家', 道具: '时间延长', 道具显示名: '时间延长', AI短提示: '欲海定位倒计时推后' }],
        场景上下文: { 在场NPC: [] },
        灵石: 10000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('使用了');
    expect(result!.visible.content).toContain('时间延长');
    expect(result!.visible.content).toContain('身体变化');
  });

  it('装备道具注入目标反应指令', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '装备道具', 目标: '白芷', 道具: '铃铛项圈', 道具显示名: '听铃颈环', 器阶: '启羞器阶' }],
        场景上下文: { 在场NPC: ['白芷'] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('装备到白芷');
    expect(result!.visible.content).toContain('顺从、抗拒、羞恼或沉默');
  });

  it('牝奴期玩家扣合法器时注入法器匣、身体回响与承命痕指令', () => {
    const result = buildPendingActionPrompt({
      系统: {
        阶段: '牝奴期',
        待处理交互: [{ 类型: '装备道具', 目标: '玩家', 道具: '牝铃', 道具显示名: '牝铃' }],
        场景上下文: { 在场NPC: ['纪兰'], 地点: '听风廊', 公开度: '公开' },
        灵石: 0,
        当前场景: '听风廊',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('扣到己身');
    expect(result!.visible.content).toContain('法器匣承命');
    expect(result!.visible.content).toContain('身体的即时回响');
    expect(result!.visible.content).toContain('当前日课');
    expect(result!.visible.content).toContain('羞名/承命痕');
    expect(result!.visible.content).toContain('道具.装备.玩家');
    expect(result!.scan.content).toContain('法器匣');
    expect(result!.scan.content).toContain('承命痕');
  });

  it('牝奴期领受法器注入执事库发付而非购买指令', () => {
    const result = buildPendingActionPrompt({
      系统: {
        阶段: '牝奴期',
        待处理交互: [{ 类型: '领受法器', 目标: '玩家', 道具: '牝铃', 道具显示名: '牝铃' }],
        场景上下文: { 在场NPC: ['纪兰'], 地点: '听风廊', 公开度: '公开' },
        灵石: 0,
        当前场景: '听风廊',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('执事库领受');
    expect(result!.visible.content).toContain('宗门发付');
    expect(result!.visible.content).toContain('日课领受');
    expect(result!.visible.content).toContain('道具.拥有');
    expect(result!.visible.content).toContain('不要重复增加库存');
    expect(result!.visible.content).not.toContain('玩家购买了');
    expect(result!.scan.content).toContain('领受法器');
    expect(result!.scan.content).toContain('执事库');
    expect(result!.scan.content).toContain('发付');
  });

  it('卸下注入残痕退去指令', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '卸下', 目标: '白芷', 道具: '铃铛项圈', 道具显示名: '听铃颈环' }],
        场景上下文: { 在场NPC: ['白芷'] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('解除');
    expect(result!.visible.content).toContain('残痕退去');
  });

  it('追查风声注入探索结果指令', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '追查风声', 目标: '', 道具: '', 场景: '经阁', 地点: '经阁', 故事钩子: '禁书区异响' }],
        场景上下文: { 在场NPC: [] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('经阁');
    expect(result!.visible.content).toContain('禁书区异响');
    expect(result!.visible.content).toContain('场景遭遇');
  });

  it('灵识窃取注入窥探结果指令', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '灵识窃取', 目标: '白芷', 道具: '' }],
        场景上下文: { 在场NPC: ['白芷'] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('合欢心典');
    expect(result!.visible.content).toContain('白芷');
    expect(result!.visible.content).toContain('心音');
  });

  // --- 多条交互 ---

  it('多条待处理交互按顺序列出', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [
          { 类型: '购买物品', 目标: '玩家', 道具: '体香丹', 道具显示名: '引香丹', 丹药分类: '永久丹药' },
          { 类型: '使用物品', 目标: '白芷', 道具: '体香丹', 道具显示名: '引香丹' },
        ],
        场景上下文: { 在场NPC: ['白芷'] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('1.');
    expect(result!.visible.content).toContain('2.');
    expect(result!.visible.content).toContain('引香丹');
  });

  // --- Phase 2: 灵石红线 ---

  it('灵石异常高时注入保护红线', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '购买物品', 目标: '玩家', 道具: '铃铛项圈', 道具显示名: '听铃颈环' }],
        场景上下文: { 在场NPC: [] },
        灵石: 2000000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('玩家调试行为');
    expect(result!.visible.content).toContain('禁止用replace将灵石修正回');
  });

  it('灵石正常值时不注入红线', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '购买物品', 目标: '玩家', 道具: '铃铛项圈', 道具显示名: '听铃颈环' }],
        场景上下文: { 在场NPC: [] },
        灵石: 5000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).not.toContain('调试行为');
  });

  // --- 扫描文本 ---

  it('扫描文本包含交互类型和道具名', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '购买物品', 目标: '玩家', 道具: '欲海回声', 道具显示名: '欲海回声', AI短提示: '听见青云道人' }],
        场景上下文: { 在场NPC: [] },
        灵石: 30000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.scan.position).toBe('none');
    expect(result!.scan.should_scan).toBe(true);
    expect(result!.scan.content).toContain('购买物品');
    expect(result!.scan.content).toContain('欲海回声');
    expect(result!.scan.content).toContain('特殊道具事件规则');
  });

  it('扫描文本包含禁器相关触发词', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '装备道具', 目标: '白芷', 道具: '阴蒂环', 道具显示名: '命门欲环', 器阶: '化器器阶' }],
        场景上下文: { 在场NPC: ['白芷'] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.scan.content).toContain('禁器叙事规则');
    expect(result!.scan.content).toContain('化器器阶');
    expect(result!.scan.content).toContain('命门欲环');
  });

  it('旧队列缺器阶时仍用道具数据源触发禁器扫描词', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '装备道具', 目标: '白芷', 道具: '阴蒂环', 道具显示名: '命门欲环' }],
        场景上下文: { 在场NPC: ['白芷'] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.scan.content).toContain('禁器叙事规则');
    expect(result!.scan.content).toContain('化器器阶');
  });

  // --- 清空指令 ---

  it('visible内容包含清空待处理交互指令', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '购买物品', 目标: '玩家', 道具: '铃铛项圈' }],
        场景上下文: { 在场NPC: [] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('清空系统.待处理交互');
  });

  // --- 世界运行核心：时间 / 欲海强制结算 ---

  it('有待处理交互时强制提示时间结算', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '追查风声', 目标: '', 道具: '', 场景: '听风廊', 地点: '听风廊', 故事钩子: '旧誓风声' }],
        场景上下文: { 在场NPC: ['白芷'], 地点: '听风廊', 公开度: '半私密' },
        灵石: 2000,
        当前场景: '听风廊',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('时间结算');
    expect(result!.visible.content).toContain('系统.时间状态');
    expect(result!.visible.content).toContain('禁止只清空队列不写时间结算');
    expect(result!.scan.content).toContain('时间结算');
  });

  it('使用时间延长时要求增加剩余天数并写时间状态', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '使用物品', 目标: '玩家', 道具: '时间延长', 道具显示名: '时间延长' }],
        场景上下文: { 在场NPC: [] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('增加系统.剩余天数');
    expect(result!.visible.content).toContain('系统.时间状态');
    expect(result!.scan.content).toContain('时间延长');
  });

  it('使用欲海遮蔽符时要求写遮蔽剩余时段', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '使用物品', 目标: '玩家', 道具: '欲海遮蔽符', 道具显示名: '欲海遮蔽符' }],
        场景上下文: { 在场NPC: [] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('系统.欲海状态.遮蔽剩余时段');
    expect(result!.visible.content).toContain('遮蔽来源');
    expect(result!.scan.content).toContain('欲海状态');
  });

  it('牝奴期有待处理交互时强制提示日课、支配者、牝印命令和调教记录', () => {
    const result = buildPendingActionPrompt({
      系统: {
        阶段: '牝奴期',
        待处理交互: [{ 类型: '追查风声', 目标: '', 道具: '', 场景: '听风廊', 地点: '听风廊', 故事钩子: '羞名流传' }],
        场景上下文: { 在场NPC: ['纪兰'], 地点: '听风廊', 公开度: '公开' },
        灵石: 2000,
        当前场景: '听风廊',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('牝奴期运行结算');
    expect(result!.visible.content).toContain('牝奴.当前日课');
    expect(result!.visible.content).toContain('牝奴.当前支配者');
    expect(result!.visible.content).toContain('牝奴.当前命令');
    expect(result!.visible.content).toContain('牝奴.调教记录');
    expect(result!.visible.content).toContain('剧情.事件记录');
    expect(result!.visible.content).toContain('道具.装备.玩家');
    expect(result!.visible.content).toContain('缺少日课所需法器');
    expect(result!.visible.content).toContain('执事库发付');
    expect(result!.visible.content).toContain('不得叙述玩家用灵石购买牝奴期法器');
    expect(result!.scan.content).toContain('牝奴日课');
    expect(result!.scan.content).toContain('羞名风声');
  });

  it('P2剧情线队列即使不在牝奴期也触发牝奴期结算提示', () => {
    const result = buildPendingActionPrompt({
      系统: {
        阶段: '攻略期',
        待处理交互: [{ 类型: '特殊事件', 目标: '玩家', 道具: '', 剧情线: '牝奴羞名', 地点: '阴阳池' }],
        场景上下文: { 在场NPC: ['沈月秋'], 地点: '阴阳池', 公开度: '半私密' },
        灵石: 2000,
        当前场景: '阴阳池',
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('牝奴期运行结算');
    expect(result!.scan.content).toContain('牝印命令');
  });

  it('P2羞名风声追查会注入传唤、日课异动、公开凝视和支配事件承接', () => {
    const result = buildPendingActionPrompt({
      系统: {
        阶段: '牝奴期',
        当前场景: '莲灯前苑',
        灵石: 0,
        场景上下文: { 地点: '莲灯前苑', 公开度: '公开', 在场NPC: ['柳素衣'] },
        待处理交互: [
          {
            类型: '追查风声',
            目标: '玩家',
            场景: '莲灯前苑',
            地点: '莲灯前苑',
            风声ID: 'p2_shame_1',
            剧情线: '牝奴羞名',
            秘密主题: '挂牌',
            入口类型: '特殊事件',
            AI短提示: 'P2羞名风声：请把挂牌承接为传唤、日课、公开凝视或支配事件。',
          },
        ],
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('P2羞名风声');
    expect(result!.visible.content).toContain('传唤');
    expect(result!.visible.content).toContain('日课异动');
    expect(result!.visible.content).toContain('公开凝视');
    expect(result!.visible.content).toContain('支配事件');
    expect(result!.visible.content).toContain('牝奴.当前日课');
    expect(result!.visible.content).toContain('牝奴.调教记录');
    expect(result!.scan.content).toContain('牝奴羞名');
    expect(result!.scan.content).toContain('牝奴期后果账本');
  });

  it('有待处理交互时约束唯一变量块、完整JSONPatch和最短闭环优先', () => {
    const result = buildPendingActionPrompt({
      系统: {
        阶段: '牝奴期',
        当前场景: '掌门殿偏殿',
        灵石: 0,
        场景上下文: { 地点: '掌门殿偏殿', 公开度: '禁地', 在场NPC: ['柳素衣'] },
        待处理交互: [
          {
            类型: '追查风声',
            目标: '玩家',
            地点: '掌门殿偏殿',
            风声ID: 'p2-cdp-shame-1',
            剧情线: '牝奴羞名',
            AI短提示: 'P2羞名风声：请把挂牌承接为传唤、日课异动、公开凝视或支配事件。',
          },
        ],
      },
    });

    expect(result).not.toBeNull();
    expect(result!.visible.content).toContain('只能输出一个<UpdateVariable>');
    expect(result!.visible.content).toContain('只能输出一个完整<JSONPatch>');
    expect(result!.visible.content).toContain('禁止输出第二个<UpdateVariable>');
    expect(result!.visible.content).toContain('add到/-');
    expect(result!.visible.content).toContain('禁止使用insert');
    expect(result!.visible.content).toContain('最短闭环优先');
    expect(result!.visible.content).toContain('第一优先级');
    expect(result!.visible.content).toContain('系统.待处理交互');
    expect(result!.visible.content).toContain('系统.当前追查风声ID');
    expect(result!.visible.content).toContain('系统.时间状态');
    expect(result!.visible.content).toContain('牝奴.当前日课');
    expect(result!.visible.content).toContain('剧情.事件记录');
  });
  // --- token 控制 ---

  it('单条普通购买的visible内容控制在合理长度', () => {
    const result = buildPendingActionPrompt({
      系统: {
        待处理交互: [{ 类型: '购买物品', 目标: '玩家', 道具: '铃铛项圈', 道具显示名: '听铃颈环', AI短提示: '声音外显' }],
        场景上下文: { 在场NPC: [] },
        灵石: 2000,
        当前场景: '醉玉小筑',
      },
    });

    expect(result).not.toBeNull();
    // 单条普通购买不应注入完整时间表，短强制提示即可。
    expect(result!.visible.content.length).toBeLessThan(750);
  });
});
