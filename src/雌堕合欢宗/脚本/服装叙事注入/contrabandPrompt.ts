import { NSFW道具 } from '../../界面/data/items';
import { getContrabandBodyPart, getContrabandTier, getItemDisplayName, getItemShortHint } from '../../界面/data/itemDisplay';

type PromptRole = 'system' | 'assistant' | 'user';
type PromptPosition = 'in_chat' | 'none';

export type ContrabandInjectionPrompt = {
  id: string;
  position: PromptPosition;
  depth: number;
  role: PromptRole;
  content: string;
  should_scan?: boolean;
};

type SceneContext = {
  在场NPC?: string[];
  公开度?: string;
};

type PendingAction = {
  类型?: string;
  目标?: string;
  道具?: string;
};

export type ContrabandPromptData = {
  系统?: {
    场景上下文?: SceneContext;
    待处理交互?: PendingAction[];
  };
  道具?: {
    装备?: Record<string, string[]>;
  };
};

export type ContrabandPromptResult = {
  visible: ContrabandInjectionPrompt;
  scan: ContrabandInjectionPrompt;
};

const PROMPT_ID_VISIBLE = 'hehuan-current-contraband-summary';
const PROMPT_ID_SCAN = 'hehuan-current-contraband-scan';
const contrabandNames = new Set(NSFW道具.map(item => item.名称));

function uniq(items: string[]): string[] {
  return Array.from(new Set(items.filter(Boolean)));
}

function isContraband(item: string): boolean {
  return contrabandNames.has(item);
}

function formatEquippedLine(target: string, items: string[]): string {
  const names = items
    .map(item => `${getItemDisplayName(item)}（${item}，${getContrabandTier(item)}/${getContrabandBodyPart(item)}）`)
    .join('、');
  const hints = items
    .map(item => getItemShortHint(item))
    .filter(Boolean)
    .join('；');
  return hints ? `${target}：${names}。${hints}` : `${target}：${names}。`;
}

export function buildContrabandPrompt(data: ContrabandPromptData): ContrabandPromptResult | null {
  const equipment = data.道具?.装备 ?? {};
  const presentNpcs = data.系统?.场景上下文?.在场NPC ?? [];
  const targets = uniq(['玩家', ...presentNpcs]);
  const entries = targets
    .map(target => ({ target, items: (equipment[target] ?? []).filter(isContraband) }))
    .filter(entry => entry.items.length > 0);

  if (entries.length === 0) return null;

  const lines = entries.map(entry => formatEquippedLine(entry.target, entry.items));
  const equippedItems = targets.flatMap(target => (equipment[target] ?? []).filter(isContraband));
  const actionItems = (data.系统?.待处理交互 ?? [])
    .filter(action => ['装备道具', '卸下'].includes(action.类型 ?? ''))
    .map(action => action.道具 ?? '')
    .filter(isContraband);
  const scanNames = uniq([...equippedItems, ...actionItems]);
  const scanTokens = uniq([
    '禁器叙事规则',
    '禁器',
    '器阶',
    '作用部位',
    '道具.装备',
    ...(data.系统?.待处理交互 ?? [])
      .map(action => action.类型 ?? '')
      .filter(type => ['装备道具', '卸下'].includes(type)),
    ...scanNames,
    ...scanNames.map(getItemDisplayName),
    ...scanNames.map(getContrabandTier),
    ...scanNames.map(getContrabandBodyPart),
  ]);

  return {
    visible: {
      id: PROMPT_ID_VISIBLE,
      position: 'in_chat',
      depth: 0,
      role: 'system',
      content: `当前禁器锚点：${lines.join(' ')}按场景公开度写声音、姿态、衣料痕迹、器官触发和被看见的羞耻；不要每回合机械复述，不直接改变量。`,
      should_scan: false,
    },
    scan: {
      id: PROMPT_ID_SCAN,
      position: 'none',
      depth: 0,
      role: 'system',
      content: scanTokens.join(' '),
      should_scan: true,
    },
  };
}
