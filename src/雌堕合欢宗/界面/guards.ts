import type { Schema } from '../schema';
import { normalizePresentNpcs, type NpcName } from './data/sceneContext';

type NPC名 = NpcName;
type 行为类型 = '日常接触' | '亲密接触' | 'NSFW行为';
type 场景名 = string;
type 窃听阶段 = '警戒' | '动摇' | '沉沦';

const 窃听成功率: Record<string, number> = {
  莲灯前苑: 0.6,
  醉玉小筑: 0.75,
  绮梦幽阁: 0.9,
};

const 反噬倍率: Record<string, number> = {
  莲灯前苑: 0.5,
  醉玉小筑: 1,
  绮梦幽阁: 1.5,
};

const NPC境界系数: Record<NPC名, number> = {
  白芷: 10,
  苏芸: 20,
  纪兰: 40,
  沈月秋: 60,
  柳素衣: 100,
};

const 灵石收益倍率 = 4;

/** 攻略链顺序 */
const 攻略链: NPC名[] = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'];

/** 好感度门槛映射 — 道具名必须与 items.ts / outfits.ts 完全一致 */
const 好感度门槛: Record<number, string[]> = {
  0: ['铃铛项圈', '眼罩', '羞玉坠', '听命耳坠', '温息丹', '凝香丸', '体香丹', '开裆裤', '杂役服'],
  30: [
    '口塞',
    '含香舌扣',
    '束缚绳',
    '乳夹链',
    '醉眸丹',
    '柔骨散',
    '听令丸',
    '玉肌丹',
    '柔腰丹',
    '润声丹',
    '透视纱衣',
    '透视肚兜',
    '开胸襦裙',
    '肛塞',
    '乳头夹',
    '师姐装',
    '药庐制服',
    '经阁制服',
    '铃铛装',
  ],
  50: [
    '阴蒂环',
    '贞操带',
    '乳热丹',
    '焚息丹',
    '缄潮丹',
    '媚体丹',
    '固敏丹',
    '含情丹',
    '镜羞丹',
    '透视罗裙',
    '开背长裙',
    '绑带装',
    '金属腰链',
    '纱幔装',
    '阴道球',
    '尾巴塞',
    '牵膝玉扣',
  ],
  70: ['淫纹', '子宫听潮坠', '乳泉引', '显情丹', '梦潮丸', '乱脉丹', '催乳丹', '催情丹', '羞阈丹', '龟甲缚衣', '吊带束缚裙', '金属链衣', '金属胸罩', '淫纹绘衣', '符文肚兜', '花瓣衣'],
  90: ['命铃锁喉环', '照心缚魂索', '莲印禁契钉', '掌心牵丝戒', '归主玉牌', '合欢锁魂铃', '照欲丹', '塑形丹', '掌门礼服'],
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
  return Math.floor((基础值 * 好感度) / 50);
}

/**
 * 计算灵石获取量
 * 公式：NPC境界系数 × 攻略值增量 × 灵石收益倍率
 */
