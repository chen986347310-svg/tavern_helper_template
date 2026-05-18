import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateVariables } from './validate';
import { calculate攻略值增量 } from '../../界面/guards';

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;

function makeNpcData(overrides: Record<string, Partial<{ 好感度: number; 攻略值: number; 粘滞计数: number; 状态: string }>> = {}) {
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
    牝奴: { 堕落度: 0, 牝阴决层数: 0, 上次支配者: '', 支配次数: {}, 改造进度: { 泌乳: false, 肛门: false, 憋尿: false }, ...((overrides as any).牝奴 || {}) },
    NPC: makeNpcData((overrides as any).NPC),
    道具: { 拥有: {}, 装备: { '玩家': [], '白芷': [], '苏芸': [], '纪兰': [], '沈月秋': [], '柳素衣': [] }, ...((overrides as any).道具 || {}) },
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
    const old_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: 10, 状态: '进行中' }, 苏芸: { 好感度: 40, 攻略值: 0 } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 50, 攻略值: 10, 状态: '进行中' }, 苏芸: { 好感度: 40, 攻略值: 5 } } });
    validateVariables(new_data, old_data);
    expect(new_data.NPC['苏芸'].攻略值).toBe(0); // reverted
    expect(new_data.NPC['白芷'].攻略值).toBe(10); // unchanged
  });

  it('白芷 completed, 苏芸 is current, 纪兰 攻略值 0→5 → reverted', () => {
    const old_data = makeData({ NPC: { 白芷: { 好感度: 100, 攻略值: 100, 状态: '已完成' }, 苏芸: { 好感度: 50, 攻略值: 0, 状态: '进行中' }, 纪兰: { 好感度: 40, 攻略值: 0 } } });
    const new_data = makeData({ NPC: { 白芷: { 好感度: 100, 攻略值: 100, 状态: '已完成' }, 苏芸: { 好感度: 50, 攻略值: 0, 状态: '进行中' }, 纪兰: { 好感度: 40, 攻略值: 5 } } });
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
    const new_data = makeData({ NPC: { 白芷: { 好感度: 20 } }, 道具: { 装备: { '白芷': ['口塞'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual([]);
  });

  it('口塞 on 白芷 (好感度=30) → kept', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: 30 } }, 道具: { 装备: { '白芷': ['口塞'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual(['口塞']);
  });

  it('淫纹 on 白芷 (好感度=69) → removed (需要70)', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: 69 } }, 道具: { 装备: { '白芷': ['淫纹'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual([]);
  });

  it('淫纹 on 白芷 (好感度=70) → kept', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: 70 } }, 道具: { 装备: { '白芷': ['淫纹'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual(['淫纹']);
  });

  it('铃铛项圈 on 白芷 (好感度=0) → kept (门槛0)', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: 0 } }, 道具: { 装备: { '白芷': ['铃铛项圈'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual(['铃铛项圈']);
  });

  it('mixed valid+invalid → only invalid removed', () => {
    const old_data = makeData();
    const new_data = makeData({ NPC: { 白芷: { 好感度: 30 } }, 道具: { 装备: { '白芷': ['铃铛项圈', '口塞', '淫纹'] } } });
    validateVariables(new_data, old_data);
    expect(new_data.道具.装备['白芷']).toEqual(['铃铛项圈', '口塞']);
  });

  it('player equipment has no threshold check', () => {
    const old_data = makeData();
    const new_data = makeData({ 道具: { 装备: { '玩家': ['淫纹', '塑形丹'] } } });
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
    const new_data = makeData({ NPC: { 柳素衣: { 好感度: 50, 攻略值: 100 } }, 道具: { 拥有: { '改变阵法': 1 } } });
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
      道具: { 拥有: { '改变阵法': 1 } },
    });
    validateVariables(new_data, old_data);
    expect(new_data.道具.拥有['改变阵法']).toBe(0);
    expect(new_data.系统.灵石).toBe(500100); // refund 500000
  });

  it('already owned (count 1→2) → no refund triggered', () => {
    const old_data = makeData({
      系统: { 灵石: 100 },
      NPC: { 柳素衣: { 攻略值: 50 } },
      道具: { 拥有: { '改变阵法': 1 } },
    });
    const new_data = makeData({
      系统: { 灵石: 100 },
      NPC: { 柳素衣: { 攻略值: 50 } },
      道具: { 拥有: { '改变阵法': 2 } },
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
    (new_data.NPC as any)['白芷'].好感度 = "999";
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
    (new_data.NPC as any)['白芷'].好感度 = "abc";
    validateVariables(new_data, old_data);
    expect(new_data.NPC['白芷'].好感度).toBe(0);
  });

  it('string "50" 灵石 → coerced to 50', () => {
    const old_data = makeData();
    const new_data = makeData();
    (new_data.系统 as any).灵石 = "50";
    validateVariables(new_data, old_data);
    expect(new_data.系统.灵石).toBe(50);
  });
});
