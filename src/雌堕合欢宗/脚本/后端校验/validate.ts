import _ from 'lodash';
import type { Schema } from '../../schema';
import {
  getCurrentNpc,
  canIncrease攻略值,
  checkItemThreshold,
  calculate攻略值增量,
  initializePhase2,
} from '../../界面/guards';
import { settleP2TrainingEvent, type NpcName } from '../../界面/data/phase2Runtime';

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
const NPC_SET = new Set<string>(NPC列表);
const TIME_NAMES = ['晨时', '午时', '酉时', '亥时'] as const;
const TIME_NAME_SET = new Set<string>(TIME_NAMES);

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

function normalizeTimeName(value: unknown, fallback: string = '晨时'): string {
  if (typeof value !== 'string') return TIME_NAME_SET.has(fallback) ? fallback : '晨时';
  if (TIME_NAME_SET.has(value)) return value;
  if (/卯|辰|巳|早|晨/.test(value)) return '晨时';
  if (/午|未|昼/.test(value)) return '午时';
  if (/申|酉|戌|暮|晚/.test(value)) return '酉时';
  if (/亥|子|丑|寅|夜/.test(value)) return '亥时';
  return TIME_NAME_SET.has(fallback) ? fallback : '晨时';
}

function normalizeTimeFields(new_data: Record<string, any>, old_data: Record<string, any>): void {
  const fallback = normalizeTimeName(_.get(old_data, '系统.时辰', '晨时'));
  const currentTime = normalizeTimeName(_.get(new_data, '系统.时辰'), fallback);
  _.set(new_data, '系统.时辰', currentTime);

  const events = _.get(new_data, '剧情.事件记录', []);
  if (Array.isArray(events)) {
    for (const event of events) {
      if (_.isPlainObject(event)) {
        event.时辰 = normalizeTimeName(event.时辰, currentTime);
      }
    }
  }

  const trainingRecords = _.get(new_data, '牝奴.调教记录', []);
  if (Array.isArray(trainingRecords)) {
    for (const record of trainingRecords) {
      if (_.isPlainObject(record)) {
        record.时辰 = normalizeTimeName(record.时辰, currentTime);
      }
    }
  }
}

function ensureV4SystemFields(new_data: Record<string, any>): void {
  if (!_.has(new_data, '系统.时辰')) _.set(new_data, '系统.时辰', '晨时');
  if (!_.has(new_data, '系统.当前场景')) _.set(new_data, '系统.当前场景', '莲灯前苑');
  if (!Array.isArray(_.get(new_data, '系统.待处理交互'))) _.set(new_data, '系统.待处理交互', []);
  if (!_.isPlainObject(_.get(new_data, '系统.时间状态'))) {
    _.set(new_data, '系统.时间状态', {
      当前日: 1,
      时段进度: 0,
      最近耗时: '',
      最近结算原因: '',
      最近事件类型: '',
      是否过夜: false,
    });
  }
  if (!_.isPlainObject(_.get(new_data, '系统.欲海状态'))) {
    _.set(new_data, '系统.欲海状态', {
      搜寻进度: 0,
      警戒等级: '平静',
      遮蔽剩余时段: 0,
      遮蔽来源: '',
      最近暴露原因: '',
      已被定位: false,
    });
  }
  if (!_.isPlainObject(_.get(new_data, '系统.场景上下文'))) {
    _.set(new_data, '系统.场景上下文', {
      地点: _.get(new_data, '系统.当前场景', '莲灯前苑'),
      子区域: '',
      场景来源: '核心地点',
      公开度: '公开',
      在场NPC: [],
      NPC活动: {},
      氛围: [],
      故事钩子: [],
      特殊事件: '',
    });
  }
  if (!Array.isArray(_.get(new_data, '系统.风声列表'))) _.set(new_data, '系统.风声列表', []);
  if (!Array.isArray(_.get(new_data, '系统.心音回响'))) _.set(new_data, '系统.心音回响', []);
  if (!_.has(new_data, '系统.当前追查风声ID')) _.set(new_data, '系统.当前追查风声ID', '');
  if (!Array.isArray(_.get(new_data, '剧情.事件记录'))) _.set(new_data, '剧情.事件记录', []);
  if (!Array.isArray(_.get(new_data, '剧情.已解锁'))) _.set(new_data, '剧情.已解锁', []);
  if (!_.isPlainObject(_.get(new_data, '剧情.线索状态'))) _.set(new_data, '剧情.线索状态', {});
  if (!_.has(new_data, '牝奴.当前日课') || _.get(new_data, '牝奴.当前日课') === null) _.set(new_data, '牝奴.当前日课', '候命');
  if (!_.has(new_data, '牝奴.当前支配者') || _.get(new_data, '牝奴.当前支配者') === null) _.set(new_data, '牝奴.当前支配者', '');
  if (!_.has(new_data, '牝奴.当前命令') || _.get(new_data, '牝奴.当前命令') === null) _.set(new_data, '牝奴.当前命令', '');
  if (!_.has(new_data, '牝奴.命令强度') || _.get(new_data, '牝奴.命令强度') === null) _.set(new_data, '牝奴.命令强度', 0);
  if (!_.has(new_data, '牝奴.今日调教次数') || _.get(new_data, '牝奴.今日调教次数') === null) _.set(new_data, '牝奴.今日调教次数', 0);
  if (!Array.isArray(_.get(new_data, '牝奴.待执行日课'))) _.set(new_data, '牝奴.待执行日课', []);
  if (!_.has(new_data, '牝奴.最近调教结算') || _.get(new_data, '牝奴.最近调教结算') === null) _.set(new_data, '牝奴.最近调教结算', '');
  if (!Array.isArray(_.get(new_data, '牝奴.羞名标签'))) _.set(new_data, '牝奴.羞名标签', []);
  if (!Array.isArray(_.get(new_data, '牝奴.调教记录'))) _.set(new_data, '牝奴.调教记录', []);
}

