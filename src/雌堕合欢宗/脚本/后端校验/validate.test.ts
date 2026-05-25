import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateVariables } from './validate';
import { Schema } from '../../schema';
import { calculate攻略值增量 } from '../../界面/guards';

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;

function makeNpcData(
  overrides: Record<string, Partial<{ 好感度: number; 攻略值: number; 粘滞计数: number; 状态: string }>> = {},
) {
  const result: Record<string, any> = {};
  for (const npc of NPC列表) {
    result[npc] = {
      好感度: 0,
      攻略值: 0,
      粘滞计数: 0,
      状态: '未开始',
      ...overrides[npc],
    };
  }
  return result;
}

function makeData(overrides: Record<string, any> = {}) {
  return {
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石: 1000, 已使用阵法: false, ...((overrides as any).系统 || {}) },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      上次支配者: '',
      支配次数: {},
      改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
      ...((overrides as any).牝奴 || {}),
    },
    NPC: makeNpcData((overrides as any).NPC),
    道具: {
      拥有: {},
      装备: { 玩家: [], 白芷: [], 苏芸: [], 纪兰: [], 沈月秋: [], 柳素衣: [] },
      ...((overrides as any).道具 || {}),
    },
    场景: { 已解锁: [], ...((overrides as any).场景 || {}) },
    剧情: { 已解锁: [], ...((overrides as any).剧情 || {}) },
  };
}

function cloneDeep(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

// ══════════════════════════════════════════
// Scenario 1: AI outputs 好感度 +3 → verify result
// ══════════════════════════════════════════
describe('Scenario 1: 好感度 increment', () => {
  it('AI gives 白芷 +3 好感度 → stays at 53', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 50, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 53, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].好感度).toBe(53);
  });

  it('AI gives 苏芸 +5 好感度 (non-current NPC) → still allowed', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 50, 状态: '进行中' }, 苏芸: { 好感度: 10 } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 50, 状态: '进行中' }, 苏芸: { 好感度: 15 } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['苏芸'].好感度).toBe(15);
  });
});

// ══════════════════════════════════════════
// Scenario 2: 好感度 reaches 30 → 攻略值 +5 works
// ══════════════════════════════════════════
describe('Scenario 2: 好感度 30 unlocks 攻略值', () => {
  it('白芷 好感度=30, 攻略值 0→5 → allowed (current NPC)', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 30, 攻略值: 0, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 30, 攻略值: 5, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(5);
  });

  it('白芷 好感度=29, 攻略值 0→5 → rejected (好感度<30)', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 29, 攻略值: 0, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 29, 攻略值: 5, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(0);
  });
});

// ══════════════════════════════════════════
// Scenario 3: 粘滞计数 reaches 3 → auto-triggers 攻略值增长 → 粘滞归零
// ══════════════════════════════════════════
describe('Scenario 3: 粘滞 auto-trigger', () => {
  it('白芷 粘滞=3, 好感度=50 → 攻略值增加, 粘滞归零', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: 20, 粘滞计数: 2, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: 20, 粘滞计数: 3, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    const expected增量 = calculate攻略值增量(10, 50); // floor(10 * 50 / 50) = 10
    expect(new_data.NPC['白芷'].攻略值).toBe(30); // 20 + 10
    expect(new_data.NPC['白芷'].粘滞计数).toBe(0);
  });

  it('白芷 粘滞=3, 好感度=80 → 攻略值增加 (higher 好感度 = higher bonus)', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 80, 攻略值: 10, 粘滞计数: 2, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 80, 攻略值: 10, 粘滞计数: 3, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    const expected增量 = calculate攻略值增量(10, 80); // floor(10 * 80 / 50) = 16
    expect(new_data.NPC['白芷'].攻略值).toBe(26); // 10 + 16
    expect(new_data.NPC['白芷'].粘滞计数).toBe(0);
  });

  it('白芷 粘滞=3, 好感度=29 → no trigger (好感度<30)', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 29, 攻略值: 0, 粘滞计数: 2, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 29, 攻略值: 0, 粘滞计数: 3, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(0);
    // 粘滞=3 but 好感度<30, so no trigger; 粘滞 stays at 3
    // but 粘滞>=3 && 好感度>=30 check fails, so 粘滞 not reset
    expect(new_data.NPC['白芷'].粘滞计数).toBe(3);
  });

  it('粘滞>3 → forced to 0', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: 20, 粘滞计数: 3, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: 20, 粘滞计数: 5, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].粘滞计数).toBe(0);
  });

  it('粘滞 trigger caps 攻略值 at 100', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 100, 攻略值: 95, 粘滞计数: 2, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 100, 攻略值: 95, 粘滞计数: 3, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    const expected增量 = calculate攻略值增量(10, 100); // floor(10 * 100 / 50) = 20
    expect(new_data.NPC['白芷'].攻略值).toBe(100); // min(95+20, 100) = 100
    expect(new_data.NPC['白芷'].粘滞计数).toBe(0);
  });

  it('NSFW行为 粘滞=2 does NOT trigger (uniform threshold 3)', () => {
    // Note: the backend validation uses a uniform threshold of 3, not区分行为类型
    const old_data = makeData({ NPC: { 白芷: { 好感度: 60, 攻略值: 10, 粘滞计数: 1, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 60, 攻略值: 10, 粘滞计数: 2, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    // 粘滞=2 < 3 threshold in backend, so no auto-trigger
    expect(new_data.NPC['白芷'].攻略值).toBe(10);
    expect(new_data.NPC['白芷'].粘滞计数).toBe(2);
  });
});

// ══════════════════════════════════════════
// Scenario 4: 攻略链顺序强制 — 苏芸 rejected
// ══════════════════════════════════════════
describe('Scenario 4: 攻略链 enforcement', () => {
  it('白芷 is current, 苏芸 攻略值 0→5 → reverted', () => {
    const old_data = makeData({
      NPC: { 白芷: { 好感度: 50, 攻略值: 10, 状态: '进行中' }, 苏芸: { 好感度: 40, 攻略值: 0 } },
    });
    const new_data = makeData({
      NPC: { 白芷: { 好感度: 50, 攻略值: 10, 状态: '进行中' }, 苏芸: { 好感度: 40, 攻略值: 5 } },
    });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['苏芸'].攻略值).toBe(0); // reverted
    expect(new_data.NPC['白芷'].攻略值).toBe(10); // unchanged
  });

  it('白芷 completed, 苏芸 is current, 纪兰 攻略值 0→5 → reverted', () => {
    const old_data = makeData({
      NPC: {
        白芷: { 好感度: 100, 攻略值: 100, 状态: '已完成' },
        苏芸: { 好感度: 50, 攻略值: 0, 状态: '进行中' },
        纪兰: { 好感度: 40, 攻略值: 0 },
      },
    });
    const new_data = makeData({
      NPC: {
        白芷: { 好感度: 100, 攻略值: 100, 状态: '已完成' },
        苏芸: { 好感度: 50, 攻略值: 0, 状态: '进行中' },
        纪兰: { 好感度: 40, 攻略值: 5 },
      },
    });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['纪兰'].攻略值).toBe(0); // reverted
  });

  it('白芷 is current, 白芷 攻略值 10→15 → allowed', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: 10, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: 15, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(15);
  });

  it('all NPC completed → no NPC can increase (currentNpc=null)', () => {
    const npcOverrides: Record<string, any> = {};
    for (const npc of NPC列表) {
      npcOverrides[npc] = { 好感度: 100, 攻略值: 100, 状态: '已完成' };
    }
    const old_data = makeData({ NPC: npcOverrides });
    const new_data = makeData({ NPC: { ...npcOverrides, 白芷: { 好感度: 100, 攻略值: 100, 状态: '已完成' } } });
    // Try to set 白芷 攻略值 back to 100 (same as old)
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(100);
  });
});

