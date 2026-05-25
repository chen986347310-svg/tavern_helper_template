import { describe, it, expect } from 'vitest';
import type { Schema } from '../schema';
import {
  checkItemThreshold,
  canIncrease攻略值,
  checkSufficientGems,
  calculate攻略值增量,
  calculate灵石获取,
  check粘滞触发,
  get粘滞阈值,
  canEnterPhase2,
  get堕落度阶段,
  checkGoodEnd,
  getCurrentNpc,
  shouldEnterPhase2,
  initializePhase2,
  canUpgrade情欲控制,
} from './guards';

// --- 测试辅助 ---

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;

function createMockData(overrides: Partial<Schema> = {}): Schema {
  const npcData: Record<string, { 好感度: number; 攻略值: number; 粘滞计数: number; 状态: string }> = {};
  for (const npc of NPC列表) {
    npcData[npc] = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' };
  }
  return {
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石: 1000, 已使用阵法: false },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      上次支配者: '',
      支配次数: {},
      改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
    },
    NPC: npcData as Schema['NPC'],
    道具: { 拥有: {}, 装备: { 玩家: [], 白芷: [], 苏芸: [], 纪兰: [], 沈月秋: [], 柳素衣: [] } },
    场景: { 已解锁: [] },
    剧情: { 已解锁: [] },
    ...overrides,
  } as Schema;
}

// --- checkItemThreshold ---

describe('checkItemThreshold', () => {
  it('好感度>=90可使用塑形丹和掌门礼服', () => {
    expect(checkItemThreshold(90, '塑形丹')).toBe(true);
    expect(checkItemThreshold(100, '掌门礼服')).toBe(true);
  });

  it('好感度>=70可使用淫纹、催乳丹、催情丹等', () => {
    expect(checkItemThreshold(70, '淫纹')).toBe(true);
    expect(checkItemThreshold(70, '催乳丹')).toBe(true);
    expect(checkItemThreshold(70, '催情丹')).toBe(true);
    expect(checkItemThreshold(70, '龟甲缚衣')).toBe(true);
    expect(checkItemThreshold(70, '吊带束缚裙')).toBe(true);
    expect(checkItemThreshold(70, '金属链衣')).toBe(true);
    expect(checkItemThreshold(70, '金属胸罩')).toBe(true);
    expect(checkItemThreshold(70, '淫纹绘衣')).toBe(true);
    expect(checkItemThreshold(70, '符文肚兜')).toBe(true);
    expect(checkItemThreshold(70, '花瓣衣')).toBe(true);
  });

  it('好感度>=50可使用阴蒂环、贞操带、媚体丹、固敏丹等', () => {
    expect(checkItemThreshold(50, '阴蒂环')).toBe(true);
    expect(checkItemThreshold(50, '贞操带')).toBe(true);
    expect(checkItemThreshold(50, '媚体丹')).toBe(true);
    expect(checkItemThreshold(50, '固敏丹')).toBe(true);
    expect(checkItemThreshold(50, '绑带装')).toBe(true);
    expect(checkItemThreshold(50, '金属腰链')).toBe(true);
    expect(checkItemThreshold(50, '透视罗裙')).toBe(true);
    expect(checkItemThreshold(50, '开背长裙')).toBe(true);
    expect(checkItemThreshold(50, '纱幔装')).toBe(true);
    expect(checkItemThreshold(50, '阴道球')).toBe(true);
    expect(checkItemThreshold(50, '尾巴塞')).toBe(true);
  });

  it('好感度>=30可使用口塞、束缚绳等', () => {
    expect(checkItemThreshold(30, '口塞')).toBe(true);
    expect(checkItemThreshold(30, '束缚绳')).toBe(true);
    expect(checkItemThreshold(30, '乳夹链')).toBe(true);
    expect(checkItemThreshold(30, '透视纱衣')).toBe(true);
    expect(checkItemThreshold(30, '透视肚兜')).toBe(true);
    expect(checkItemThreshold(30, '开胸襦裙')).toBe(true);
    expect(checkItemThreshold(30, '肛塞')).toBe(true);
    expect(checkItemThreshold(30, '乳头夹')).toBe(true);
    expect(checkItemThreshold(30, '师姐装')).toBe(true);
    expect(checkItemThreshold(30, '药庐制服')).toBe(true);
    expect(checkItemThreshold(30, '经阁制服')).toBe(true);
    expect(checkItemThreshold(30, '铃铛装')).toBe(true);
  });

  it('好感度>=0可使用铃铛项圈、眼罩、体香丹、开裆裤、杂役服', () => {
    expect(checkItemThreshold(0, '铃铛项圈')).toBe(true);
    expect(checkItemThreshold(0, '眼罩')).toBe(true);
    expect(checkItemThreshold(0, '体香丹')).toBe(true);
    expect(checkItemThreshold(0, '开裆裤')).toBe(true);
    expect(checkItemThreshold(0, '杂役服')).toBe(true);
  });

  it('新增临时与永久丹药遵守好感度门槛', () => {
    expect(checkItemThreshold(0, '温息丹')).toBe(true);
    expect(checkItemThreshold(49, '焚息丹')).toBe(false);
    expect(checkItemThreshold(50, '焚息丹')).toBe(true);
    expect(checkItemThreshold(69, '催乳丹')).toBe(false);
    expect(checkItemThreshold(70, '催乳丹')).toBe(true);
  });

  it('仙奴丹不靠普通好感度直接开放', () => {
    expect(checkItemThreshold(100, '玉户听命丹')).toBe(false);
  });

  it('好感度不足时返回false', () => {
    expect(checkItemThreshold(29, '口塞')).toBe(false);
    expect(checkItemThreshold(49, '阴蒂环')).toBe(false);
    expect(checkItemThreshold(69, '淫纹')).toBe(false);
    expect(checkItemThreshold(89, '塑形丹')).toBe(false);
  });

  it('不存在的道具返回false', () => {
    expect(checkItemThreshold(100, '不存在的道具')).toBe(false);
    expect(checkItemThreshold(100, '绑定系服装')).toBe(false);
    expect(checkItemThreshold(100, '金属系服装')).toBe(false);
    expect(checkItemThreshold(100, '永久丹药全部')).toBe(false);
    expect(checkItemThreshold(100, '全部')).toBe(false);
  });
});

