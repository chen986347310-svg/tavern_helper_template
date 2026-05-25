import { useDataStore } from '../store';
import { getContrabandBodyPart, getContrabandTier, getItemDisplayName, getItemShortHint, getPillCategory, getPillEffectLine, getStoryLine, getStoryNpc, getStoryTheme } from '../data/itemDisplay';
import { createNarrativeEntryForPurchase } from '../data/narrativeEntry';

type PendingActionType = '装备' | '卸下' | '购买' | '灵识窃取' | '装备道具' | '购买物品' | '使用物品' | '追查风声' | '领受法器';
type TimeName = '晨时' | '午时' | '酉时' | '亥时';
type SceneName = string;

type RumorPayload = {
  id: string;
  地点: string;
  子区域?: string;
  相关NPC?: readonly string[];
  故事钩子?: string;
};

type PendingAction = {
  类型: PendingActionType;
  目标: string;
  道具: string;
  数量: number;
  时辰: TimeName;
  场景: SceneName;
  地点?: string;
  子区域?: string;
  风声ID?: string;
  故事钩子?: string;
  在场NPC?: string[];
  道具显示名?: string;
  器阶?: string;
  作用部位?: string;
  丹药分类?: string;
  作用线?: string;
  剧情线?: string;
  关联NPC?: string;
  秘密主题?: string;
  入口类型?: '剧情钥匙' | '场景令牌' | '特殊事件';
  线索ID?: string;
  AI短提示?: string;
};

type PendingActionInput = Omit<PendingAction, '时辰' | '场景'> & Partial<Pick<PendingAction, '时辰' | '场景'>>;

export function usePendingAction() {
  const store = useDataStore();

  function getItemNarrativeMeta(道具: string): Partial<PendingAction> {
    if (!道具) return {};
    const 道具显示名 = getItemDisplayName(道具);
    const 器阶 = getContrabandTier(道具);
    const 作用部位 = getContrabandBodyPart(道具);
    const 丹药分类 = getPillCategory(道具);
    const 作用线 = getPillEffectLine(道具);
    const 剧情线 = getStoryLine(道具);
    const 关联NPC = getStoryNpc(道具);
    const 秘密主题 = getStoryTheme(道具);
    const AI短提示 = getItemShortHint(道具);
    const entry = createNarrativeEntryForPurchase(道具);
    const entryMeta = entry ? { 入口类型: entry.status.类型, 线索ID: entry.status.风声ID } : {};
    if (道具显示名 === 道具 && !器阶 && !作用部位 && !丹药分类 && !作用线 && !剧情线 && !关联NPC && !秘密主题 && !AI短提示 && !entry) return {};
    return Object.fromEntries(
      Object.entries({ 道具显示名: 道具显示名 === 道具 ? '' : 道具显示名, 器阶, 作用部位, 丹药分类, 作用线, 剧情线, 关联NPC, 秘密主题, ...entryMeta, AI短提示 }).filter(([, value]) => value),
    ) as Partial<PendingAction>;
  }
  
  function 记录交互(payload: PendingActionInput) {
    store.data.系统.待处理交互 ??= [];
    store.data.系统.待处理交互.push({
      ...payload,
      时辰: payload.时辰 ?? store.data.系统.时辰 ?? '晨时',
      场景: payload.场景 ?? store.data.系统.当前场景 ?? '莲灯前苑',
    });
  }

  function 记录购买物品(道具: string, 数量 = 1) {
    记录交互({ 类型: '购买物品', 目标: '玩家', 道具, 数量, ...getItemNarrativeMeta(道具) });
  }

  function 记录领受法器(道具: string, 数量 = 1) {
    记录交互({ 类型: '领受法器', 目标: '玩家', 道具, 道具显示名: getItemDisplayName(道具), 数量, ...getItemNarrativeMeta(道具) });
  }

  function 记录装备道具(道具: string, 目标: string, 数量 = 1) {
    记录交互({ 类型: '装备道具', 目标, 道具, 数量, ...getItemNarrativeMeta(道具) });
  }

  function 记录卸下道具(道具: string, 目标: string, 数量 = 1) {
    记录交互({ 类型: '卸下', 目标, 道具, 数量, ...getItemNarrativeMeta(道具) });
  }

  function 记录使用物品(道具: string, 目标 = '玩家', 数量 = 1) {
    记录交互({ 类型: '使用物品', 目标, 道具, 数量, ...getItemNarrativeMeta(道具) });
  }

  function 记录灵识窃取(目标: string) {
    记录交互({ 类型: '灵识窃取', 目标, 道具: '', 数量: 1 });
  }

  function 记录追查风声(rumor: RumorPayload) {
    记录交互({
      类型: '追查风声',
      目标: rumor.相关NPC?.[0] ?? '世界',
      道具: '',
      数量: 1,
      地点: rumor.地点,
      子区域: rumor.子区域 ?? '',
      风声ID: rumor.id,
      故事钩子: rumor.故事钩子 ?? '',
      在场NPC: [...(store.data.系统.场景上下文?.在场NPC ?? [])],
    });
  }

  return { 记录交互, 记录购买物品, 记录领受法器, 记录装备道具, 记录卸下道具, 记录使用物品, 记录灵识窃取, 记录追查风声 };
}
