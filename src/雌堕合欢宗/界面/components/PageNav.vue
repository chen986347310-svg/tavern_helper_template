<template>
  <div class="page-nav">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      :class="['nav-tab', { active: currentTab === tab.key }]"
      @click="$emit('change', tab.key)"
    >
      <span class="tab-glyph">{{ tab.glyph }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentTab: string;
}>();

defineEmits<{
  change: [tab: string];
}>();

const tabs = [
  { key: 'home', glyph: '阁', label: '首页' },
  { key: 'shop', glyph: '坊', label: '商城' },
  { key: 'backpack', glyph: '囊', label: '背包' },
  { key: 'gallery', glyph: '鉴', label: '图鉴' },
];
</script>

<style lang="scss" scoped>
/* ═══════════════════════════════════
   玉牌标签栏
   ═══════════════════════════════════ */

.page-nav {
  display: flex;
  justify-content: space-around;
  padding: 6px 8px 8px;
  flex-shrink: 0;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%);
  border-top: 1px solid rgba(212, 160, 23, 0.15);
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 12px;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;

  .tab-glyph {
    font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
    font-size: 18px;
    color: rgba(180, 150, 100, 0.5);
    transition: all 0.25s ease;
    line-height: 1;
  }

  .tab-label {
    font-size: 10px;
    color: rgba(180, 150, 100, 0.4);
    letter-spacing: 0.05em;
    transition: all 0.25s ease;
  }

  /* 激活态：玉牌发光 */
  &.active {
    border-color: rgba(212, 160, 23, 0.3);
    background:
      linear-gradient(180deg, rgba(212, 160, 23, 0.08) 0%, rgba(212, 160, 23, 0.02) 100%);
    box-shadow:
      0 0 12px rgba(212, 160, 23, 0.1),
      inset 0 0 8px rgba(212, 160, 23, 0.05);

    .tab-glyph {
      color: #d4a017;
      text-shadow: 0 0 8px rgba(212, 160, 23, 0.4);
    }

    .tab-label {
      color: rgba(212, 160, 23, 0.8);
    }

    /* 底部指示线 */
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #d4a017, transparent);
      border-radius: 1px;
    }
  }

  &:hover:not(.active) {
    .tab-glyph {
      color: rgba(212, 160, 23, 0.7);
    }

    .tab-label {
      color: rgba(212, 160, 23, 0.6);
    }
  }
}
</style>