// --- getCurrentNpc ---

describe('getCurrentNpc', () => {
  it('全部未开始时返回白芷', () => {
    const states = {
      白芷: { 状态: '未开始' },
      苏芸: { 状态: '未开始' },
      纪兰: { 状态: '未开始' },
      沈月秋: { 状态: '未开始' },
      柳素衣: { 状态: '未开始' },
    } as any;
    expect(getCurrentNpc(states)).toBe('白芷');
  });

  it('白芷完成后返回苏芸', () => {
    const states = {
      白芷: { 状态: '已完成' },
      苏芸: { 状态: '未开始' },
      纪兰: { 状态: '未开始' },
      沈月秋: { 状态: '未开始' },
      柳素衣: { 状态: '未开始' },
    } as any;
    expect(getCurrentNpc(states)).toBe('苏芸');
  });

  it('白芷苏芸完成后返回纪兰', () => {
    const states = {
      白芷: { 状态: '已完成' },
      苏芸: { 状态: '已完成' },
      纪兰: { 状态: '未开始' },
      沈月秋: { 状态: '未开始' },
      柳素衣: { 状态: '未开始' },
    } as any;
    expect(getCurrentNpc(states)).toBe('纪兰');
  });

  it('全部完成后返回null', () => {
    const states = {
      白芷: { 状态: '已完成' },
      苏芸: { 状态: '已完成' },
      纪兰: { 状态: '已完成' },
      沈月秋: { 状态: '已完成' },
      柳素衣: { 状态: '已完成' },
    } as any;
    expect(getCurrentNpc(states)).toBeNull();
  });
});

// --- canIncrease攻略值 ---

describe('canIncrease攻略值', () => {
  it('当前NPC且好感度>=30时返回true', () => {
    expect(canIncrease攻略值('白芷', '白芷', 30)).toBe(true);
    expect(canIncrease攻略值('白芷', '白芷', 50)).toBe(true);
  });

  it('非当前NPC时返回false', () => {
    expect(canIncrease攻略值('苏芸', '白芷', 50)).toBe(false);
    expect(canIncrease攻略值('纪兰', '白芷', 50)).toBe(false);
  });

  it('当前NPC但好感度<30时返回false', () => {
    expect(canIncrease攻略值('白芷', '白芷', 29)).toBe(false);
    expect(canIncrease攻略值('白芷', '白芷', 0)).toBe(false);
  });

  it('currentNpc为null时返回false', () => {
    expect(canIncrease攻略值('白芷', null, 50)).toBe(false);
  });
});

// --- shouldEnterPhase2 ---

describe('shouldEnterPhase2', () => {
  it('剩余天数<=0时应切换', () => {
    expect(shouldEnterPhase2(0)).toBe(true);
    expect(shouldEnterPhase2(-1)).toBe(true);
  });

  it('剩余天数>0时不应切换', () => {
    expect(shouldEnterPhase2(1)).toBe(false);
    expect(shouldEnterPhase2(30)).toBe(false);
  });
});

// --- checkSufficientGems ---

