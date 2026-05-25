export type TimeName = '晨时' | '午时' | '酉时' | '亥时';
export type Publicity = '公开' | '半私密' | '私密' | '禁地';
export type DesireSeaAlert = '平静' | '微动' | '警觉' | '锁定' | '已改写';

export type TimeState = {
  当前日: number;
  时辰: TimeName;
  剩余天数: number;
  时段进度: number;
  最近耗时: string;
  最近结算原因: string;
  最近事件类型: string;
  是否过夜: boolean;
};

export type DesireSeaState = {
  搜寻进度: number;
  警戒等级: DesireSeaAlert;
  遮蔽剩余时段: number;
  遮蔽来源: string;
  最近暴露原因: string;
  已被定位: boolean;
};

export type RuntimeAction = {
  类型?: string;
  道具?: string;
  风声ID?: string;
  强度?: '普通' | '深度';
};

export type RuntimeContext = {
  地点?: string;
  公开度?: Publicity;
  在场NPC?: string[];
};

export type TimeCost = {
  slots: number;
  label: string;
  reason: string;
  eventType: string;
  dayDelta?: number;
};

export type WorldEventRecord = {
  id: string;
  类型: string;
  摘要: string;
  日: number;
  时辰: TimeName;
  地点: string;
  涉及NPC: string[];
  公开度: Publicity;
  后果标签: string[];
  已生成风声: boolean;
};

export type NpcScheduleSuggestion = {
  npc: string;
  地点: string;
  活动: string;
  匹配原因: string;
};

const TIME_ORDER: TimeName[] = ['晨时', '午时', '酉时', '亥时'];

const NPC_SCHEDULE: Record<string, Record<TimeName, { 地点: string; 活动: string }>> = {
  白芷: {
    晨时: { 地点: '莲灯前苑', 活动: '洒扫与整理旧卷' },
    午时: { 地点: '经阁', 活动: '静读避人' },
    酉时: { 地点: '听风廊', 活动: '整理风声残页' },
    亥时: { 地点: '锁心静室', 活动: '独自守心' },
  },
  苏芸: {
    晨时: { 地点: '外门广场', 活动: '晨课试药' },
    午时: { 地点: '药庐暖阁', 活动: '照看丹炉' },
    酉时: { 地点: '药庐', 活动: '观察药性' },
    亥时: { 地点: '药庐暖阁', 活动: '复查错炉药签' },
  },
  纪兰: {
    晨时: { 地点: '双修册登记处', 活动: '登记弟子行止' },
    午时: { 地点: '听风廊', 活动: '查问风声' },
    酉时: { 地点: '执事名册', 活动: '核验公开记录' },
    亥时: { 地点: '禁录室', 活动: '归档事件痕迹' },
  },
  沈月秋: {
    晨时: { 地点: '资源调配处', 活动: '核算宗门资源' },
    午时: { 地点: '经阁', 活动: '查阅账册' },
    酉时: { 地点: '阴阳池', 活动: '巡看灵气失衡' },
    亥时: { 地点: '掌门殿偏殿', 活动: '处理高阶事务' },
  },
  柳素衣: {
    晨时: { 地点: '掌门殿', 活动: '闭门听报' },
    午时: { 地点: '掌门殿偏殿', 活动: '裁定宗门因果' },
    酉时: { 地点: '渊底灵脉', 活动: '感知欲海异动' },
    亥时: { 地点: '掌门殿偏殿', 活动: '静候牵丝回报' },
  },
};

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.round(value), min), max);
}

function alertForProgress(progress: number): DesireSeaAlert {
  if (progress >= 100) return '锁定';
  if (progress >= 70) return '警觉';
  if (progress >= 1) return '微动';
  return '平静';
}

export function estimateEventCost(action: RuntimeAction): TimeCost {
  const type = action.类型 ?? '对话';
  const item = action.道具 ?? '';

  if (type === '使用物品' && item === '时间延长') {
    return { slots: 0, label: '不耗时', reason: '时间延长生效，剩余天数增加', eventType: '时间延长', dayDelta: 1 };
  }
  if (type === '扫地') return { slots: 1, label: '一个时辰', reason: '扫地杂务推进一个时段', eventType: '扫地' };
  if (type === '追查风声') return { slots: 1, label: '一个时辰', reason: '追查风声推进一个时段', eventType: '追查风声' };
  if (type === 'NSFW') return { slots: 1, label: '一个时辰', reason: '亲密事件推进一个时段', eventType: 'NSFW' };
  if (type === '特殊事件') return { slots: 1, label: '一个时辰', reason: '特殊事件推进一个时段', eventType: '特殊事件' };

  return { slots: 0, label: '一刻钟内', reason: '普通对话不推进时辰', eventType: type };
}

