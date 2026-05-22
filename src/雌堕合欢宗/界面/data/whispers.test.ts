// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { getRandomWhisper, 心里话库 } from './whispers';

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
const 场景列表 = ['莲灯前苑', '醉玉小筑', '绮梦幽阁'] as const;
const 阶段列表 = ['警戒', '动摇', '沉沦'] as const;

describe('心里话文案库结构', () => {
  it('覆盖5名NPC、3个场景与3个窃听阶段', () => {
    for (const npc of NPC列表) {
      expect(心里话库[npc]).toBeDefined();
      for (const scene of 场景列表) {
        expect(心里话库[npc][scene]).toBeDefined();
        for (const stage of 阶段列表) {
          expect(心里话库[npc][scene][stage].length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('按索引稳定返回非空文本', () => {
    expect(getRandomWhisper('白芷', '莲灯前苑', '警戒', 0).trim().length).toBeGreaterThan(0);
    expect(getRandomWhisper('柳素衣', '绮梦幽阁', '沉沦', 99).trim().length).toBeGreaterThan(0);
  });
});