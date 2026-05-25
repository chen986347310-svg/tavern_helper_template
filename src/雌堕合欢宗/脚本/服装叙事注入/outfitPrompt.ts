import { getItemDisplayName, getItemShortHint } from '../../界面/data/itemDisplay';

type PromptRole = 'system' | 'assistant' | 'user';
type PromptPosition = 'in_chat' | 'none';

export type OutfitInjectionPrompt = {
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

export type OutfitPromptData = {
  系统?: {
    场景上下文?: SceneContext;
    待处理交互?: PendingAction[];
  };
  道具?: {
    装备?: Record<string, string[]>;
  };
};

export type OutfitPromptResult = {
  visible: OutfitInjectionPrompt;
  scan: OutfitInjectionPrompt;
};

const PROMPT_ID_VISIBLE = 'hehuan-current-outfit-summary';
const PROMPT_ID_SCAN = 'hehuan-current-outfit-scan';

function uniq(items: string[]): string[] {
  return Array.from(new Set(items.filter(Boolean)));
}

function formatEquippedLine(target: string, items: string[]): string {
  const names = items.map(item => `${getItemDisplayName(item)}（${item}）`).join('、');
  const hints = items
    .map(item => getItemShortHint(item))
    .filter(Boolean)
    .join('；');
  return hints ? `${target}：${names}。${hints}` : `${target}：${names}。`;
}

export function buildOutfitPrompt(data: OutfitPromptData): OutfitPromptResult | null {
  const equipment = data.道具?.装备 ?? {};
  const presentNpcs = data.系统?.场景上下文?.在场NPC ?? [];
  const targets = uniq(['玩家', ...presentNpcs]);
  const lines = targets
    .map(target => ({ target, items: equipment[target] ?? [] }))
    .filter(entry => entry.items.length > 0)
    .map(entry => formatEquippedLine(entry.target, entry.items));

  if (lines.length === 0) return null;

  const equippedItems = targets.flatMap(target => equipment[target] ?? []);
  const actionItems = (data.系统?.待处理交互 ?? [])
    .filter(action => ['装备道具', '卸下'].includes(action.类型 ?? ''))
    .map(action => action.道具 ?? '');
  const scanNames = uniq([...equippedItems, ...actionItems]);
  const scanTokens = uniq([
    '服装叙事规则',
    '道具.装备',
    ...(data.系统?.待处理交互 ?? [])
      .map(action => action.类型 ?? '')
      .filter(type => ['装备道具', '卸下'].includes(type)),
    ...scanNames,
    ...scanNames.map(getItemDisplayName),
  ]);

  return {
    visible: {
      id: PROMPT_ID_VISIBLE,
      position: 'in_chat',
      depth: 0,
      role: 'system',
      content: `当前服装锚点：${lines.join(' ')}只在入场、动作、被注视、心绪波动、公开度变化或新装备/卸下后自然带出；不要每回合机械复述，不直接改变量。`,
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