export function advanceTime(current: TimeState, cost: TimeCost): TimeState {
  const startIndex = TIME_ORDER.indexOf(current.时辰) === -1 ? 0 : TIME_ORDER.indexOf(current.时辰);
  let index = startIndex;
  let day = clamp(current.当前日, 1, 999);
  let remainingDays = clamp(current.剩余天数, 0, 999);
  let overnight = false;

  for (let i = 0; i < cost.slots; i += 1) {
    index += 1;
    if (index >= TIME_ORDER.length) {
      index = 0;
      day += 1;
      remainingDays = Math.max(0, remainingDays - 1);
      overnight = true;
    }
  }

  if (cost.dayDelta) remainingDays = clamp(remainingDays + cost.dayDelta, 0, 999);

  return {
    ...current,
    当前日: day,
    时辰: TIME_ORDER[index],
    剩余天数: remainingDays,
    时段进度: index,
    最近耗时: cost.label,
    最近结算原因: cost.reason,
    最近事件类型: cost.eventType,
    是否过夜: overnight,
  };
}

export function settleDesireSea(current: DesireSeaState, event: RuntimeAction): DesireSeaState {
  const type = event.类型 ?? '';
  const item = event.道具 ?? '';

  if (type === '使用物品' && item === '投欲钥') {
    return { ...current, 搜寻进度: 100, 警戒等级: '锁定', 最近暴露原因: '投欲钥主动暴露欲海坐标', 已被定位: true };
  }
  if (type === '改变阵法') {
    return { ...current, 搜寻进度: 0, 警戒等级: '已改写', 最近暴露原因: '阵法改写，欲海压力被转向', 已被定位: false };
  }
  if (type === '使用物品' && item === '欲海遮蔽符') {
    return { ...current, 遮蔽剩余时段: Math.max(current.遮蔽剩余时段, 4), 遮蔽来源: '欲海遮蔽符', 最近暴露原因: '欲海遮蔽符生效' };
  }
  if (type !== 'NSFW') return current;

  const baseIncrease = event.强度 === '深度' ? 24 : 12;
  const shielded = current.遮蔽剩余时段 > 0;
  const increase = shielded ? 2 : baseIncrease;
  const nextProgress = clamp(current.搜寻进度 + increase, 0, 100);

  return {
    ...current,
    搜寻进度: nextProgress,
    警戒等级: alertForProgress(nextProgress),
    遮蔽剩余时段: shielded ? Math.max(0, current.遮蔽剩余时段 - 1) : current.遮蔽剩余时段,
    最近暴露原因: shielded ? '遮蔽生效，本次NSFW只留下极低欲海波纹' : 'NSFW气息暴露，欲海搜寻进度上升',
    已被定位: nextProgress >= 100,
  };
}

export function createWorldEventRecord(input: {
  action: RuntimeAction;
  time: Pick<TimeState, '当前日' | '时辰'>;
  context: RuntimeContext;
  tags: string[];
  summary: string;
  generatedRumor?: boolean;
}): WorldEventRecord {
  const type = input.action.类型 ?? '未知事件';
  const location = input.context.地点 || '莲灯前苑';
  return {
    id: `event_${input.time.当前日}_${input.time.时辰}_${type}_${location}`,
    类型: type,
    摘要: input.summary,
    日: input.time.当前日,
    时辰: input.time.时辰,
    地点: location,
    涉及NPC: input.context.在场NPC ?? [],
    公开度: input.context.公开度 ?? '公开',
    后果标签: input.tags,
    已生成风声: input.generatedRumor ?? false,
  };
}

export function appendWorldEventRecord(existing: WorldEventRecord[], record: WorldEventRecord): WorldEventRecord[] {
  return [...existing, record].slice(-20);
}

export function suggestNpcSchedule(input: { 时辰: TimeName; 地点?: string }): NpcScheduleSuggestion[] {
  const location = input.地点 ?? '';
  return Object.entries(NPC_SCHEDULE)
    .map(([npc, table]) => {
      const slot = table[input.时辰];
      const score = location && (location.includes(slot.地点) || slot.地点.includes(location)) ? 2 : 1;
      return {
        npc,
        地点: slot.地点,
        活动: slot.活动,
        匹配原因: score === 2 ? '地点与时辰同时匹配' : '时辰匹配',
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ score: _score, ...item }) => item);
}

export function settleWorldRuntime(input: {
  time: TimeState;
  desireSea: DesireSeaState;
  action: RuntimeAction;
  context: RuntimeContext;
}) {
  const cost = estimateEventCost(input.action);
  const time = advanceTime(input.time, cost);
  const desireSea = settleDesireSea(input.desireSea, input.action);
  const tags = [cost.eventType].filter(Boolean);
  const record = createWorldEventRecord({
    action: input.action,
    time,
    context: input.context,
    tags,
    summary: `${cost.eventType}已结算：${cost.reason}`,
  });

  return { time, desireSea, record };
}