function mergeEventLedger(new_data: Record<string, any>, old_data: Record<string, any>): void {
  const oldEvents = _.get(old_data, '剧情.事件记录', []);
  const newEvents = _.get(new_data, '剧情.事件记录', []);
  if (!Array.isArray(oldEvents) || !Array.isArray(newEvents)) return;

  const byId = new Map<string, any>();
  const merged: any[] = [];

  for (const event of [...oldEvents, ...newEvents]) {
    if (!_.isPlainObject(event)) continue;
    const id = typeof event.id === 'string' && event.id.trim() ? event.id : JSON.stringify(event);
    const existingIndex = byId.get(id);
    if (existingIndex === undefined) {
      byId.set(id, merged.length);
      merged.push(event);
    } else {
      merged[existingIndex] = event;
    }
  }

  _.set(new_data, '剧情.事件记录', merged.slice(-20));
}

function getSoulEchoSemanticKey(echo: unknown): string {
  if (!_.isPlainObject(echo)) return '';
  const npc = typeof echo.npc === 'string' ? echo.npc.trim() : '';
  const text = typeof echo.text === 'string' ? echo.text.trim() : '';
  const scene = typeof echo.scene === 'string' ? echo.scene.trim() : '';
  const time = typeof echo.time === 'string' ? echo.time.trim() : '';
  return npc && text && scene && time ? `${npc}\u0000${text}\u0000${scene}\u0000${time}` : '';
}

function normalizeSoulEchoLedger(new_data: Record<string, any>): void {
  const echoes = _.get(new_data, '系统.心音回响', []);
  if (!Array.isArray(echoes)) {
    _.set(new_data, '系统.心音回响', []);
    return;
  }

  const seenIds = new Set<string>();
  const seenSemanticKeys = new Set<string>();
  const normalized: any[] = [];

  for (const echo of echoes) {
    if (!_.isPlainObject(echo)) continue;
    const id = typeof echo.id === 'string' ? echo.id.trim() : '';
    if (id && seenIds.has(id)) continue;

    const semanticKey = getSoulEchoSemanticKey(echo);
    if (semanticKey && seenSemanticKeys.has(semanticKey)) continue;

    if (id) seenIds.add(id);
    if (semanticKey) seenSemanticKeys.add(semanticKey);
    normalized.push(echo);
  }

  _.set(new_data, '系统.心音回响', normalized.slice(-12));
}

function isEmptyP2Runtime(new_data: Record<string, any>): boolean {
  return (_.get(new_data, '牝奴.当前日课', '候命') === '候命' || !_.get(new_data, '牝奴.当前日课'))
    && !_.get(new_data, '牝奴.当前支配者')
    && !_.get(new_data, '牝奴.当前命令')
    && coerceNumeric(_.get(new_data, '牝奴.今日调教次数', 0), 99, 0) === 0
    && Array.isArray(_.get(new_data, '牝奴.调教记录', []))
    && _.get(new_data, '牝奴.调教记录', []).length === 0;
}

function findLatestP2TrainingEvent(new_data: Record<string, any>): Record<string, any> | null {
  const events = _.get(new_data, '剧情.事件记录', []);
  if (!Array.isArray(events)) return null;

  for (const event of [...events].reverse()) {
    if (!_.isPlainObject(event)) continue;
    const tags = Array.isArray(event.后果标签) ? event.后果标签.map(String) : [];
    const haystack = [event.类型, event.摘要, event.地点, ...tags].filter(Boolean).join(' ');
    if (/调教|羞辱|服从|深度亲密|NSFW|欲海/.test(haystack)) return event;
  }

  const sceneEvent = _.get(new_data, '系统.场景上下文.特殊事件', '');
  if (typeof sceneEvent === 'string' && /调教|羞辱|服从|深度亲密|NSFW|欲海/.test(sceneEvent)) {
    return {
      类型: sceneEvent,
      摘要: sceneEvent,
      时辰: _.get(new_data, '系统.时辰', '晨时'),
      地点: _.get(new_data, '系统.场景上下文.地点', _.get(new_data, '系统.当前场景', '莲灯前苑')),
      涉及NPC: _.get(new_data, '系统.场景上下文.在场NPC', []),
      公开度: _.get(new_data, '系统.场景上下文.公开度', '半私密'),
      后果标签: [sceneEvent],
    };
  }

  return null;
}