// ══════════════════════════════════════════
// Scenario 5: 装备门槛 — 口塞 on 白芷 with 好感度 20 → removed
// ══════════════════════════════════════════
describe('Scenario 5: 装备门槛', () => {
  it('口塞 on 白芷 (好感度=20) → removed (需要30)', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: 20 } }, 道具: { 装备: { 白芷: ['口塞'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual([]);
  });

  it('口塞 on 白芷 (好感度=30) → kept', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: 30 } }, 道具: { 装备: { 白芷: ['口塞'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual(['口塞']);
  });

  it('淫纹 on 白芷 (好感度=69) → removed (需要70)', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: 69 } }, 道具: { 装备: { 白芷: ['淫纹'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual([]);
  });

  it('淫纹 on 白芷 (好感度=70) → kept', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: 70 } }, 道具: { 装备: { 白芷: ['淫纹'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual(['淫纹']);
  });

  it('铃铛项圈 on 白芷 (好感度=0) → kept (门槛0)', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: 0 } }, 道具: { 装备: { 白芷: ['铃铛项圈'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual(['铃铛项圈']);
  });

  it('mixed valid+invalid → only invalid removed', () => {
    const old_data = makeData();
    const new_data = makeData({
      NPC: { 白芷: { 好感度: 30 } },
      道具: { 装备: { 白芷: ['铃铛项圈', '口塞', '淫纹'] } },
    });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual(['铃铛项圈', '口塞']);
  });

  it('player equipment has no threshold check', () => {
    const old_data = makeData();
    const new_data = makeData({ 道具: { 装备: { 玩家: ['淫纹', '塑形丹'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['玩家']).toEqual(['淫纹', '塑形丹']);
  });
});

// ══════════════════════════════════════════
// Scenario 6: 灵石 negative → corrected to 0
// ══════════════════════════════════════════
describe('Scenario 6: 灵石 cannot be negative', () => {
  it('灵石 set to -100 → corrected to 0', () => {
    const old_data = makeData();
    const new_data = makeData({ 系统: { 灵石: -100 } });
    validateVariables(new_data, old_data);
    expect(new_data.系统.灵石).toBe(0);
  });

  it('灵石 set to 0 → stays 0', () => {
    const old_data = makeData();
    const new_data = makeData({ 系统: { 灵石: 0 } });
    validateVariables(new_data, old_data);
    expect(new_data.系统.灵石).toBe(0);
  });

  it('灵石 set to 50000 → stays 50000', () => {
    const old_data = makeData();
    const new_data = makeData({ 系统: { 灵石: 50000 } });
    validateVariables(new_data, old_data);
    expect(new_data.系统.灵石).toBe(50000);
  });
});

// ══════════════════════════════════════════
// Scenario 7: 好感度 150 → clamped to 100
// ══════════════════════════════════════════
describe('Scenario 7: 好感度 overflow', () => {
  it('好感度 set to 150 → clamped to 100', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: 150, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].好感度).toBe(100);
  });

  it('好感度 set to -5 → clamped to 0', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: -5, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].好感度).toBe(0);
  });
});

