import { ref } from 'vue';
import { useDataStore } from '../store';

const NPC_LIST = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
type NpcName = (typeof NPC_LIST)[number];

/** 模块级共享状态 — 所有 useDebug() 调用方共享同一个 visible */
const visible = ref(false);
let initialized = false;

/**
 * 调试面板 composable (单例)
 * Ctrl+Shift+D 切换显示/隐藏
 */
export function useDebug() {
  const store = useDataStore();

  function toggle() {
    visible.value = !visible.value;
  }

  function initShortcut() {
    if (initialized) return;
    initialized = true;
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggle();
      }
    });
  }

  /** 一键全攻略完成 */
  function completeAll() {
    for (const npc of NPC_LIST) {
      store.data.NPC[npc].状态 = '已完成';
      store.data.NPC[npc].好感度 = 100;
      store.data.NPC[npc].攻略值 = 100;
    }
  }

  /** 一键重置 */
  function resetAll() {
    for (const npc of NPC_LIST) {
      store.data.NPC[npc].状态 = '未开始';
      store.data.NPC[npc].好感度 = 0;
      store.data.NPC[npc].攻略值 = 0;
      store.data.NPC[npc].粘滞计数 = 0;
    }
    store.data.系统.阶段 = '攻略期';
    store.data.系统.剩余天数 = 30;
    store.data.系统.灵石 = 0;
    store.data.牝奴.堕落度 = 0;
    store.data.牝奴.牝阴决层数 = 0;
  }

  return { visible, toggle, initShortcut, completeAll, resetAll };
}

/**
 * 测试辅助：重置模块级状态
 * 仅在测试环境中使用
 */
export function __resetDebugState() {
  visible.value = false;
  initialized = false;
}
