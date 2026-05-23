import { useDataStore } from '../store';

type PendingActionType = '装备' | '卸下' | '购买' | '灵识窃取' | '装备道具' | '购买物品' | '使用物品' | '追查风声';
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
};

type PendingActionInput = Omit<PendingAction, '时辰' | '场景'> & Partial<Pick<PendingAction, '时辰' | '场景'>>;

export function usePendingAction() {
  const store = useDataStore();
  
  function 记录交互(payload: PendingActionInput) {
    store.data.系统.待处理交互 ??= [];
    store.data.系统.待处理交互.push({
      ...payload,
      时辰: payload.时辰 ?? store.data.系统.时辰 ?? '晨时',
      场景: payload.场景 ?? store.data.系统.当前场景 ?? '莲灯前苑',
    });
  }

  function 记录购买物品(道具: string, 数量 = 1) {
    记录交互({ 类型: '购买物品', 目标: '玩家', 道具, 数量 });
  }

  function 记录装备道具(道具: string, 目标: string, 数量 = 1) {
    记录交互({ 类型: '装备道具', 目标, 道具, 数量 });
  }

  function 记录卸下道具(道具: string, 目标: string, 数量 = 1) {
    记录交互({ 类型: '卸下', 目标, 道具, 数量 });
  }

  function 记录使用物品(道具: string, 目标 = '玩家', 数量 = 1) {
    记录交互({ 类型: '使用物品', 目标, 道具, 数量 });
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

  return { 记录交互, 记录购买物品, 记录装备道具, 记录卸下道具, 记录使用物品, 记录灵识窃取, 记录追查风声 };
}