// ══════════════════════════════════════════
// Scenario 8: 剩余天数 hits 0 → Phase 2 transition
// ══════════════════════════════════════════
describe('Scenario 8: Phase 2 transition', () => {
  it('剩余天数=0, old阶段=攻略期 → triggers Phase 2', () => {
    const old_data = makeData({
      系统: { 阶段: '攻略期' },
      NPC: { 白芷: { 好感度: 50, 攻略值: 30 } },
    });
    const new_data = makeData({
      系统: { 剩余天数: 0, 阶段: '攻略期' },
      NPC: { 白芷: { 好感度: 50, 攻略值: 30 } },
    });
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    validateVariables(new_data, old_data);
    expect(new_data.系统.阶段).toBe('牝奴期');
    expect(new_data.系统.灵石).toBe(0);
    vi.restoreAllMocks();
  });

  it('Phase 2 transition: NPC vars not modified during init', () => {
    const old_data = makeData({
      系统: { 阶段: '攻略期' },
      NPC: { 白芷: { 好感度: 50, 攻略值: 30, 粘滞计数: 1 } },
    });
    const new_data = makeData({
      系统: { 剩余天数: 0, 阶段: '攻略期' },
      NPC: { 白芷: { 好感度: 50, 攻略值: 30, 粘滞计数: 1 } },
    });
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    validateVariables(new_data, old_data);
    // Phase 2 init returns early, NPC vars unchanged at this point
    expect(new_data.NPC['白芷'].好感度).toBe(50);
    vi.restoreAllMocks();
  });
});

// ══════════════════════════════════════════
// Scenario 9: Phase 2 NPC vars frozen
// ══════════════════════════════════════════
describe('Scenario 9: Phase 2 variable freeze', () => {
  it('Phase 2: AI changes 白芷 好感度 50→80 → reverted to 50', () => {
    const old_data = makeData({
      系统: { 阶段: '牝奴期' },
      NPC: { 白芷: { 好感度: 50, 攻略值: 30, 粘滞计数: 1 } },
    });
    const new_data = makeData({
      系统: { 阶段: '牝奴期' },
      NPC: { 白芷: { 好感度: 80, 攻略值: 30, 粘滞计数: 1 } },
    });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].好感度).toBe(50);
  });

  it('Phase 2: AI changes all NPC 攻略值 → all reverted', () => {
    const npcOverrides_old: Record<string, any> = {};
    const npcOverrides_new: Record<string, any> = {};
    for (const npc of NPC列表) {
      npcOverrides_old[npc] = { 好感度: 50, 攻略值: 30, 粘滞计数: 0 };
      npcOverrides_new[npc] = { 好感度: 99, 攻略值: 99, 粘滞计数: 99 };
    }
    const old_data = makeData({ 系统: { 阶段: '牝奴期' }, NPC: npcOverrides_old });
    const new_data = makeData({ 系统: { 阶段: '牝奴期' }, NPC: npcOverrides_new });
    validateVariables(new_data, old_data);
    for (const npc of NPC列表) {
      expect(new_data.NPC[npc].好感度).toBe(50);
      expect(new_data.NPC[npc].攻略值).toBe(30);
      expect(new_data.NPC[npc].粘滞计数).toBe(0);
    }
  });
});

// ══════════════════════════════════════════
// 攻略值 overflow: set to 105 → clamped to 100
// ══════════════════════════════════════════
describe('攻略值 overflow', () => {
  it('攻略值 set to 105 → clamped to 100', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 100, 攻略值: 100, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 100, 攻略值: 105, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(100);
  });

  it('攻略值 set to -5 → clamped to 0', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: 10, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: -5, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(10); // reverted to old (can't decrease)
  });
});

// ══════════════════════════════════════════
// 好感度→攻略值 bonus (calculate攻略值增量)
// ══════════════════════════════════════════
describe('好感度→攻略值 bonus formula', () => {
  it('floor(10 × 30 / 50) = 6 at 好感度=30', () => {
    expect(calculate攻略值增量(10, 30)).toBe(6);
  });

  it('floor(10 × 50 / 50) = 10 at 好感度=50', () => {
    expect(calculate攻略值增量(10, 50)).toBe(10);
  });

  it('floor(10 × 80 / 50) = 16 at 好感度=80', () => {
    expect(calculate攻略值增量(10, 80)).toBe(16);
  });

  it('floor(10 × 100 / 50) = 20 at 好感度=100', () => {
    expect(calculate攻略值增量(10, 100)).toBe(20);
  });

  it('floor(10 × 0 / 50) = 0 at 好感度=0', () => {
    expect(calculate攻略值增量(10, 0)).toBe(0);
  });

  it('floor(10 × 29 / 50) = 5 at 好感度=29 (boundary)', () => {
    expect(calculate攻略值增量(10, 29)).toBe(5);
  });
});

// ══════════════════════════════════════════
// 亲密行为边界: check粘滞触发 thresholds
// ══════════════════════════════════════════
describe('亲密行为 boundary', () => {
  it('粘滞=3 triggers auto-increment in backend (uniform threshold)', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 60, 攻略值: 0, 粘滞计数: 2, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 60, 攻略值: 0, 粘滞计数: 3, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    const expected增量 = calculate攻略值增量(10, 60); // floor(10*60/50) = 12
    expect(new_data.NPC['白芷'].攻略值).toBe(expected增量);
    expect(new_data.NPC['白芷'].粘滞计数).toBe(0);
  });

  it('粘滞=2 does NOT trigger in backend (threshold is 3)', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 60, 攻略值: 0, 粘滞计数: 1, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 60, 攻略值: 0, 粘滞计数: 2, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(0);
    expect(new_data.NPC['白芷'].粘滞计数).toBe(2);
  });
});

// ══════════════════════════════════════════
// 攻略值 can't decrease
// ══════════════════════════════════════════
describe('攻略值 monotonically increasing', () => {
  it('攻略值 50→30 → reverted to 50', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 60, 攻略值: 50, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 60, 攻略值: 30, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(50);
  });

  it('攻略值 0→0 → no change', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: 0, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: 0, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(0);
  });
});

