// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { NSFW道具, 永久丹药, 牝奴道具, 所有道具, 牝奴期可用道具 } from './items';
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

  it('永久丹药均为消耗品类型', () => {
    永久丹药.forEach(item => {
      expect(item.类型).toBe('消耗品');
    });
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