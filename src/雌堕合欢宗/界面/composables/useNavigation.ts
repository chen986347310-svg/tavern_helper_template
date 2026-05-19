import { ref } from "vue";

/**
 * 导航 composable
 * 从 App.vue 抽取导航逻辑, 为将来 vue-router 迁移预留接口
 */
export function useNavigation(initialTab = "home") {
  const currentTab = ref<string>(initialTab);

  function navigateTo(tab: string) {
    currentTab.value = tab;
  }

  return { currentTab, navigateTo };
}
