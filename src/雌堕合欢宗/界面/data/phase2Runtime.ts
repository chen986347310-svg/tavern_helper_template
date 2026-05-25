import { createP2ShameRumorFromEvent, type P2ShameRumor } from './phase2Rumor';
import { createWorldEventRecord, type Publicity, type TimeName, type WorldEventRecord } from './worldTime';

export type NpcName = '白芷' | '苏芸' | '纪兰' | '沈月秋' | '柳素衣';
export type ShameLevel = '微闻' | '传开' | '挂牌' | '示众' | '烙名';

export type P2Routine = {
  日课: string;
  支配者: NpcName;
  默认命令: string;
};

export type TrainingRecord = {
  id: string;
  时辰: TimeName;
  支配者: string;
  摘要: string;
  羞名等级: ShameLevel;
};

export type Phase2RuntimeState = {
  堕落度: number;
  牝阴决层数: number;
  当前日课: string;
  当前支配者: '' | NpcName;
  当前命令: string;
  命令强度: number;
  今日调教次数: number;
  待执行日课: string[];
  最近调教结算: string;
  调教记录: TrainingRecord[];
  支配次数: Record<NpcName, number>;
};

export type P2TrainingEvent = {
  时辰: TimeName;
  地点: string;
  支配者?: NpcName;
  命令: string;
  公开度: Publicity;
  后果标签: string[];
};

const DEFAULT_ROUTINE: P2Routine = {
  日课: '候命听训',
  支配者: '纪兰',
  默认命令: '垂首候命，等待牝印点名',
};

const ROUTINES: Array<P2Routine & { 时辰: TimeName; 地点: string }> = [
  { 时辰: '晨时', 地点: '莲灯前苑', 日课: '晨课点名', 支配者: '纪兰', 默认命令: '在名册前应声，不准迟疑' },
  { 时辰: '午时', 地点: '听风廊', 日课: '听风复名', 支配者: '纪兰', 默认命令: '复述今日羞名，记入风声' },
  { 时辰: '酉时', 地点: '阴阳池', 日课: '阴阳池验身', 支配者: '沈月秋', 默认命令: '跪候验身，不准遮住牝印' },
  { 时辰: '亥时', 地点: '掌门殿偏殿', 日课: '寝前复命', 支配者: '柳素衣', 默认命令: '跪前复命，交代今日调教余波' },
];

function isSamePlace(expected: string, actual: string): boolean {
  return expected.includes(actual) || actual.includes(expected);
}

function shameLevelFor(publicity: Publicity, tags: string[]): ShameLevel {
  if (tags.includes('公开示众') || publicity === '公开') return '挂牌';
  if (publicity === '半私密') return '传开';
  if (publicity === '禁地') return '烙名';
  return '微闻';
}

function commandStrengthFor(publicity: Publicity, tags: string[]): number {
  if (tags.includes('公开示众') || publicity === '公开') return 70;
  if (publicity === '半私密') return 55;
  if (publicity === '禁地') return 80;
  return 40;
}

export function getP2RoutineByTime(input: { 时辰: TimeName; 地点?: string }): P2Routine {
  const location = input.地点 ?? '';
  const exact = ROUTINES.find((routine) => routine.时辰 === input.时辰 && location && isSamePlace(routine.地点, location));
  if (exact) return { 日课: exact.日课, 支配者: exact.支配者, 默认命令: exact.默认命令 };

  const byTime = ROUTINES.find((routine) => routine.时辰 === input.时辰);
  if (byTime) return { 日课: byTime.日课, 支配者: byTime.支配者, 默认命令: byTime.默认命令 };

  return DEFAULT_ROUTINE;
}

export function appendTrainingRecord(existing: TrainingRecord[], record: TrainingRecord): TrainingRecord[] {
  return [...existing, record].slice(-10);
}

export function settleP2TrainingEvent(input: {
  state: Phase2RuntimeState;
  event: P2TrainingEvent;
}): { next: Phase2RuntimeState; worldEvent: WorldEventRecord; shameRumor: P2ShameRumor | null } {
  const routine = getP2RoutineByTime({ 时辰: input.event.时辰, 地点: input.event.地点 });
  const dominator = input.event.支配者 ?? routine.支配者;
  const summary = `${dominator}在${input.event.地点}执行${routine.日课}：${input.event.命令}。`;
  const shameLevel = shameLevelFor(input.event.公开度, input.event.后果标签);
  const generatedRumor = input.event.公开度 === '公开' || input.event.后果标签.includes('公开示众');
  const record: TrainingRecord = {
    id: `p2_${input.event.时辰}_${input.event.地点}_${dominator}_${input.state.今日调教次数 + 1}`,
    时辰: input.event.时辰,
    支配者: dominator,
    摘要: summary,
    羞名等级: shameLevel,
  };

  const next: Phase2RuntimeState = {
    ...input.state,
    当前日课: routine.日课,
    当前支配者: dominator,
    当前命令: input.event.命令,
    命令强度: commandStrengthFor(input.event.公开度, input.event.后果标签),
    今日调教次数: input.state.今日调教次数 + 1,
    最近调教结算: summary,
    调教记录: appendTrainingRecord(input.state.调教记录, record),
    支配次数: {
      ...input.state.支配次数,
      [dominator]: (input.state.支配次数[dominator] ?? 0) + 1,
    },
  };

  const worldEvent = createWorldEventRecord({
    action: { 类型: 'P2日课' },
    time: { 当前日: 1, 时辰: input.event.时辰 },
    context: { 地点: input.event.地点, 公开度: input.event.公开度, 在场NPC: [dominator] },
    tags: input.event.后果标签,
    summary,
    generatedRumor,
  });

  return { next, worldEvent, shameRumor: createP2ShameRumorFromEvent(worldEvent) };
}
