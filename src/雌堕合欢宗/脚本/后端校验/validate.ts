import _ from 'lodash';
import type { Schema } from '../../schema';
import { getCurrentNpc, canIncrease攻略值, checkItemThreshold, calculate攻略值增量, initializePhase2 } from '../../界面/guards';

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;

/**
 * 强制转换为有效数字，处理 AI 脏数据
 */
function coerceNumeric(value: any, max: number = 100, min: number = 0): number {
  if (value === null || value === undefined) return min;
  if (typeof value === 'number') {
    if (isNaN(value)) return min;
    if (!isFinite(value)) return max;
    return Math.max(min, Math.min(max, value));
  }
  if (typeof value === 'string') {
    const num = Number(value);
    if (isNaN(num)) return min;
    return Math.max(min, Math.min(max, num));
  }
  return min;
}
/**
 * Pure backend validation function.
 * Mutates new_data in place to enforce all game rules.
 */
export function validateVariables(
  new_data: Record<string, any>,
  old_data: Record<string, any>,
): void {
  // 0. type coercion for AI dirty data
  for (const npc of NPC列表) {
    _.set(new_data, `NPC.${npc}.好感度`, coerceNumeric(_.get(new_data, `NPC.${npc}.好感度`, 0), 100, 0));
    _.set(new_data, `NPC.${npc}.攻略值`, coerceNumeric(_.get(new_data, `NPC.${npc}.攻略值`, 0), 100, 0));
    _.set(new_data, `NPC.${npc}.粘滞计数`, coerceNumeric(_.get(new_data, `NPC.${npc}.粘滞计数`, 0), 3, 0));
  }
  _.set(new_data, '系统.灵石', coerceNumeric(_.get(new_data, '系统.灵石', 0), Infinity, 0));
  _.set(new_data, '系统.剩余天数', coerceNumeric(_.get(new_data, '系统.剩余天数', 30), 30, 0));
  _.set(new_data, '牝奴.堕落度', coerceNumeric(_.get(new_data, '牝奴.堕落度', 0), 100, 0));
  _.set(new_data, '牝奴.牝阴决层数', coerceNumeric(_.get(new_data, '牝奴.牝阴决层数', 0), 9, 0));
  // 1a. Phase 切换自动触发
  const 剩余天数 = _.get(new_data, '系统.剩余天数', 30);
  const old_阶段 = _.get(old_data, '系统.阶段', '攻略期');
  if (剩余天数 <= 0 && old_阶段 === '攻略期') {
    initializePhase2(new_data as any);
    return;
  }

  // 1f. Phase 2 变量冻结
  const 当前阶段 = _.get(new_data, '系统.阶段', '攻略期');
  if (当前阶段 === '牝奴期') {
    for (const npc of NPC列表) {
      _.set(new_data, `NPC.${npc}.好感度`, _.get(old_data, `NPC.${npc}.好感度`, 0));
      _.set(new_data, `NPC.${npc}.攻略值`, _.get(old_data, `NPC.${npc}.攻略值`, 0));
      _.set(new_data, `NPC.${npc}.粘滞计数`, _.get(old_data, `NPC.${npc}.粘滞计数`, 0));
    }
  }
  // 1b. 攻略链顺序强制
  const npcStates: Record<string, { 状态: string }> = {};
  for (const npc of NPC列表) {
    npcStates[npc] = { 状态: _.get(new_data, `NPC.${npc}.状态`, '未开始') };
  }
  const currentNpc = getCurrentNpc(npcStates);

  for (const npc of NPC列表) {
    const old_好感度 = _.get(old_data, `NPC.${npc}.好感度`, 0);
    const new_好感度 = _.get(new_data, `NPC.${npc}.好感度`, 0);
    const old_攻略值 = _.get(old_data, `NPC.${npc}.攻略值`, 0);
    const new_攻略值 = _.get(new_data, `NPC.${npc}.攻略值`, 0);

    if (new_好感度 < 30 && new_攻略值 !== 0) {
      _.set(new_data, `NPC.${npc}.攻略值`, 0);
      continue;
    }

    if (new_攻略值 < old_攻略值) {
      _.set(new_data, `NPC.${npc}.攻略值`, old_攻略值);
      continue;
    }

    if (new_攻略值 > old_攻略值) {
      if (!canIncrease攻略值(npc as any, currentNpc as any, new_好感度)) {
        _.set(new_data, `NPC.${npc}.攻略值`, old_攻略值);
      }
    }
  }

  // 1d. 装备门槛校验
  const 装备目标 = ['玩家', '白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
  for (const target of 装备目标) {
    const new_equipped: string[] = _.get(new_data, `道具.装备.${target}`, []);
    if (!Array.isArray(new_equipped) || new_equipped.length === 0) continue;

    const npc好感度 = target === '玩家'
      ? 100
      : _.get(new_data, `NPC.${target}.好感度`, 0);

    const valid = new_equipped.filter((item: string) => {
      if (target === '玩家') return true;
      return checkItemThreshold(npc好感度, item);
    });

    if (valid.length !== new_equipped.length) {
      _.set(new_data, `道具.装备.${target}`, valid);
    }
  }
  // 1e. 改变阵法购买前置校验
  const old_拥有改变阵法 = _.get(old_data, '道具.拥有.改变阵法', 0);
  const new_拥有改变阵法 = _.get(new_data, '道具.拥有.改变阵法', 0);
  if (old_拥有改变阵法 === 0 && new_拥有改变阵法 >= 1) {
    const 柳素衣攻略值 = _.get(new_data, 'NPC.柳素衣.攻略值', 0);
    if (柳素衣攻略值 < 100) {
      _.set(new_data, '道具.拥有.改变阵法', 0);
      const 当前灵石 = _.get(new_data, '系统.灵石', 0);
      _.set(new_data, '系统.灵石', 当前灵石 + 500000);
    }
  }

  // 1c. 粘滞触发兆底
  for (const npc of NPC列表) {
    const 粘滞计数 = _.get(new_data, `NPC.${npc}.粘滞计数`, 0);
    const 好感度 = _.get(new_data, `NPC.${npc}.好感度`, 0);
    const 当前攻略值 = _.get(new_data, `NPC.${npc}.攻略值`, 0);

    if (粘滞计数 > 3) {
      _.set(new_data, `NPC.${npc}.粘滞计数`, 0);
      continue;
    }

    if (粘滞计数 >= 3 && 好感度 >= 30) {
      const 增量 = calculate攻略值增量(10, 好感度);
      const 新攻略值 = Math.min(当前攻略值 + 增量, 100);
      _.set(new_data, `NPC.${npc}.攻略值`, 新攻略值);
      _.set(new_data, `NPC.${npc}.粘滞计数`, 0);
    }
  }
  // 灵石不能为负
  const 灵石 = _.get(new_data, '系统.灵石', 0);
  if (灵石 < 0) {
    _.set(new_data, '系统.灵石', 0);
  }

  // 堕落度只能升不能降（Phase 2）
  if (当前阶段 === '牝奴期') {
    const old_堕落度 = _.get(old_data, '牝奴.堕落度', 0);
    const new_堕落度 = _.get(new_data, '牝奴.堕落度', 0);
    if (new_堕落度 < old_堕落度) {
      _.set(new_data, '牝奴.堕落度', old_堕落度);
    }
  }

  // 牝阴决层数不能超过9
  const 牝阴决层数 = _.get(new_data, '牝奴.牝阴决层数', 0);
  if (牝阴决层数 > 9) {
    _.set(new_data, '牝奴.牝阴决层数', 9);
  }

  // 剩余天数范围校验（含取整）
  const 天数取整 = Math.floor(剩余天数);
  if (天数取整 !== 剩余天数) {
    _.set(new_data, '系统.剩余天数', 天数取整);
  }
  if (天数取整 < 0) {
    _.set(new_data, '系统.剩余天数', 0);
  }
  if (天数取整 > 30) {
    _.set(new_data, '系统.剩余天数', 30);
  }
  // 好感度和攻略值范围校验
  for (const npc of NPC列表) {
    const 好感度 = _.get(new_data, `NPC.${npc}.好感度`, 0);
    const 攻略值 = _.get(new_data, `NPC.${npc}.攻略值`, 0);
    if (好感度 < 0) _.set(new_data, `NPC.${npc}.好感度`, 0);
    if (好感度 > 100) _.set(new_data, `NPC.${npc}.好感度`, 100);
    if (攻略值 < 0) _.set(new_data, `NPC.${npc}.攻略值`, 0);
    if (攻略值 > 100) _.set(new_data, `NPC.${npc}.攻略值`, 100);
  }

  // 堕落度范围校验
  const 堕落度 = _.get(new_data, '牝奴.堕落度', 0);
  if (堕落度 < 0) _.set(new_data, '牝奴.堕落度', 0);
  if (堕落度 > 100) _.set(new_data, '牝奴.堕落度', 100);
}