<template>
  <div class="page-nav">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      :class="['nav-tab', { active: currentTab === tab.key }]"
      :aria-label="tab.label"
      :title="tab.label"
      @click="$emit('change', tab.key)"
    >
      <svg v-if="tab.key === 'home'" class="tab-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10l8-6 8 6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 10v9h12v-9" fill="none" stroke="currentColor" stroke-width="1.3"/>
        <path d="M2 10.5h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M10 19v3h4v-3" fill="none" stroke="currentColor" stroke-width="1.2"/>
        <rect x="9.5" y="13" width="5" height="4" rx="0.5" fill="none" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      </svg>
      <svg v-else-if="tab.key === 'shop'" class="tab-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <rect x="9" y="9" width="6" height="6" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.3"/>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" stroke-width="1" opacity="0.4" stroke-linecap="round"/>
      </svg>
      <svg v-else-if="tab.key === 'backpack'" class="tab-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 7C9 7 8.5 5.5 10 5C11.5 4.5 11.5 6 11 7" fill="none" stroke="currentColor" stroke-width="0.9" stroke-linecap="round"/>
        <path d="M15 7C15 7 15.5 5.5 14 5C12.5 4.5 12.5 6 13 7" fill="none" stroke="currentColor" stroke-width="0.9" stroke-linecap="round"/>
        <ellipse cx="12" cy="8" rx="5" ry="1.2" fill="none" stroke="currentColor" stroke-width="1.2"/>
        <path d="M7 8C5.5 9.5 5 12 5 14.5C5 18.5 12 21 12 21C12 21 19 18.5 19 14.5C19 12 18.5 9.5 17 8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M8 10C9 11 10.5 11.5 12 11.5C13.5 11.5 15 11 16 10" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
        <path d="M9 13C10 13.8 11 14 12 14C13 14 14 13.8 15 13" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
        <circle cx="12" cy="8" r="0.8" fill="currentColor" opacity="0.5"/>
      </svg>
      <svg v-else class="tab-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 2C7 2 5.5 2 5.5 3.5C5.5 5 7 5 7 5H17C17 5 18.5 5 18.5 3.5C18.5 2 17 2 17 2" fill="none" stroke="currentColor" stroke-width="1.2"/>
        <path d="M7 5v15" stroke="currentColor" stroke-width="1.3"/>
        <path d="M17 5v15" stroke="currentColor" stroke-width="1.3"/>
        <path d="M7 20C7 20 5.5 20 5.5 21.5C5.5 23 7 23 7 23H17C17 23 18.5 23 18.5 21.5C18.5 20 17 20 17 20" fill="none" stroke="currentColor" stroke-width="1.2"/>
        <path d="M7 5H17V8H7Z" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
        <path d="M9 9.5h6M9 12h6M9 14.5h5M9 17h4" stroke="currentColor" stroke-width="0.8" opacity="0.4" stroke-linecap="round"/>
        <path d="M7 8H17" stroke="currentColor" stroke-width="0.6" opacity="0.2"/>
      </svg>
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
  { key: 'home', label: '首页' },
  { key: 'shop', label: '商城' },
  { key: 'backpack', label: '背包' },
  { key: 'gallery', label: '图鉴' },
];
</script>
<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.page-nav {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 6px 8px 8px;
  flex-shrink: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 30%);
  border-top: none;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 12px;
  background: none;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;

  .tab-icon {
    width: 22px;
    height: 22px;
    color: var(--hh-text-secondary);
    transition: all 0.25s ease;
  }



  &.active {
    border-color: transparent;
    background: radial-gradient(ellipse at 50% 80%, var(--hh-glow-color) 0%, transparent 70%);
    box-shadow:
      0 0 12px var(--hh-gold-glow),
      inset 0 0 8px var(--hh-gold-glow);

    .tab-icon {
      color: $册缘鎏金;
      filter: drop-shadow(0 0 6px var(--hh-gold-glow));
    }



    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 2px;
      background: linear-gradient(90deg, transparent, $册缘鎏金, transparent);
      border-radius: 1px;
    }
  }

  &:hover:not(.active) {
    .tab-icon {
      color: var(--hh-gold);
    }


  }
}
</style>