export function calculate灵石获取(NPC名: NPC名, 攻略值增量: number): number {
  return NPC境界系数[NPC名] * 攻略值增量 * 灵石收益倍率;
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

export function get场景NPC列表(npcStates: Schema['NPC'], 当前场景: 场景名): NPC名[] {
  return 攻略链.filter(npc => npcStates[npc]?.当前场景 === 当前场景);
}

export function get在场NPC列表(context: { 在场NPC?: readonly string[] } | null | undefined): NPC名[] {
  return normalizePresentNpcs(context?.在场NPC ?? []);
}

export function get窃听阶段(攻略值: number): 窃听阶段 {
  if (攻略值 <= 30) return '警戒';
  if (攻略值 <= 70) return '动摇';
  return '沉沦';
}

export function get窃听成功率(当前场景: 场景名): number {
  return 窃听成功率[当前场景] ?? 0.65;
}

export function get反噬倍率(当前场景: 场景名): number {
  return 反噬倍率[当前场景] ?? 1;
}

export function perform灵识窃取(粘滞计数: number, 攻略值: number, 当前场景: 场景名, roll = Math.random()): { success: boolean; backlash: number; stage: 窃听阶段; successRate: number } {
  const stage = get窃听阶段(攻略值);
  const successRate = Math.min(0.98, get窃听成功率(当前场景) + Math.min(粘滞计数, 9) * 0.02);
  const success = roll < successRate;
  const backlash = success ? 0 : Math.ceil((100 - 攻略值) / 20 * get反噬倍率(当前场景));
  return { success, backlash, stage, successRate };
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
 * 按行为类型差异化：采补3层、羞辱指令2层、寸止/憋尿2层、多人同时1层
 */
export function check粘滞触发(粘滞计数: number, 行为类型: 行为类型): boolean {
  return 粘滞计数 >= get粘滞阈值(行为类型);
}

/**
 * 获取粘滞阈值（按行为类型差异化）
 * 采补: 3层 | 羞辱指令: 2层 | 寸止/憋尿: 2层 | 多人同时: 1层
 */
export function get粘滞阈值(行为类型: 行为类型): number {
  switch (行为类型) {
    case 'NSFW行为': return 3;
    case '亲密接触': return 2;
    case '日常接触': return 1;
    default: return 3;
  }
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
  return shouldEnterPhase2(剩余天数);
}

function getP2入场日课(data: Schema): { 日课: string; 支配者: NPC名 | ''; 待执行日课: string[] } {
  const scene = data.系统.当前场景 || data.系统.场景上下文?.地点 || '';
  const time = data.系统.时辰;

  if (scene.includes('阴阳池') || time === '酉时') {
    return { 日课: '阴阳池验身', 支配者: '沈月秋', 待执行日课: ['验身', '登记', '牝印唤醒'] };
  }
  if (time === '晨时') {
    return { 日课: '晨课点名', 支配者: '纪兰', 待执行日课: ['点名', '验身', '牝印唤醒'] };
  }
  if (time === '午时') {
    return { 日课: '执事登记', 支配者: '纪兰', 待执行日课: ['登记', '问契', '服从复核'] };
  }
  return { 日课: '寝前复命', 支配者: '柳素衣', 待执行日课: ['复命', '牝印复核', '寝役候命'] };
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

  const p2Entry = getP2入场日课(data);
  const currentDay = data.系统.时间状态?.当前日 ?? 1;
  const currentTime = data.系统.时辰 ?? '晨时';
  const entrySummary = `牝奴期入场：${p2Entry.日课}，牝印开始接管日课。`;

  data.牝奴.入场日 = data.牝奴.入场日 || currentDay;
  data.牝奴.当前日课 = data.牝奴.当前日课 && data.牝奴.当前日课 !== '候命' ? data.牝奴.当前日课 : p2Entry.日课;
  data.牝奴.当前支配者 = data.牝奴.当前支配者 || p2Entry.支配者;
  data.牝奴.当前命令 = data.牝奴.当前命令 || '跪候牝印点名';
  data.牝奴.命令强度 = Math.max(data.牝奴.命令强度 ?? 0, 45);
  data.牝奴.今日调教次数 ??= 0;
  data.牝奴.待执行日课 = data.牝奴.待执行日课?.length ? data.牝奴.待执行日课 : p2Entry.待执行日课;
  data.牝奴.最近调教结算 = data.牝奴.最近调教结算 || entrySummary;
  data.牝奴.调教记录 = [
    ...((data.牝奴.调教记录 ?? []).slice(-9)),
    {
      id: `p2_entry_${currentDay}_${currentTime}`,
      时辰: currentTime,
      支配者: p2Entry.支配者,
      摘要: entrySummary,
      羞名等级: '微闻',
    },
  ];
  if (p2Entry.支配者) {
    data.牝奴.上次支配者 = p2Entry.支配者;
    data.牝奴.支配次数[p2Entry.支配者] = data.牝奴.支配次数[p2Entry.支配者] ?? 0;
  }

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

/**
 * 检查是否为牝奴期专属道具
 */
export function is牝奴道具(道具名称: string): boolean {
  return ['牝印', '牝环', '牝铃', '牝链'].includes(道具名称);
}

/**
 * 检查牝奴道具是否可以装备
 * 牝奴道具仅在牝奴期可装备
 */
export function canEquip牝奴道具(当前阶段: '攻略期' | '牝奴期', 道具名称: string): boolean {
  if (!is牝奴道具(道具名称)) return true; // 非牝奴道具，走正常校验
  return 当前阶段 === '牝奴期';
}


/**
 * 情欲控制系统三阶段
 * 阶1=基础控制，阶2=寸止控制，阶3=条件高潮
 */
export function get情欲控制阶段(阶段: number): string {
  switch (阶段) {
    case 1: return '基础控制';
    case 2: return '寸止控制';
    case 3: return '条件高潮';
    default: return '基础控制';
  }
}

/**
 * 检查情欲控制阶段是否可以升级
 * 必须在牝奴期，且堕落度达到对应门槛
 */
export function canUpgrade情欲控制(当前阶段: '攻略期' | '牝奴期', 当前情欲控制阶段: number, 堕落度: number): boolean {
  if (当前阶段 !== '牝奴期') return false;
  if (当前情欲控制阶段 >= 3) return false;
  // 阶2需要堕落度>=30，阶3需要堕落度>=60
  if (当前情欲控制阶段 === 1 && 堕落度 >= 30) return true;
  if (当前情欲控制阶段 === 2 && 堕落度 >= 60) return true;
  return false;
}