function pickP2Dominator(event: Record<string, any>, new_data: Record<string, any>): NpcName | undefined {
  const candidates = [
    ...(Array.isArray(event.涉及NPC) ? event.涉及NPC : []),
    ...(Array.isArray(_.get(new_data, '系统.场景上下文.在场NPC')) ? _.get(new_data, '系统.场景上下文.在场NPC') : []),
  ];
  const npc = candidates.find((name: unknown) => typeof name === 'string' && NPC_SET.has(name));
  return npc as NpcName | undefined;
}

function inferP2Command(event: Record<string, any>, new_data: Record<string, any>): string {
  const summary = typeof event.摘要 === 'string' ? event.摘要 : '';
  if (summary) return summary;
  const npcActivities = _.get(new_data, '系统.场景上下文.NPC活动', {});
  if (_.isPlainObject(npcActivities)) {
    const activity = Object.values(npcActivities).find(value => typeof value === 'string' && value.trim());
    if (typeof activity === 'string') return activity;
  }
  const hook = _.get(new_data, '系统.场景上下文.故事钩子.0', '');
  if (typeof hook === 'string' && hook) return hook;
  return '垂首服从当前牝印命令';
}

function autoSettleP2TrainingFallback(new_data: Record<string, any>): void {
  if (_.get(new_data, '系统.阶段') !== '牝奴期') return;
  if (!isEmptyP2Runtime(new_data)) return;

  const event = findLatestP2TrainingEvent(new_data);
  if (!event) return;

  const result = settleP2TrainingEvent({
    state: _.get(new_data, '牝奴'),
    event: {
      时辰: _.get(event, '时辰', _.get(new_data, '系统.时辰', '晨时')),
      地点: _.get(event, '地点', _.get(new_data, '系统.场景上下文.地点', _.get(new_data, '系统.当前场景', '莲灯前苑'))),
      支配者: pickP2Dominator(event, new_data),
      命令: inferP2Command(event, new_data),
      公开度: _.get(event, '公开度', _.get(new_data, '系统.场景上下文.公开度', '半私密')),
      后果标签: Array.isArray(event.后果标签) ? event.后果标签.map(String) : [],
    },
  });

  _.set(new_data, '牝奴', result.next);
}

function normalizeP2DominanceCounts(new_data: Record<string, any>, old_data: Record<string, any>): void {
  if (_.get(new_data, '系统.阶段') !== '牝奴期') return;
  const oldRecords = _.get(old_data, '牝奴.调教记录', []);
  const newRecords = _.get(new_data, '牝奴.调教记录', []);
  if (!Array.isArray(oldRecords) || !Array.isArray(newRecords)) return;

  const oldIds = oldRecords.map((record: unknown) => _.isPlainObject(record) ? record.id : '').filter(Boolean);
  const newIds = newRecords.map((record: unknown) => _.isPlainObject(record) ? record.id : '').filter(Boolean);
  const hasNewTrainingRecord = newIds.some((id: unknown) => !oldIds.includes(id));
  if (hasNewTrainingRecord) return;

  for (const npc of NPC列表) {
    _.set(new_data, `牝奴.支配次数.${npc}`, coerceNumeric(_.get(old_data, `牝奴.支配次数.${npc}`, 0), 99, 0));
  }
}

function preserveP2TrainingLedger(new_data: Record<string, any>, old_data: Record<string, any>): void {
  if (_.get(new_data, '系统.阶段') !== '牝奴期') return;
  const oldRecords = _.get(old_data, '牝奴.调教记录', []);
  const newRecords = _.get(new_data, '牝奴.调教记录', []);
  if (!Array.isArray(oldRecords) || !Array.isArray(newRecords)) return;
  if (oldRecords.length === 0 || newRecords.length > 0) return;

  _.set(new_data, '牝奴.调教记录', oldRecords);
  _.set(new_data, '牝奴.今日调教次数', coerceNumeric(_.get(old_data, '牝奴.今日调教次数', oldRecords.length), 99, 0));
  _.set(new_data, '牝奴.最近调教结算', _.get(old_data, '牝奴.最近调教结算', ''));
}
/**
 * Pure backend validation function.
 * Mutates new_data in place to enforce all game rules.
 */
export function validateVariables(new_data: Record<string, any>, old_data: Record<string, any>): void {
  // 0. v4 migration defaults for old chat snapshots
  ensureV4SystemFields(new_data);
  normalizeSoulEchoLedger(new_data);
  mergeEventLedger(new_data, old_data);
  normalizeTimeFields(new_data, old_data);

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
    autoSettleP2TrainingFallback(new_data);
    preserveP2TrainingLedger(new_data, old_data);
    normalizeP2DominanceCounts(new_data, old_data);
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

    const npc好感度 = target === '玩家' ? 100 : _.get(new_data, `NPC.${target}.好感度`, 0);

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
