type PromptRole = 'system' | 'assistant' | 'user';
type PromptPosition = 'in_chat' | 'none';

export type WorldRuntimeInjectionPrompt = {
  id: string;
  position: PromptPosition;
  depth: number;
  role: PromptRole;
  content: string;
  should_scan?: boolean;
};

type SceneContext = {
  地点?: string;
  子区域?: string;
  公开度?: string;
  在场NPC?: string[];
  故事钩子?: string[];
};

type PendingAction = { 类型?: string };

export type WorldRuntimePromptData = {
  系统?: {
    阶段?: string;
    当前场景?: string;
    当前追查风声ID?: string;
    待处理交互?: PendingAction[];
    场景上下文?: SceneContext;
    时间状态?: { 最近事件类型?: string };
  };
};

export type WorldRuntimePromptResult = {
  visible: WorldRuntimeInjectionPrompt;
  scan: WorldRuntimeInjectionPrompt;
};

const PROMPT_ID_VISIBLE = 'hehuan-world-runtime-summary';
const PROMPT_ID_SCAN = 'hehuan-world-runtime-scan';
const EVENT_TYPES = ['移动', '探索', '移动与观察', '对话', '追查线索', '事务', '日课'];

function hasPendingAction(data: WorldRuntimePromptData): boolean {
  return (data.系统?.待处理交互 ?? []).length > 0;
}

function hasStoryHook(data: WorldRuntimePromptData): boolean {
  return (data.系统?.场景上下文?.故事钩子 ?? []).length > 0;
}

function hasRuntimeEventType(data: WorldRuntimePromptData): boolean {
  const eventType = data.系统?.时间状态?.最近事件类型 ?? '';
  return EVENT_TYPES.some(type => eventType.includes(type));
}

function shouldInject(data: WorldRuntimePromptData): boolean {
  if (hasPendingAction(data)) return false;
  if (data.系统?.阶段 === '牝奴期') return true;
  if (data.系统?.当前追查风声ID) return true;
  if (hasStoryHook(data)) return true;
  return hasRuntimeEventType(data);
}

export function buildWorldRuntimePrompt(data: WorldRuntimePromptData): WorldRuntimePromptResult | null {
  if (!shouldInject(data)) return null;

  const isP2 = data.系统?.阶段 === '牝奴期';
  const p2Line = isP2 ? '牝奴期若发生日课、支配、公开调教、羞名凝视或牝印命令，必须同步写牝奴.当前日课、牝奴.当前支配者、牝奴.当前命令、牝奴.今日调教次数、牝奴.最近调教结算，或用add /牝奴/调教记录/-追加牝奴.调教记录。牝奴期必须读取道具.装备.玩家判断已扣法器对日课、身体回响和羞名风声的影响；执事库发付不是商城购买，不要叙述灵石交易。' : '';
  const content = `世界运行账本：若本楼层发生移动、探索、观察、NPC口谕、事务承接、风声追查或P2日课，必须同步写系统.时间状态；场景变化写完整系统.场景上下文；并用add /剧情/事件记录/-追加剧情.事件记录，记录摘要、日、时辰、地点、涉及NPC、公开度和后果标签。${p2Line}`;
  const scanTokens = [
    '世界运行账本',
    '系统.时间状态',
    '系统.场景上下文',
    '剧情.事件记录',
    'add /剧情/事件记录/-',
    '移动',
    '探索',
    'NPC口谕',
    '事务承接',
    ...(isP2 ? ['P2日课', '牝奴.当前日课', '牝奴.当前支配者', '牝奴.当前命令', '牝奴.今日调教次数', '牝奴.最近调教结算', '调教记录', '牝奴.调教记录', '道具.装备.玩家', '法器匣', '执事库发付', '羞名风声'] : []),
  ];

  return {
    visible: {
      id: PROMPT_ID_VISIBLE,
      position: 'in_chat',
      depth: 0,
      role: 'system',
      content,
      should_scan: false,
    },
    scan: {
      id: PROMPT_ID_SCAN,
      position: 'none',
      depth: 0,
      role: 'system',
      content: Array.from(new Set(scanTokens)).join(' '),
      should_scan: true,
    },
  };
}