describe('checkSufficientGems', () => {
  it('灵石>=价格时返回true', () => {
    expect(checkSufficientGems(100, 100)).toBe(true);
    expect(checkSufficientGems(200, 100)).toBe(true);
  });

  it('灵石<价格时返回false', () => {
    expect(checkSufficientGems(50, 100)).toBe(false);
  });
});

// --- calculate攻略值增量 ---

describe('calculate攻略值增量', () => {
  it('公式: floor(基础值 * 好感度 / 50)', () => {
    expect(calculate攻略值增量(10, 50)).toBe(10);
    expect(calculate攻略值增量(10, 100)).toBe(20);
    expect(calculate攻略值增量(20, 50)).toBe(20);
  });

  it('向下取整', () => {
    expect(calculate攻略值增量(10, 33)).toBe(6);
    expect(calculate攻略值增量(10, 49)).toBe(9);
  });
});

// --- calculate灵石获取 ---

describe('calculate灵石获取', () => {
  it('公式: NPC境界系数 * 攻略值增量 * 灵石收益倍率', () => {
    expect(calculate灵石获取('白芷', 10)).toBe(400);
    expect(calculate灵石获取('苏芸', 10)).toBe(800);
    expect(calculate灵石获取('纪兰', 10)).toBe(1600);
    expect(calculate灵石获取('沈月秋', 10)).toBe(2400);
    expect(calculate灵石获取('柳素衣', 10)).toBe(4000);
  });
});

// --- check粘滞触发 ---

describe('check粘滞触发', () => {
  it('统一阈值为3层', () => {
    expect(check粘滞触发(3, '亲密接触')).toBe(true);
    expect(check粘滞触发(2, '亲密接触')).toBe(true);
    expect(check粘滞触发(3, 'NSFW行为')).toBe(true);
    expect(check粘滞触发(2, 'NSFW行为')).toBe(false);
  });
});

// --- get粘滞阈值 ---

describe('get粘滞阈值', () => {
  it('按行为类型返回不同阈值', () => {
    expect(get粘滞阈值('NSFW行为')).toBe(3);
    expect(get粘滞阈值('亲密接触')).toBe(2);
    expect(get粘滞阈值('日常接触')).toBe(1);
  });
});

// --- canEnterPhase2 ---

describe('canEnterPhase2', () => {
  it('剩余天数<=0时可进入', () => {
    expect(canEnterPhase2(0)).toBe(true);
    expect(canEnterPhase2(-1)).toBe(true);
  });

  it('剩余天数>0时不可进入', () => {
    expect(canEnterPhase2(1)).toBe(false);
    expect(canEnterPhase2(30)).toBe(false);
  });

  it('保持 shouldEnterPhase2 的兼容别名行为', () => {
    expect(canEnterPhase2(0)).toBe(shouldEnterPhase2(0));
    expect(canEnterPhase2(1)).toBe(shouldEnterPhase2(1));
  });
});

// --- canUpgrade情欲控制 ---

describe('canUpgrade情欲控制', () => {
  it('牝奴期且堕落度达标时可升级情欲控制', () => {
    expect(canUpgrade情欲控制('牝奴期', 1, 30)).toBe(true);
    expect(canUpgrade情欲控制('牝奴期', 2, 60)).toBe(true);
    expect(canUpgrade情欲控制('攻略期', 1, 99)).toBe(false);
  });
});

// --- get堕落度阶段 ---

describe('get堕落度阶段', () => {
  it('0-9%: 清醒隐忍期', () => {
    expect(get堕落度阶段(0)).toBe('清醒隐忍期');
    expect(get堕落度阶段(9)).toBe('清醒隐忍期');
  });

  it('10-29%: 动摇挣扎期', () => {
    expect(get堕落度阶段(10)).toBe('动摇挣扎期');
    expect(get堕落度阶段(29)).toBe('动摇挣扎期');
  });

  it('30-49%: 本能屈从期', () => {
    expect(get堕落度阶段(30)).toBe('本能屈从期');
    expect(get堕落度阶段(49)).toBe('本能屈从期');
  });

  it('50-69%: 淫纹发情期', () => {
    expect(get堕落度阶段(50)).toBe('淫纹发情期');
    expect(get堕落度阶段(69)).toBe('淫纹发情期');
  });

  it('70-89%: 欲壑难填期', () => {
    expect(get堕落度阶段(70)).toBe('欲壑难填期');
    expect(get堕落度阶段(89)).toBe('欲壑难填期');
  });

  it('90-100%: 彻底雌堕期', () => {
    expect(get堕落度阶段(90)).toBe('彻底雌堕期');
    expect(get堕落度阶段(100)).toBe('彻底雌堕期');
  });
});

// --- checkGoodEnd ---

