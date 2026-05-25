import { insertEntryRumor } from './narrativeEntry';
import type { WorldEventRecord } from './worldTime';

export type P2ShameRumorSource = '牝奴日课' | '牝印命令' | '调教余波' | '宗门闲谈' | '公开示众' | '支配者传唤';
export type P2GazeSource = '弟子低语' | '执事记录' | 'NPC目光' | '掌门注视' | '牝印回响';
export type P2ShameLevel = '微闻' | '传开' | '挂牌' | '示众' | '烙名';

export type P2ShameRumor = {
  id: string;
  来源: P2ShameRumorSource;
  地点: string;
  子区域?: string;
  相关NPC: string[];
  紧急度: '低' | '中' | '高';
  风声文本: string;
  故事钩子: string;
  状态: '未读' | '已读' | '已追查' | '已失效' | '追查中';
  凝视来源: P2GazeSource;
  羞名等级: P2ShameLevel;
  羞名标签: string[];
  反噬日课: string;
  是否可承接: boolean;
};

function inferRoutine(event: WorldEventRecord): string {
  if (event.摘要.includes('听风复名')) return '听风复名';
  if (event.摘要.includes('阴阳池验身')) return '阴阳池验身';
  if (event.摘要.includes('晨课点名')) return '晨课点名';
  if (event.摘要.includes('寝前复命')) return '寝前复命';
  return event.类型 === 'P2日课' ? '候命听训' : event.类型;
}

function inferSource(event: WorldEventRecord): P2ShameRumorSource | null {
  if (event.公开度 === '公开' || event.后果标签.includes('公开示众')) return '公开示众';
  if (event.公开度 === '半私密') return '调教余波';
  if (event.后果标签.includes('支配者传唤')) return '支配者传唤';
  if (event.后果标签.includes('牝印命令')) return '牝印命令';
  return null;
}

function inferGaze(event: WorldEventRecord): P2GazeSource {
  if (event.涉及NPC.includes('柳素衣')) return '掌门注视';
  if (event.公开度 === '公开' || event.后果标签.includes('公开示众')) return '弟子低语';
  if (event.公开度 === '半私密') return '执事记录';
  if (event.后果标签.includes('牝印发热')) return '牝印回响';
  return 'NPC目光';
}

function inferShameLevel(event: WorldEventRecord): P2ShameLevel {
  if (event.后果标签.includes('烙名') || event.公开度 === '禁地') return '烙名';
  if (event.后果标签.includes('公开示众') || event.公开度 === '公开') return '挂牌';
  if (event.公开度 === '半私密') return '传开';
  return '微闻';
}

function urgentFor(level: P2ShameLevel): '低' | '中' | '高' {
  if (level === '挂牌' || level === '示众' || level === '烙名') return '高';
  if (level === '传开') return '中';
  return '低';
}

function buildRumorText(event: WorldEventRecord, level: P2ShameLevel): string {
  const npc = event.涉及NPC[0] ?? '执事';
  if (level === '挂牌') return `${event.地点}的低语已经挂上名册，${npc}留下的朱批让你的羞名被人反复念起。`;
  if (level === '传开') return `${event.地点}的余波尚未散去，${npc}记录下那一次牝印发热后的细节。`;
  if (level === '烙名') return `${event.地点}的烙痕被牝印记住，${npc}的目光像一枚落定的印。`;
  return `${event.地点}有人低声提起你的日课，话尾带着未散的牝印余温。`;
}

export function createP2ShameRumorFromEvent(event: WorldEventRecord): P2ShameRumor | null {
  if (!event.已生成风声 && event.公开度 === '私密') return null;

  const source = inferSource(event);
  if (!source) return null;

  const shameLevel = inferShameLevel(event);
  const routine = inferRoutine(event);
  const gaze = inferGaze(event);
  const tags = event.后果标签.slice(0, 8);

  return {
    id: `p2_shame_${event.id}`,
    来源: source,
    地点: event.地点,
    子区域: '',
    相关NPC: event.涉及NPC,
    紧急度: urgentFor(shameLevel),
    风声文本: buildRumorText(event, shameLevel),
    故事钩子: `${routine}留下${gaze}，可承接为传唤、日课异动、公开凝视或支配事件。`,
    状态: '未读',
    凝视来源: gaze,
    羞名等级: shameLevel,
    羞名标签: tags,
    反噬日课: routine,
    是否可承接: true,
  };
}

export function appendP2ShameRumor<T extends { id?: string; 来源?: string; 状态?: string }>(current: T[], rumor: T): T[] {
  return insertEntryRumor(current, rumor);
}
