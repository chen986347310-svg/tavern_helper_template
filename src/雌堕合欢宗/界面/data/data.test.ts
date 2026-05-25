// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { NSFW道具, 永久丹药, 禁器器阶, 丹药分类, 丹药药阶, 牝奴道具, 所有道具, 牝奴期可用道具 } from './items';
import { 服装列表, 牝奴服装列表, 服装系列 } from './outfits';

describe('道具常量表完整性', () => {
  it('所有道具无重复名称', () => {
    const names = 所有道具.map(i => i.名称);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('所有道具价格非负', () => {
    所有道具.forEach(item => {
      expect(item.价格).toBeGreaterThanOrEqual(0);
    });
  });

  it('NSFW道具均为装备类型', () => {
    NSFW道具.forEach(item => {
      expect(item.类型).toBe('装备');
    });
  });

  it('禁器扩展为四个器阶且每阶至少六件', () => {
    expect(禁器器阶).toEqual(['启羞器阶', '缚身器阶', '化器器阶', '命契器阶']);
    expect(NSFW道具).toHaveLength(24);
    for (const tier of 禁器器阶) {
      expect(NSFW道具.filter(item => item.器阶 === tier)).toHaveLength(6);
    }
  });

  it('禁器保留逻辑名并提供含蓄显示名、器阶和AI短提示', () => {
    const collar = NSFW道具.find(item => item.名称 === '铃铛项圈');
    expect(collar).toMatchObject({
      显示名: '听铃颈环',
      器阶: '启羞器阶',
      系列: '听命系',
      作用部位: '颈项',
    });
    expect(collar?.羞耻触发).toContain('铃声泄露');
    expect(collar?.描述).toContain('戴在脖颈');
    expect(collar?.AI短提示).toContain('铃声');
  });

  it('永久丹药均为消耗品类型', () => {
    永久丹药.forEach(item => {
      expect(item.类型).toBe('消耗品');
    });
  });

  it('丹药扩展为临时、永久、仙奴三类共40枚', () => {
    expect(丹药分类).toEqual(['临时丹药', '永久丹药', '仙奴丹']);
    expect(丹药药阶).toEqual(['温药', '烈药', '永久药', '仙奴药']);
    expect(永久丹药).toHaveLength(40);
    expect(永久丹药.filter(item => item.分类 === '临时丹药')).toHaveLength(12);
    expect(永久丹药.filter(item => item.分类 === '永久丹药')).toHaveLength(12);
    expect(永久丹药.filter(item => item.分类 === '仙奴丹')).toHaveLength(16);
  });

  it('丹药保留旧逻辑名并提供显示名、作用线与AI短提示', () => {
    const scentPill = 永久丹药.find(item => item.名称 === '体香丹');
    expect(scentPill).toMatchObject({
      显示名: '引香丹',
      分类: '永久丹药',
      药阶: '永久药',
      作用线: '体态/社交',
      服务对象: 'NPC',
    });
    expect(scentPill?.设计驱动).toContain('体香成为长期身体标识');
    expect(scentPill?.即时反应).toContain('喉间微甜');
    expect(scentPill?.场景外显).toContain('香气更明显');
    expect(scentPill?.长期痕迹).toContain('身体标签');
    expect(scentPill?.AI短提示).toContain('体香');
  });

  it('仙奴丹使用状态门槛并服务性与身体可玩乐化', () => {
    const servantPill = 永久丹药.find(item => item.名称 === '玉户听命丹');
    expect(servantPill).toMatchObject({
      显示名: '玉户丹',
      分类: '仙奴丹',
      药阶: '仙奴药',
      状态门槛: '仙奴',
      服务用途: '私处命令反应',
    });
    expect(servantPill?.性功能变化).toContain('命令不必触碰');
    expect(servantPill?.长期玩法).toContain('禁器');
  });

  it('牝奴道具4件套完整', () => {
    expect(牝奴道具).toHaveLength(4);
    const names = 牝奴道具.map(i => i.名称);
    expect(names).toContain('牝印');
    expect(names).toContain('牝环');
    expect(names).toContain('牝铃');
    expect(names).toContain('牝链');
  });

  it('牝奴道具均为装备类型且标记专属', () => {
    牝奴道具.forEach(item => {
      expect(item.类型).toBe('装备');
      expect(item.牝奴专属).toBe(true);
    });
  });

  it('牝奴期可用道具包含全部牝奴道具名', () => {
    牝奴道具.forEach(item => {
      expect(牝奴期可用道具).toContain(item.名称);
    });
  });

  it('所有道具包含牝奴道具', () => {
    牝奴道具.forEach(item => {
      expect(所有道具).toContainEqual(item);
    });
  });
});

describe('服装常量表完整性', () => {
  it('服装列表无重复名称', () => {
    const names = 服装列表.map(o => o.名称);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('服装价格非负', () => {
    服装列表.forEach(o => {
      expect(o.价格).toBeGreaterThanOrEqual(0);
    });
  });

  it('牝奴服装4套完整', () => {
    expect(牝奴服装列表).toHaveLength(4);
    const names = 牝奴服装列表.map(o => o.名称);
    expect(names).toContain('牝奴素衣');
    expect(names).toContain('牝奴纹衣');
    expect(names).toContain('牝奴链甲');
    expect(names).toContain('牝奴礼服');
  });

  it('牝奴服装均属于牝奴系', () => {
    牝奴服装列表.forEach(o => {
      expect(o.系列).toBe('牝奴系');
    });
  });

  it('牝奴服装包含在服装列表中', () => {
    牝奴服装列表.forEach(o => {
      expect(服装列表).toContainEqual(o);
    });
  });

  it('服装系列包含牝奴系', () => {
    expect(服装系列).toContain('牝奴系');
  });

  it('所有服装好感度门槛非负', () => {
    服装列表.forEach(o => {
      expect(o.好感度门槛).toBeGreaterThanOrEqual(0);
    });
  });
});
