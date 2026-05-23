// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import {
  get反噬倍率,
  get场景NPC列表,
  get在场NPC列表,
  get窃听成功率,
  get窃听阶段,
  perform灵识窃取,
} from './guards';

const npcStates = {
  白芷: { 当前场景: '莲灯前苑' },
  苏芸: { 当前场景: '醉玉小筑' },
  纪兰: { 当前场景: '绮梦幽阁' },
  沈月秋: { 当前场景: '醉玉小筑' },
  柳素衣: { 当前场景: '莲灯前苑' },
} as any;

describe('场景感知守卫', () => {
  it('只返回当前场景存在的NPC，并保持攻略链顺序', () => {
    expect(get场景NPC列表(npcStates, '莲灯前苑')).toEqual(['白芷', '柳素衣']);
    expect(get场景NPC列表(npcStates, '醉玉小筑')).toEqual(['苏芸', '沈月秋']);
    expect(get场景NPC列表(npcStates, '绮梦幽阁')).toEqual(['纪兰']);
  });
});

describe('灵识窃取守卫', () => {
  it('按攻略值映射警戒、动摇、沉沦阶段', () => {
    expect(get窃听阶段(0)).toBe('警戒');
    expect(get窃听阶段(30)).toBe('警戒');
    expect(get窃听阶段(31)).toBe('动摇');
    expect(get窃听阶段(70)).toBe('动摇');
    expect(get窃听阶段(71)).toBe('沉沦');
  });

  it('按场景提供成功率与反噬倍率', () => {
    expect(get窃听成功率('莲灯前苑')).toBe(0.6);
    expect(get窃听成功率('醉玉小筑')).toBe(0.75);
    expect(get窃听成功率('绮梦幽阁')).toBe(0.9);
    expect(get反噬倍率('莲灯前苑')).toBe(0.5);
    expect(get反噬倍率('醉玉小筑')).toBe(1);
    expect(get反噬倍率('绮梦幽阁')).toBe(1.5);
  });

  it('使用固定roll稳定判定成功，并返回阶段与最终成功率', () => {
    expect(perform灵识窃取(0, 45, '醉玉小筑', 0.7)).toEqual({
      success: true,
      backlash: 0,
      stage: '动摇',
      successRate: 0.75,
    });
  });

  it('失败时按攻略值和场景倍率计算反噬', () => {
    expect(perform灵识窃取(0, 20, '绮梦幽阁', 0.95)).toEqual({
      success: false,
      backlash: 6,
      stage: '警戒',
      successRate: 0.9,
    });
  });

  it('粘滞计数最多提供18%成功率增益，并封顶98%', () => {
    expect(perform灵识窃取(99, 90, '绮梦幽阁', 0.97).successRate).toBe(0.98);
    expect(perform灵识窃取(3, 90, '莲灯前苑', 0.65).successRate).toBeCloseTo(0.66);
  });
});