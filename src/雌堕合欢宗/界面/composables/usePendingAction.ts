import { useDataStore } from '../store';

type PendingActionType = '装备' | '卸下' | '购买' | '灵识窃取' | '装备道具' | '购买物品' | '使用物品';
type TimeName = '晨时' | '午时' | '酉时' | '亥时';
type SceneName = '莲灯前苑' | '醉玉小筑' | '绮梦幽阁';

type PendingAction = {
  类型: PendingActionType;
  目标: string;
  道具: string;
  数量: number;
  时辰: TimeName;
  场景: SceneName;
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

  return { 记录交互, 记录购买物品, 记录装备道具, 记录卸下道具, 记录使用物品, 记录灵识窃取 };
}