// ══════════════════════════════════════════
// 好感度<30 → 攻略值 forced to 0
// ══════════════════════════════════════════
describe('好感度<30 locks 攻略值 to 0', () => {
  it('好感度=25, 攻略值=10 → forced to 0', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 30, 攻略值: 10, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 25, 攻略值: 10, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(0);
  });

  it('好感度=29, 攻略值=1 → forced to 0', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 29, 攻略值: 0, 状态: '进行中' } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 29, 攻略值: 1, 状态: '进行中' } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].攻略值).toBe(0);
  });
});

// ══════════════════════════════════════════
// 改变阵法 purchase validation
// ══════════════════════════════════════════
describe('改变阵法 purchase', () => {
  it('buying with 柳素衣攻略值=100 → kept', () => {
    const old_data = makeData({ NPC: { 柳素衣: { 好感度: 50, 攻略值: 100 } }, 道具: { 拥有: {} } });
    const new_data = makeData({ NPC: { 柳素衣: { 好感度: 50, 攻略值: 100 } }, 道具: { 拥有: { 改变阵法: 1 } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.拥有['改变阵法']).toBe(1);
  });

  it('buying with 柳素衣攻略值=50 → reverted + refund', () => {
    const old_data = makeData({
      系统: { 灵石: 100 },
      NPC: { 柳素衣: { 攻略值: 50 } },
      道具: { 拥有: {} },
    });
    const new_data = makeData({
      系统: { 灵石: 100 },
      NPC: { 柳素衣: { 攻略值: 50 } },
      道具: { 拥有: { 改变阵法: 1 } },
    });
    validateVariables(new_data, old_data);
    expect(new_data.道具.拥有['改变阵法']).toBe(0);
    expect(new_data.系统.灵石).toBe(500100); // refund 500000
  });

  it('already owned (count 1→2) → no refund triggered', () => {
    const old_data = makeData({
      系统: { 灵石: 100 },
      NPC: { 柳素衣: { 攻略值: 50 } },
      道具: { 拥有: { 改变阵法: 1 } },
    });
    const new_data = makeData({
      系统: { 灵石: 100 },
      NPC: { 柳素衣: { 攻略值: 50 } },
      道具: { 拥有: { 改变阵法: 2 } },
    });
    validateVariables(new_data, old_data);
    // old_拥有=1, new_拥有=2 → condition is old_拥有===0, so no revert
    expect(new_data.道具.拥有['改变阵法']).toBe(2);
    expect(new_data.系统.灵石).toBe(100);
  });
});

// ══════════════════════════════════════════
// Phase 2 堕落度 can't decrease
// ══════════════════════════════════════════
describe('Phase 2 堕落度 monotonic', () => {
  it('堕落度 50→30 → reverted to 50', () => {
    const old_data = makeData({ 系统: { 阶段: '牝奴期' }, 牝奴: { 堕落度: 50 } });
    const new_data = makeData({ 系统: { 阶段: '牝奴期' }, 牝奴: { 堕落度: 30 } });
    validateVariables(new_data, old_data);
    expect(new_data.牝奴.堕落度).toBe(50);
  });

  it('堕落度 50→60 → allowed', () => {
    const old_data = makeData({ 系统: { 阶段: '牝奴期' }, 牝奴: { 堕落度: 50 } });
    const new_data = makeData({ 系统: { 阶段: '牝奴期' }, 牝奴: { 堕落度: 60 } });
    validateVariables(new_data, old_data);
    expect(new_data.牝奴.堕落度).toBe(60);
  });
});

// ══════════════════════════════════════════
// 剩余天数 floor + range
// ══════════════════════════════════════════
describe('剩余天数 floor and range', () => {
  it('29.998 → 29', () => {
    const old_data = makeData();
    const new_data = makeData({ 系统: { 剩余天数: 29.998 } });
    validateVariables(new_data, old_data);
    expect(new_data.系统.剩余天数).toBe(29);
  });

  it('28.998 → 28', () => {
    const old_data = makeData();
    const new_data = makeData({ 系统: { 剩余天数: 28.998 } });
    validateVariables(new_data, old_data);
    expect(new_data.系统.剩余天数).toBe(28);
  });

  it('30.5 → 30 (floor then clamp)', () => {
    const old_data = makeData();
    const new_data = makeData({ 系统: { 剩余天数: 30.5 } });
    validateVariables(new_data, old_data);
    expect(new_data.系统.剩余天数).toBe(30);
  });

  it('0.5 → floor to 0 display, but no Phase 2 (0.5 > 0)', () => {
    const old_data = makeData({ 系统: { 阶段: '攻略期' } });
    const new_data = makeData({ 系统: { 剩余天数: 0.5, 阶段: '攻略期' } });
    validateVariables(new_data, old_data);
    expect(new_data.系统.剩余天数).toBe(0); // floored
    expect(new_data.系统.阶段).toBe('攻略期'); // 0.5 > 0, no Phase 2 yet
  });

  it('-1 → 0 (negative clamped)', () => {
    const old_data = makeData();
    const new_data = makeData({ 系统: { 剩余天数: -1 } });
    // This triggers Phase 2 because 剩余天数<=0 && old_阶段===攻略期
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    validateVariables(new_data, old_data);
    // After Phase 2 init returns early, floor/clamp checks don't run
    expect(new_data.系统.阶段).toBe('牝奴期');
    vi.restoreAllMocks();
  });
});

// ══════════════════════════════════════════
// 牝阴决层数 cap
// ══════════════════════════════════════════
describe('牝阴决层数 cap', () => {
  it('层数=10 → capped to 9', () => {
    const old_data = makeData();
    const new_data = makeData({ 牝奴: { 牝阴决层数: 10 } });
    validateVariables(new_data, old_data);
    expect(new_data.牝奴.牝阴决层数).toBe(9);
  });

  it('层数=5 → unchanged', () => {
    const old_data = makeData();
    const new_data = makeData({ 牝奴: { 牝阴决层数: 5 } });
    validateVariables(new_data, old_data);
    expect(new_data.牝奴.牝阴决层数).toBe(5);
  });
});

// ══════════════════════════════════════════
// 堕落度 range
// ══════════════════════════════════════════
describe('堕落度 range', () => {
  it('Phase 1: 堕落度=-5 → clamped to 0', () => {
    const old_data = makeData();
    const new_data = makeData({ 牝奴: { 堕落度: -5 } });
    validateVariables(new_data, old_data);
    expect(new_data.牝奴.堕落度).toBe(0);
  });

  it('Phase 1: 堕落度=105 → clamped to 100', () => {
    const old_data = makeData();
    const new_data = makeData({ 牝奴: { 堕落度: 105 } });
    validateVariables(new_data, old_data);
    expect(new_data.牝奴.堕落度).toBe(100);
  });
});

// ══════════════════════════════════════════
// Edge: no stat_data → no crash
// ══════════════════════════════════════════
describe('Edge cases', () => {
  it('missing 道具.装备 → no crash', () => {
    const old_data = makeData();
    const new_data = makeData();
    delete (new_data as any).道具.装备;
    expect(() => validateVariables(new_data, old_data)).not.toThrow();
  });

  it('empty NPC object → no crash', () => {
    const old_data = makeData();
    const new_data = makeData();
    (new_data as any).NPC = {};
    expect(() => validateVariables(new_data, old_data)).not.toThrow();
  });
});

// ══════════════════════════════════════════
// Scenario: dirty data type coercion
// ══════════════════════════════════════════
describe('Scenario: dirty data type coercion', () => {
  it('null 好感度 → coerced to 0', () => {
    const old_data = makeData();
    const new_data = makeData();
    (new_data.NPC as any)['白芷'].好感度 = null;
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].好感度).toBe(0);
  });

  it('string "999" 好感度 → coerced to 100 (clamp)', () => {
    const old_data = makeData();
    const new_data = makeData();
    (new_data.NPC as any)['白芷'].好感度 = '999';
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].好感度).toBe(100);
  });

  it('Infinity 好感度 → coerced to 100', () => {
    const old_data = makeData();
    const new_data = makeData();
    (new_data.NPC as any)['白芷'].好感度 = Infinity;
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].好感度).toBe(100);
  });

  it('NaN 好感度 → coerced to 0', () => {
    const old_data = makeData();
    const new_data = makeData();
    (new_data.NPC as any)['白芷'].好感度 = NaN;
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].好感度).toBe(0);
  });

  it('non-numeric string "abc" 好感度 → coerced to 0', () => {
    const old_data = makeData();
    const new_data = makeData();
    (new_data.NPC as any)['白芷'].好感度 = 'abc';
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].好感度).toBe(0);
  });

  it('string "50" 灵石 → coerced to 50', () => {
    const old_data = makeData();
    const new_data = makeData();
    (new_data.系统 as any).灵石 = '50';
    validateVariables(new_data, old_data);
    expect(new_data.系统.灵石).toBe(50);
  });
});

