import { describe, expect, it } from 'vitest';

import { get命令状态, get堕落语义, get牝阴决语义, get羞名Marker, get支配者称谓 } from './phase2Display';

describe('phase2Display', () => {
  it('maps corruption into immersive labels', () => {
    expect(get堕落语义(0).label).toBe('未刻');
    expect(get堕落语义(52).label).toBe('纹醒');
    expect(get堕落语义(91).label).toBe('烙成');
  });

  it('maps command intensity into stigma state', () => {
    expect(get命令状态('', 0).state).toBe('沉寂');
    expect(get命令状态('跪候传唤', 55).state).toBe('发热');
    expect(get命令状态('当众应名', 88).state).toBe('强制');
  });

  it('maps yinjue layer and shame markers', () => {
    expect(get牝阴决语义(0).label).toBe('未启');
    expect(get牝阴决语义(5).label).toBe('入髓');
    expect(get羞名Marker('烙名').glyph).toBe('烙');
  });

  it('keeps dominator names world-facing', () => {
    expect(get支配者称谓('柳素衣').title).toContain('柳素衣');
    expect(get支配者称谓('').title).toBe('无人牵丝');
  });

  it('clamps invalid numeric inputs into safe display ranges', () => {
    expect(get堕落语义(Number.NaN).label).toBe('未刻');
    expect(get堕落语义(999).label).toBe('烙成');
    expect(get牝阴决语义(-3).label).toBe('未启');
    expect(get命令状态('试令', Infinity).state).toBe('发热');
  });
});
