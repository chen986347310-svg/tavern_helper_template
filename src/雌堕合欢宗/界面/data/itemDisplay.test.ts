import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { getContrabandTier, getExclusiveOutfitNpc, getItemDisplayName, getItemShortHint, getPillCategory, getPillEffectLine, isPlayerOnlyOutfit } from './itemDisplay';
import { NSFW道具, 永久丹药, 特殊道具 } from './items';
import { 服装列表 } from './outfits';
import { 特殊场景, 特殊剧情 } from './scenes';

describe('itemDisplay', () => {
  it('服装逻辑名映射为 v3 显示名与 AI 短提示', () => {
    expect(getItemDisplayName('透视罗裙')).toBe('湿雾贴身裙');
    expect(getItemShortHint('透视罗裙')).toContain('雾绡遇热贴身');
  });

  it('未知道具保留原逻辑名，兼容旧存档', () => {
    expect(getItemDisplayName('旧存档遗留物')).toBe('旧存档遗留物');
    expect(getItemShortHint('旧存档遗留物')).toBe('');
  });

  it('禁器逻辑名映射为含蓄显示名、器阶与AI短提示', () => {
    expect(getItemDisplayName('铃铛项圈')).toBe('听铃颈环');
    expect(getContrabandTier('铃铛项圈')).toBe('启羞器阶');
    expect(getItemShortHint('铃铛项圈')).toContain('铃声');
  });

  it('丹药逻辑名映射为显示名、分类、作用线与AI短提示', () => {
    expect(getItemDisplayName('体香丹')).toBe('引香丹');
    expect(getPillCategory('体香丹')).toBe('永久丹药');
    expect(getPillEffectLine('体香丹')).toBe('体态/社交');
    expect(getItemShortHint('体香丹')).toContain('体香');
  });

  it('场景逻辑地点映射为商城令牌名与AI短提示', () => {
    expect(getItemDisplayName('药庐暖阁')).toBe('暖炉试香令');
    expect(getItemShortHint('药庐暖阁')).toContain('试药');
  });

  it('剧情逻辑名映射为商城信物名、剧情线与AI短提示', () => {
    expect(getItemDisplayName('白芷旧誓线')).toBe('断鸢玉扣');
    expect(getItemShortHint('白芷旧誓线')).toContain('旧誓');
    expect(特殊剧情).toHaveLength(5);
  });

  it('识别牝奴服只允许玩家装备', () => {
    expect(isPlayerOnlyOutfit('牝奴链甲')).toBe(true);
    expect(isPlayerOnlyOutfit('透视罗裙')).toBe(false);
  });

  it('识别命契专属服归属 NPC', () => {
    expect(getExclusiveOutfitNpc('白芷仙奴服')).toBe('白芷');
    expect(getExclusiveOutfitNpc('苏芸仙奴服')).toBe('苏芸');
    expect(getExclusiveOutfitNpc('透视罗裙')).toBeUndefined();
  });

  it('世界书服装叙事规则存在并包含通用读取规则与仙奴服规则', () => {
    const yaml = readFileSync('src/雌堕合欢宗/世界书/道具/服装叙事规则.yaml', 'utf-8');
    expect(yaml).toContain('服装装备读取规则');
    expect(yaml).toContain('道具.装备.玩家');
    expect(yaml).toContain('白芷仙奴服');
    expect(yaml).toContain('不机械复述');
  });

  it('角色卡入口挂载服装叙事世界书为绿灯资料库，避免完整规则蓝灯常驻', () => {
    const indexYaml = readFileSync('src/雌堕合欢宗/index.yaml', 'utf-8');
    expect(indexYaml).toContain('名称: 服装叙事规则');
    expect(indexYaml).toMatch(/名称: 服装叙事规则[\s\S]*?激活策略:[\s\S]*?类型: 绿灯/);
    expect(indexYaml).toMatch(/名称: 服装叙事规则[\s\S]*?关键字:[\s\S]*?- 服装叙事规则[\s\S]*?- 道具\.装备/);
    expect(indexYaml).toContain('文件: 世界书/道具/服装叙事规则');
  });

  it('角色卡入口通过后端校验脚本加载服装叙事动态注入', () => {
    const indexYaml = readFileSync('src/雌堕合欢宗/index.yaml', 'utf-8');
    const backend = readFileSync('src/雌堕合欢宗/脚本/后端校验/index.ts', 'utf-8');
    const runtime = readFileSync('src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.ts', 'utf-8');

    expect(backend).toContain("createNarrativePromptRuntime");
    expect(backend).toContain("from './narrativePromptRuntime';");
    expect(runtime).toContain("import { buildOutfitPrompt } from '../服装叙事注入/outfitPrompt';");
    expect(runtime).toContain('hehuan-current-outfit-summary');
    expect(indexYaml).toContain('名称: 后端校验');
    expect(indexYaml).toContain("import 'http://localhost:5500/dist/backend_validate.js';");
    expect(indexYaml).not.toContain('名称: 服装叙事注入');
  });

  it('角色卡入口通过后端校验脚本加载禁器叙事动态注入', () => {
    const indexYaml = readFileSync('src/雌堕合欢宗/index.yaml', 'utf-8');
    const backend = readFileSync('src/雌堕合欢宗/脚本/后端校验/index.ts', 'utf-8');
    const runtime = readFileSync('src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.ts', 'utf-8');

    expect(backend).toContain("createNarrativePromptRuntime");
    expect(backend).toContain("from './narrativePromptRuntime';");
    expect(runtime).toContain("import { buildContrabandPrompt } from '../服装叙事注入/contrabandPrompt';");
    expect(runtime).toContain('hehuan-current-contraband-summary');
    expect(indexYaml).toContain('名称: 后端校验');
    expect(indexYaml).toContain("import 'http://localhost:5500/dist/backend_validate.js';");
    expect(indexYaml).not.toContain('名称: 禁器叙事注入');
  });

  it('世界书服装叙事规则覆盖 outfits.ts 的全部逻辑服装', () => {
    const yaml = readFileSync('src/雌堕合欢宗/世界书/道具/服装叙事规则.yaml', 'utf-8');
    for (const outfit of 服装列表) {
      expect(yaml, `missing narrative rule for ${outfit.名称}`).toContain(`  ${outfit.名称}:`);
    }
  });

  it('世界书禁器叙事规则覆盖全部禁器逻辑名并作为绿灯资料库挂载', () => {
    const yaml = readFileSync('src/雌堕合欢宗/世界书/道具/禁器叙事规则.yaml', 'utf-8');
    const indexYaml = readFileSync('src/雌堕合欢宗/index.yaml', 'utf-8');
    expect(yaml).toContain('禁器装备读取规则');
    expect(yaml).toContain('器阶');
    for (const item of NSFW道具) {
      expect(yaml, `missing narrative rule for ${item.名称}`).toContain(`  ${item.名称}:`);
    }
    expect(indexYaml).toMatch(/名称: 禁器叙事规则[\s\S]*?激活策略:[\s\S]*?类型: 绿灯/);
    expect(indexYaml).toContain('文件: 世界书/道具/禁器叙事规则');
  });

  it('世界书丹药叙事规则覆盖全部丹药逻辑名并作为绿灯资料库挂载', () => {
    const yaml = readFileSync('src/雌堕合欢宗/世界书/道具/丹药叙事规则.yaml', 'utf-8');
    const indexYaml = readFileSync('src/雌堕合欢宗/index.yaml', 'utf-8');
    expect(yaml).toContain('丹药使用读取规则');
    for (const item of 永久丹药) {
      expect(yaml, `missing pill narrative rule for ${item.名称}`).toContain(`  ${item.名称}:`);
    }
    expect(indexYaml).toMatch(/名称: 丹药叙事规则[\s\S]*?激活策略:[\s\S]*?类型: 绿灯/);
    expect(indexYaml).toContain('文件: 世界书/道具/丹药叙事规则');
  });

  it('世界书场景叙事规则覆盖全部真实场景名并作为绿灯资料库挂载', () => {
    const yaml = readFileSync('src/雌堕合欢宗/世界书/道具/场景叙事规则.yaml', 'utf-8');
    const indexYaml = readFileSync('src/雌堕合欢宗/index.yaml', 'utf-8');

    expect(yaml).toContain('场景购买读取规则');
    expect(yaml).toContain('场景.已解锁');
    expect(yaml).toContain('商城显示名不是解锁地点');
    for (const scene of 特殊场景) {
      expect(yaml, `missing scene narrative rule for ${scene.名称}`).toContain(`  ${scene.名称}:`);
      expect(yaml, `missing scene token name for ${scene.名称}`).toContain(`显示名: ${scene.显示名}`);
    }
    expect(indexYaml).toMatch(/名称: 场景叙事规则[\s\S]*?激活策略:[\s\S]*?类型: 绿灯/);
    expect(indexYaml).toContain('文件: 世界书/道具/场景叙事规则');
  });

  it('世界书剧情叙事规则覆盖全部剧情钥匙并作为绿灯资料库挂载', () => {
    const yaml = readFileSync('src/雌堕合欢宗/世界书/道具/剧情叙事规则.yaml', 'utf-8');
    const indexYaml = readFileSync('src/雌堕合欢宗/index.yaml', 'utf-8');

    expect(yaml).toContain('剧情购买读取规则');
    expect(yaml).toContain('剧情.已解锁');
    expect(yaml).toContain('不是一次性剧透');
    for (const story of 特殊剧情) {
      expect(yaml, `missing story narrative rule for ${story.名称}`).toContain(`  ${story.名称}:`);
      expect(yaml, `missing story token name for ${story.名称}`).toContain(`显示名: ${story.显示名}`);
    }
    expect(indexYaml).toMatch(/名称: 剧情叙事规则[\s\S]*?激活策略:[\s\S]*?类型: 绿灯/);
    expect(indexYaml).toContain('文件: 世界书/道具/剧情叙事规则');
  });

  it('特殊道具支持显示名与 AI 短提示，含原生世界观锚点道具', () => {
    expect(特殊道具).toHaveLength(5);
    expect(getItemDisplayName('欲海遮蔽符')).toBe('欲海遮蔽符');
    expect(getItemShortHint('欲海遮蔽符')).toContain('气息');
    expect(getItemShortHint('欲海回声')).toContain('青云道人');
    expect(getItemShortHint('投欲钥')).toContain('欲海核心');
  });

  it('世界书特殊道具事件规则覆盖三件原生道具并作为绿灯资料库挂载', () => {
    const yaml = readFileSync('src/雌堕合欢宗/世界书/道具/特殊道具事件规则.yaml', 'utf-8');
    const indexYaml = readFileSync('src/雌堕合欢宗/index.yaml', 'utf-8');

    expect(yaml).toContain('特殊道具事件读取规则');
    expect(yaml).toContain('事件种子');
    expect(yaml).toContain('  欲海遮蔽符:');
    expect(yaml).toContain('  欲海回声:');
    expect(yaml).toContain('  投欲钥:');
    expect(yaml).toContain('青云道人');
    expect(yaml).toContain('欲海核心');
    expect(indexYaml).toMatch(/名称: 特殊道具事件规则[\s\S]*?激活策略:[\s\S]*?类型: 绿灯/);
    expect(indexYaml).toContain('文件: 世界书/道具/特殊道具事件规则');
  });
});