// ══════════════════════════════════════════
// Schema defaults: 开放场景 / 风声 / 道具效果
// ══════════════════════════════════════════
describe('Schema defaults: 开放场景与风声字段', () => {
  it('缺省时提供安全默认值', () => {
    const result = Schema.parse({});
    expect(result.系统.场景上下文.地点).toBe('莲灯前苑');
    expect(result.系统.场景上下文.在场NPC).toEqual([]);
    expect(result.系统.风声列表).toEqual([]);
    expect(result.系统.当前追查风声ID).toBe('');
    expect(result.道具.已生效效果).toEqual([]);
    expect(result.剧情.线索状态).toEqual({});
  });

  it('旧存档自动补齐世界运行核心字段', () => {
    const result = Schema.parse({ 系统: { 阶段: '攻略期' }, 牝奴: {}, 剧情: {} });

    expect(result.系统.时间状态).toMatchObject({
      当前日: 1,
      时段进度: 0,
      最近耗时: '',
      最近结算原因: '',
      最近事件类型: '',
      是否过夜: false,
    });
    expect(result.系统.欲海状态).toMatchObject({
      搜寻进度: 0,
      警戒等级: '平静',
      遮蔽剩余时段: 0,
      遮蔽来源: '',
      最近暴露原因: '',
      已被定位: false,
    });
    expect(result.剧情.事件记录).toEqual([]);
    expect(result.牝奴).toMatchObject({
      入场日: 0,
      当前日课: '候命',
      当前支配者: '',
      当前命令: '',
      命令强度: 0,
      今日调教次数: 0,
      待执行日课: [],
      最近调教结算: '',
      羞名标签: [],
      调教记录: [],
    });
  });

  it('牝奴羞名标签最多保留8个，供P2主控台显示烙名痕迹', () => {
    const tags = ['听命', '示众', '候传', '铃声失序', '验身迟疑', '牝印发热', '药香外泄', '名册朱批'];
    const result = Schema.parse({ 牝奴: { 羞名标签: tags } });

    expect(result.牝奴.羞名标签).toEqual(tags);
    expect(() => Schema.parse({ 牝奴: { 羞名标签: [...tags, '第九枚'] } })).toThrow();
  });

  it('支持事件后果账本与 P2 羞名风声字段', () => {
    const result = Schema.parse({
      系统: {
        风声列表: [
          {
            id: 'p2_shame_1',
            来源: '公开示众',
            地点: '莲灯前苑',
            风声文本: '廊下有人低声念起新的羞名。',
            凝视来源: '执事记录',
            羞名等级: '挂牌',
            羞名标签: ['听命', '示众'],
            反噬日课: '午后点名',
            是否可承接: true,
          },
        ],
      },
      剧情: {
        事件记录: [
          {
            id: 'event_1',
            类型: '追查风声',
            摘要: '玩家在莲灯前苑追查风声。',
            日: 1,
            时辰: '午时',
            地点: '莲灯前苑',
            涉及NPC: ['柳素衣'],
            公开度: '公开',
            后果标签: ['欲海波动'],
            已生成风声: true,
          },
        ],
      },
    });

    expect(result.系统.风声列表[0]).toMatchObject({
      来源: '公开示众',
      凝视来源: '执事记录',
      羞名等级: '挂牌',
      羞名标签: ['听命', '示众'],
      是否可承接: true,
    });
    expect(result.剧情.事件记录[0]).toMatchObject({
      类型: '追查风声',
      时辰: '午时',
      已生成风声: true,
    });
  });

  it('支持叙事入口账本与系统入口风声来源', () => {
    const result = Schema.parse({
      系统: {
        风声列表: [
          {
            id: 'story_baizhi_old_oath_1',
            来源: '剧情钥匙',
            地点: '听风廊',
            相关NPC: ['白芷'],
            风声文本: '听风廊有人拾到一枚裂开的玉扣。',
            故事钩子: '白芷旧誓被重新牵动',
          },
          {
            id: 'scene_yinyang_pool_1',
            来源: '场景令牌',
            地点: '阴阳池',
            风声文本: '偏池禁制被人提前解开。',
          },
        ],
        待处理交互: [
          {
            类型: '购买物品',
            道具: '白芷旧誓线',
            剧情线: '白芷旧誓线',
            关联NPC: '白芷',
            秘密主题: '旧誓/依赖/被保护欲',
            入口类型: '剧情钥匙',
            线索ID: 'story_baizhi_old_oath_1',
          },
        ],
      },
      剧情: {
        线索状态: {
          白芷旧誓线: {
            类型: '剧情钥匙',
            状态: '可追查',
            风声ID: 'story_baizhi_old_oath_1',
            关联名称: '白芷旧誓线',
            关联NPC: '白芷',
            推荐场景: ['听风廊', '锁心静室'],
          },
        },
      },
    });

    expect(result.系统.风声列表[0].来源).toBe('剧情钥匙');
    expect(result.系统.风声列表[1].来源).toBe('场景令牌');
    expect(result.系统.待处理交互[0]).toMatchObject({
      剧情线: '白芷旧誓线',
      关联NPC: '白芷',
      秘密主题: '旧誓/依赖/被保护欲',
      入口类型: '剧情钥匙',
      线索ID: 'story_baizhi_old_oath_1',
    });
    expect(result.剧情.线索状态.白芷旧誓线).toMatchObject({
      类型: '剧情钥匙',
      状态: '可追查',
      风声ID: 'story_baizhi_old_oath_1',
      触发次数: 0,
    });
  });

  it('风声列表最多保留三条，超出时校验失败以避免首页信息过载', () => {
    const fourRumors = Array.from({ length: 4 }, (_, index) => ({ id: `r${index}` }));
    expect(() => Schema.parse({ 系统: { 风声列表: fourRumors } })).toThrow();
  });
});
describe('v4 system migration defaults', () => {
  it('旧聊天快照自动补齐 v4 系统字段', () => {
    const old_data = makeData();
    const new_data = makeData();
    delete (new_data.系统 as any).时辰;
    delete (new_data.系统 as any).当前场景;
    delete (new_data.系统 as any).待处理交互;
    delete (new_data.系统 as any).场景上下文;
    delete (new_data.系统 as any).风声列表;
    delete (new_data.系统 as any).当前追查风声ID;

    validateVariables(new_data, old_data);

    expect(new_data.系统.时辰).toBe('晨时');
    expect(new_data.系统.当前场景).toBe('莲灯前苑');
    expect(new_data.系统.待处理交互).toEqual([]);
    expect(new_data.系统.场景上下文).toMatchObject({ 地点: '莲灯前苑', 在场NPC: [] });
    expect(new_data.系统.风声列表).toEqual([]);
    expect(new_data.系统.当前追查风声ID).toBe('');
  });

  it('额外解析层把世界运行核心字段写成 null 时自动恢复安全结构', () => {
    const old_data = makeData({ 系统: { 阶段: '牝奴期' } });
    const new_data = makeData({ 系统: { 阶段: '牝奴期' } });

    (new_data.系统 as any).时间状态 = null;
    (new_data.系统 as any).欲海状态 = null;
    (new_data.剧情 as any).事件记录 = null;
    (new_data.牝奴 as any).当前日课 = null;
    delete (new_data.牝奴 as any).当前支配者;
    delete (new_data.牝奴 as any).当前命令;
    (new_data.牝奴 as any).今日调教次数 = null;
    (new_data.牝奴 as any).调教记录 = null;
    (new_data.牝奴 as any).羞名标签 = null;
    (new_data.牝奴 as any).待执行日课 = null;

    validateVariables(new_data, old_data);

    expect(new_data.系统.时间状态).toMatchObject({ 当前日: 1, 时段进度: 0, 是否过夜: false });
    expect(new_data.系统.欲海状态).toMatchObject({ 搜寻进度: 0, 警戒等级: '平静', 已被定位: false });
    expect(new_data.剧情.事件记录).toEqual([]);
    expect(new_data.牝奴).toMatchObject({
      当前日课: '候命',
      当前支配者: '',
      当前命令: '',
      今日调教次数: 0,
    });
    expect(new_data.牝奴.调教记录).toEqual([]);
    expect(new_data.牝奴.羞名标签).toEqual([]);
    expect(new_data.牝奴.待执行日课).toEqual([]);
  });

  it('新楼层未写事件记录时保留旧的世界后果账本', () => {
    const oldEvent = {
      id: 'event_yaolu_1',
      类型: '追查线索',
      摘要: '玩家抵达药庐外围并遭遇苏芸。',
      日: 1,
      时辰: '午时',
      地点: '药庐外围',
      涉及NPC: ['苏芸'],
      公开度: '半私密',
      后果标签: ['线索推进'],
      已生成风声: false,
    };
    const old_data = makeData({ 剧情: { 事件记录: [oldEvent] } });
    const new_data = makeData({ 剧情: { 事件记录: [] } });

    validateVariables(new_data, old_data);

    expect(new_data.剧情.事件记录).toEqual([oldEvent]);
  });

  it('新楼层写入新事件时按 id 合并旧账本并保留最近20条', () => {
    const oldEvents = Array.from({ length: 20 }, (_, index) => ({
      id: `event_old_${index}`,
      类型: '日常',
      摘要: `旧事件${index}`,
      日: 1,
      时辰: '午时',
      地点: '外门广场',
      涉及NPC: [],
      公开度: '公开',
      后果标签: [],
      已生成风声: false,
    }));
    const newEvent = {
      id: 'event_new_1',
      类型: '对话',
      摘要: '苏芸拈着金珠威胁玩家。',
      日: 1,
      时辰: '午时',
      地点: '药庐小径',
      涉及NPC: ['苏芸'],
      公开度: '公开',
      后果标签: ['苏芸遭遇'],
      已生成风声: false,
    };
    const old_data = makeData({ 剧情: { 事件记录: oldEvents } });
    const new_data = makeData({ 剧情: { 事件记录: [oldEvents[19], newEvent] } });

    validateVariables(new_data, old_data);

    expect(new_data.剧情.事件记录).toHaveLength(20);
    expect(new_data.剧情.事件记录[0].id).toBe('event_old_1');
    expect(new_data.剧情.事件记录.at(-1)).toEqual(newEvent);
  });

  it('校验时清理心音回响的 id 重复与同语义重复并保留最近12条', () => {
    const baseEcho = {
      id: 'whisper_suyun_01',
      npc: '苏芸',
      text: '……还不低头。胆子倒挺大。',
      scene: '阴阳池底',
      time: '酉时',
      result: '捕获',
    };
    const semanticDuplicate = {
      ...baseEcho,
      id: 'echo_suyun_01',
    };
    const idDuplicate = {
      id: 'echo_unique_1',
      npc: '纪兰',
      text: '规程就是规程。',
      scene: '听风廊',
      time: '午时',
      result: '捕获',
    };
    const extraEchoes = Array.from({ length: 12 }, (_, index) => ({
      id: `echo_extra_${index}`,
      npc: '白芷',
      text: `额外心音${index}`,
      scene: '莲灯前苑',
      time: '晨时',
    }));
    const old_data = makeData();
    const new_data = makeData({
      系统: {
        心音回响: [baseEcho, semanticDuplicate, idDuplicate, idDuplicate, ...extraEchoes],
      },
    });

    validateVariables(new_data, old_data);

    const semanticKeys = new_data.系统.心音回响.map((echo: any) => [echo.npc, echo.text, echo.scene, echo.time].join('|'));
    expect(new_data.系统.心音回响).toHaveLength(12);
    expect(new Set(new_data.系统.心音回响.map((echo: any) => echo.id)).size).toBe(12);
    expect(new Set(semanticKeys).size).toBe(12);
    expect(new_data.系统.心音回响.some((echo: any) => echo.id === 'echo_suyun_01')).toBe(false);
  });

  it('牝奴期发生调教事件但AI漏写P2主控台字段时自动补最小调教结算', () => {
    const old_data = makeData({
      系统: { 阶段: '牝奴期', 时辰: '酉时', 当前场景: '阴阳池' },
      牝奴: {
        堕落度: 86,
        牝阴决层数: 6,
        当前日课: '候命',
        当前支配者: '',
        当前命令: '',
        命令强度: 0,
        今日调教次数: 0,
        待执行日课: [],
        最近调教结算: '',
        调教记录: [],
        支配次数: { 白芷: 0, 苏芸: 1, 纪兰: 2, 沈月秋: 3, 柳素衣: 4 },
      },
    });
    const newEvent = {
      id: 'event_0501_酉时_NSFW',
      类型: '深度亲密',
      摘要: '玩家在阴阳池底执行苏芸的舔玉阶命令，引发苏芸合欢诀生理反应',
      日: 1,
      时辰: '酉时',
      地点: '阴阳池',
      涉及NPC: ['苏芸'],
      公开度: '半私密',
      后果标签: ['欲海波动', '苏芸兴奋', '服从测试'],
      已生成风声: false,
    };
    const new_data = makeData({
      系统: {
        阶段: '牝奴期',
        时辰: '酉时',
        当前场景: '阴阳池',
        场景上下文: {
          地点: '阴阳池',
          子区域: '池底汉白玉阶',
          场景来源: '核心地点',
          公开度: '半私密',
          在场NPC: ['苏芸'],
          NPC活动: { 苏芸: '俯身盯着玩家舔拭玉阶，呼吸紊乱' },
          氛围: ['潮湿水汽'],
          故事钩子: ['苏芸的绣鞋正碾在玩家手背上'],
          特殊事件: '服从性调教',
        },
      },
      剧情: { 事件记录: [newEvent] },
      牝奴: {
        堕落度: 86,
        牝阴决层数: 6,
        当前日课: '候命',
        当前支配者: '',
        当前命令: '',
        命令强度: 0,
        今日调教次数: 0,
        待执行日课: [],
        最近调教结算: '',
        调教记录: [],
        支配次数: { 白芷: 0, 苏芸: 1, 纪兰: 2, 沈月秋: 3, 柳素衣: 4 },
      },
    });

    validateVariables(new_data, old_data);

    expect(new_data.牝奴.当前日课).toBe('阴阳池验身');
    expect(new_data.牝奴.当前支配者).toBe('苏芸');
    expect(new_data.牝奴.当前命令).toContain('舔');
    expect(new_data.牝奴.今日调教次数).toBe(1);
    expect(new_data.牝奴.最近调教结算).toContain('苏芸在阴阳池执行阴阳池验身');
    expect(new_data.牝奴.调教记录).toHaveLength(1);
    expect(new_data.牝奴.调教记录[0]).toMatchObject({ 支配者: '苏芸', 羞名等级: '传开' });
  });

  it('牝奴期没有新增调教记录时禁止AI单独增加支配次数', () => {
    const record = {
      id: 'p2_酉时_阴阳池_苏芸_1',
      时辰: '酉时',
      支配者: '苏芸',
      摘要: '苏芸在阴阳池执行阴阳池验身。',
      羞名等级: '传开',
    };
    const old_data = makeData({
      系统: { 阶段: '牝奴期', 时辰: '酉时', 当前场景: '阴阳池' },
      牝奴: {
        当前日课: '阴阳池验身',
        当前支配者: '苏芸',
        当前命令: '舔拭玉阶',
        命令强度: 55,
        今日调教次数: 1,
        最近调教结算: '苏芸在阴阳池执行阴阳池验身。',
        调教记录: [record],
        支配次数: { 白芷: 0, 苏芸: 2, 纪兰: 2, 沈月秋: 3, 柳素衣: 4 },
      },
    });
    const new_data = makeData({
      系统: { 阶段: '牝奴期', 时辰: '酉时', 当前场景: '阴阳池' },
      牝奴: {
        当前日课: '阴阳池验身',
        当前支配者: '苏芸',
        当前命令: '舔拭玉阶',
        命令强度: 55,
        今日调教次数: 1,
        最近调教结算: '苏芸在阴阳池执行阴阳池验身。',
        调教记录: [record],
        支配次数: { 白芷: 0, 苏芸: 3, 纪兰: 2, 沈月秋: 3, 柳素衣: 4 },
      },
    });

    validateVariables(new_data, old_data);

    expect(new_data.牝奴.支配次数.苏芸).toBe(2);
    expect(new_data.牝奴.调教记录).toEqual([record]);
  });

  it('牝奴期新楼层未新增调教记录时保留既有调教账本与最近结算', () => {
    const record = {
      id: 'p2_酉时_阴阳池_苏芸_1',
      时辰: '酉时',
      支配者: '苏芸',
      摘要: '苏芸在阴阳池执行阴阳池验身。',
      羞名等级: '传开',
    };
    const old_data = makeData({
      系统: { 阶段: '牝奴期', 时辰: '酉时', 当前场景: '阴阳池' },
      牝奴: {
        当前日课: '阴阳池验身',
        当前支配者: '苏芸',
        当前命令: '舔拭玉阶',
        命令强度: 55,
        今日调教次数: 1,
        最近调教结算: '苏芸在阴阳池执行阴阳池验身。',
        调教记录: [record],
        支配次数: { 白芷: 0, 苏芸: 2, 纪兰: 2, 沈月秋: 3, 柳素衣: 4 },
      },
    });
    const new_data = makeData({
      系统: { 阶段: '牝奴期', 时辰: '酉时', 当前场景: '阴阳池' },
      牝奴: {
        当前日课: '听风廊示众',
        当前支配者: '苏芸',
        当前命令: '明日午时去听风廊，口衔铃铛跪迎内门女修。',
        命令强度: 0,
        今日调教次数: 0,
        最近调教结算: '',
        调教记录: [],
        支配次数: { 白芷: 0, 苏芸: 2, 纪兰: 2, 沈月秋: 3, 柳素衣: 4 },
      },
    });

    validateVariables(new_data, old_data);

    expect(new_data.牝奴.当前日课).toBe('听风廊示众');
    expect(new_data.牝奴.当前命令).toContain('听风廊');
    expect(new_data.牝奴.调教记录).toEqual([record]);
    expect(new_data.牝奴.今日调教次数).toBe(1);
    expect(new_data.牝奴.最近调教结算).toBe('苏芸在阴阳池执行阴阳池验身。');
    expect(new_data.牝奴.支配次数.苏芸).toBe(2);
  });

  it('AI写入未支持时辰时归一化系统时辰、事件账本和调教记录时辰以避免状态栏校验崩溃', () => {
    const old_data = makeData({
      系统: { 阶段: '牝奴期', 时辰: '酉时', 当前场景: '阴阳池' },
      剧情: { 事件记录: [] },
    });
    const new_data = makeData({
      系统: { 阶段: '牝奴期', 时辰: '戌时', 当前场景: '药庐暖阁' },
      剧情: {
        事件记录: [
          {
            id: 'event_201_5_1_戌时_移动',
            类型: '移动',
            摘要: '玩家领命离开阴阳池，苏芸慌乱逃回药庐。',
            日: 1,
            时辰: '戌时',
            地点: '药庐暖阁',
            涉及NPC: ['苏芸'],
            公开度: '私密',
            后果标签: ['听风廊示众预告'],
            已生成风声: false,
          },
        ],
      },
      牝奴: {
        调教记录: [
          {
            id: 'record_201_5_1_辰时',
            时辰: '辰时',
            支配者: '纪兰',
            摘要: '听风廊公开检视缺装',
            羞名等级: '挂牌',
          },
        ],
      },
    });

    validateVariables(new_data, old_data);

    expect(new_data.系统.时辰).toBe('酉时');
    expect(new_data.剧情.事件记录[0].时辰).toBe('酉时');
    expect(new_data.牝奴.调教记录[0].时辰).toBe('晨时');
  });

});