describe('checkGoodEnd', () => {
  it('全NPC攻略完成且已使用阵法时返回true', () => {
    const npcData: Record<string, { 好感度: number; 攻略值: number; 粘滞计数: number; 状态: string }> = {};
    for (const npc of NPC列表) {
      npcData[npc] = { 好感度: 100, 攻略值: 100, 粘滞计数: 0, 状态: '已完成' };
    }
    const data = createMockData({
      系统: { 阶段: '攻略期', 剩余天数: 0, 灵石: 1000, 已使用阵法: true },
      NPC: npcData as Schema['NPC'],
    });
    expect(checkGoodEnd(data)).toBe(true);
  });

  it('未使用阵法时返回false', () => {
    const npcData: Record<string, { 好感度: number; 攻略值: number; 粘滞计数: number; 状态: string }> = {};
    for (const npc of NPC列表) {
      npcData[npc] = { 好感度: 100, 攻略值: 100, 粘滞计数: 0, 状态: '已完成' };
    }
    const data = createMockData({
      系统: { 阶段: '攻略期', 剩余天数: 0, 灵石: 1000, 已使用阵法: false },
      NPC: npcData as Schema['NPC'],
    });
    expect(checkGoodEnd(data)).toBe(false);
  });

  it('有NPC未攻略完成时返回false', () => {
    const npcData: Record<string, { 好感度: number; 攻略值: number; 粘滞计数: number; 状态: string }> = {};
    for (const npc of NPC列表) {
      npcData[npc] = { 好感度: 100, 攻略值: 100, 粘滞计数: 0, 状态: '已完成' };
    }
    npcData['白芷'] = { 好感度: 50, 攻略值: 30, 粘滞计数: 0, 状态: '进行中' };
    const data = createMockData({
      系统: { 阶段: '攻略期', 剩余天数: 0, 灵石: 1000, 已使用阵法: true },
      NPC: npcData as Schema['NPC'],
    });
    expect(checkGoodEnd(data)).toBe(false);
  });
});

// --- initializePhase2 ---

describe('initializePhase2', () => {
  it('设置阶段为牝奴期', () => {
    const data = createMockData({ 系统: { 阶段: '攻略期', 剩余天数: 0, 灵石: 5000, 已使用阵法: false } });
    initializePhase2(data);
    expect(data.系统.阶段).toBe('牝奴期');
  });

  it('灵石归零', () => {
    const data = createMockData({ 系统: { 阶段: '攻略期', 剩余天数: 0, 灵石: 5000, 已使用阵法: false } });
    initializePhase2(data);
    expect(data.系统.灵石).toBe(0);
  });

  it('清空所有已有装备', () => {
    const data = createMockData();
    data.道具.装备['白芷'] = ['口塞', '束缚绳'];
    data.道具.装备['玩家'] = ['铃铛项圈'];
    initializePhase2(data);
    expect(data.道具.装备['白芷']).toEqual([]);
  });

  it('将已拥有道具随机装备到玩家身上', () => {
    const data = createMockData();
    data.道具.拥有 = { 口塞: 1, 束缚绳: 1, 眼罩: 1 };
    initializePhase2(data);
    expect(data.道具.装备['玩家'].length).toBeLessThanOrEqual(5);
    for (const item of data.道具.装备['玩家']) {
      expect(Object.keys(data.道具.拥有)).toContain(item);
    }
  });

  it('没有已拥有道具时玩家装备为空', () => {
    const data = createMockData();
    data.道具.拥有 = {};
    initializePhase2(data);
    expect(data.道具.装备['玩家']).toEqual([]);
  });

  it('初始化牝奴期运行字段与入场调教记录', () => {
    const data = createMockData({
      系统: {
        阶段: '攻略期',
        剩余天数: 0,
        灵石: 5000,
        已使用阵法: false,
        时辰: '酉时',
        当前场景: '阴阳池',
        时间状态: {
          当前日: 7,
          时段进度: 2,
          最近耗时: '',
          最近结算原因: '',
          最近事件类型: '',
          是否过夜: false,
        },
      } as any,
    });

    initializePhase2(data);

    expect(data.牝奴).toMatchObject({
      入场日: 7,
      当前日课: '阴阳池验身',
      当前支配者: '沈月秋',
      当前命令: '跪候牝印点名',
      命令强度: 45,
      今日调教次数: 0,
      待执行日课: ['验身', '登记', '牝印唤醒'],
      最近调教结算: '牝奴期入场：阴阳池验身，牝印开始接管日课。',
    });
    expect(data.牝奴.调教记录).toHaveLength(1);
    expect(data.牝奴.调教记录[0]).toMatchObject({
      时辰: '酉时',
      支配者: '沈月秋',
      摘要: '牝奴期入场：阴阳池验身，牝印开始接管日课。',
      羞名等级: '微闻',
    });
  });
});
