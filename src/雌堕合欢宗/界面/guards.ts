import type { Schema } from '../schema';

type NPC名 = '白芷' | '苏芸' | '纪兰' | '沈月秋' | '柳素衣';
type 行为类型 = '日常接触' | '亲密接触' | 'NSFW行为';

const NPC境界系数: Record<NPC名, number> = {
  白芷: 10,
  苏芸: 20,
  纪兰: 40,
  沈月秋: 60,
  柳素衣: 100,
};

/** 攻略链顺序 */
const 攻略链: NPC名[] = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'];

/** 好感度门槛映射 — 道具名必须与 items.ts / outfits.ts 完全一致 */
const 好感度门槛: Record<number, string[]> = {
  0: ['铃铛项圈', '眼罩', '体香丹', '开裆裤', '杂役服'],
  30: [
    '口塞', '束缚绳', '乳夹链', '透视纱衣', '透视肚兜',
    '开胸襦裙', '肛塞', '乳头夹', '师姐装', '药庐制服',
    '经阁制服', '铃铛装',
  ],
  50: [
    '阴蒂环', '贞操带', '媚体丹', '固敏丹',
    '透视罗裙', '开背长裙', '绑带装', '金属腰链', '纱幔装',
    '阴道球', '尾巴塞',
  ],
  70: [
    '淫纹', '催乳丹', '催情丹',
    '龟甲缚衣', '吊带束缚裙', '金属链衣', '金属胸罩',
    '淫纹绘衣', '符文肚兜', '花瓣衣',
  ],
  90: ['塑形丹', '掌门礼服'],
};

/**
 * 检查NPC好感度是否达到道具使用门槛
 */
export function checkItemThreshold(npc好感度: number, 道具名称: string): boolean {
  const thresholds = Object.keys(好感度门槛)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of thresholds) {
    if (npc好感度 >= threshold) {
      if (好感度门槛[threshold].includes(道具名称)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 检查灵石是否足够购买
 */
export function checkSufficientGems(当前灵石: number, 价格: number): boolean {
  return 当前灵石 >= 价格;
}

/**
 * 计算攻略值增量
 * 公式：floor(基础值 × 好感度 ÷ 50)
 */
export function calculate攻略值增量(基础值: number, 好感度: number): number {
  return Math.floor(基础值 * 好感度 / 50);
}

/**
 * 计算灵石获取量
 * 公式：NPC境界系数 × 攻略值增量
 */
export function calculate灵石获取(NPC名: NPC名, 攻略值增量: number): number {
  return NPC境界系数[NPC名] * 攻略值增量;
}

/**
 * 获取当前可攻略的NPC（攻略链中第一个状态≠'已完成'的NPC）
 * 全部攻略完成时返回 null
 */
export function getCurrentNpc(npcStates: Record<NPC名, { 状态: string }>): NPC名 | null {
  for (const npc of 攻略链) {
    if (npcStates[npc]?.状态 !== '已完成') {
      return npc;
    }
  }
  return null;
}

/**
 * 检查攻略值是否可以提升
 * 仅当前攻略链NPC可增长，好感度<30时也锁定为0
 */
export function canIncrease攻略值(npcName: NPC名, currentNpc: NPC名 | null, 好感度: number): boolean {
  if (好感度 < 30) return false;
  return npcName === currentNpc;
}

/**
 * 检查粘滞触发是否达到阈值
 * 统一阈值：所有行为类型均为3层触发
 */
export function check粘滞触发(粘滞计数: number, _行为类型: 行为类型): boolean {
  return 粘滞计数 >= 3;
}

/**
 * 获取粘滞阈值
 * 统一返回3
 */
export function get粘滞阈值(_行为类型: 行为类型): number {
  return 3;
}

/**
 * 判断是否应切换到 Phase 2（剩余天数归零）
 */
export function shouldEnterPhase2(剩余天数: number): boolean {
  return 剩余天数 <= 0;
}

/**
 * 检查是否可以进入Phase 2（别名，保持向后兼容）
 */
export function canEnterPhase2(剩余天数: number): boolean {
  return 剩余天数 <= 0;
}

/**
 * 执行 Phase 2 初始化逻辑
 * - 灵石归零
 * - 阶段设为牝奴期
 * - 道具随机装备到玩家（已有装备清空，随机选若干已拥有装备挂到玩家身上）
 */
export function initializePhase2(data: Schema): void {
  data.系统.阶段 = '牝奴期';
  data.系统.灵石 = 0;

  // 收集所有已拥有的装备型道具（排除消耗品和特殊道具）
  const 拥有列表 = Object.entries(data.道具.拥有)
    .filter(([_, count]) => (count as number) > 0)
    .map(([name]) => name);

  // 清空所有装备
  for (const target of Object.keys(data.道具.装备)) {
    data.道具.装备[target as keyof typeof data.道具.装备] = [];
  }

  // 随机选取若干道具装备到玩家身上（最多5件）——仅首次执行
  if (data.道具.装备['玩家'].length > 0) return;
  const shuffled = 拥有列表.sort(() => Math.random() - 0.5);
  const toEquip = shuffled.slice(0, 5);
  data.道具.装备['玩家'] = toEquip;
}

/**
 * 检查是否达成GOOD END
 * 需要攻略全NPC + 购买改变阵法
 */
export function checkGoodEnd(data: Schema): boolean {
  const 全部攻略完成 = 攻略链.every(npc => data.NPC[npc]?.状态 === '已完成');
  return 全部攻略完成 && data.系统.已使用阵法;
}

/**
 * 检查堕落度阶段
 */
export function get堕落度阶段(堕落度: number): string {
  if (堕落度 < 10) return '清醒隐忍期';
  if (堕落度 < 30) return '动摇挣扎期';
  if (堕落度 < 50) return '本能屈从期';
  if (堕落度 < 70) return '淫纹发情期';
  if (堕落度 < 90) return '欲壑难填期';
  return '彻底雌堕期';
}
