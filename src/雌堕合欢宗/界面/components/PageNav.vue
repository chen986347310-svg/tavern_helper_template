<template>
  <div class="page-nav" :data-phase="phase">
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
        <path d="M8.5 5.4C9.4 4.2 10.6 3.6 12 3.6C13.4 3.6 14.6 4.2 15.5 5.4" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round"/>
        <path d="M7.1 8.2C8.2 7.2 9.8 6.7 12 6.7C14.2 6.7 15.8 7.2 16.9 8.2" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
        <path d="M6.8 8.5C5.7 10.3 5.2 12.2 5.2 14.1C5.2 18.4 8.8 20.9 12 20.9C15.2 20.9 18.8 18.4 18.8 14.1C18.8 12.2 18.3 10.3 17.2 8.5" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/>
        <path d="M7.6 10.1C9 10.9 10.4 11.2 12 11.2C13.6 11.2 15 10.9 16.4 10.1" fill="none" stroke="currentColor" stroke-width="0.85" opacity="0.45" stroke-linecap="round"/>
        <path d="M9 13.9C10.8 14.8 13.2 14.8 15 13.9" fill="none" stroke="currentColor" stroke-width="0.85" opacity="0.35" stroke-linecap="round"/>
        <path d="M8.8 6.8L6.7 5.6M15.2 6.8L17.3 5.6" stroke="currentColor" stroke-width="1" opacity="0.55" stroke-linecap="round"/>
        <circle cx="12" cy="8.5" r="0.75" fill="currentColor" opacity="0.65"/>
        <circle cx="10.2" cy="16.4" r="0.75" fill="currentColor" opacity="0.35"/>
        <path d="M13.4 15.5L15.1 16.2L14.4 17.9L12.8 17.1Z" fill="none" stroke="currentColor" stroke-width="0.75" opacity="0.45" stroke-linejoin="round"/>
      </svg>
      <svg v-else class="tab-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.8 4.2C6.8 3.1 7.6 2.4 8.7 2.4H17C18 2.4 18.7 3.1 18.7 4.1C18.7 5.2 18 5.9 17 5.9H8.7C7.6 5.9 6.8 5.2 6.8 4.2Z" fill="none" stroke="currentColor" stroke-width="1.15"/>
        <path d="M7.3 5.9V18.4C7.3 19.9 8.3 21 9.8 21H16.1C17.6 21 18.7 19.9 18.7 18.4V5.9" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>
        <path d="M5.3 6.6C6.2 7.4 7.4 7.8 8.8 7.8H17.8" fill="none" stroke="currentColor" stroke-width="0.95" opacity="0.35" stroke-linecap="round"/>
        <path d="M9.7 10.3C10.8 9.5 12.2 9.5 13.3 10.3C14.4 11.1 14.8 12.5 14.3 13.8C13.8 15 12.7 15.8 11.4 15.8C10.1 15.8 9 15 8.6 13.8" fill="none" stroke="currentColor" stroke-width="0.95" opacity="0.7" stroke-linecap="round"/>
        <path d="M11.4 9.5V15.8M8.4 12.7H14.5" stroke="currentColor" stroke-width="0.75" opacity="0.42" stroke-linecap="round"/>
        <path d="M10 17.8H15.8M10.9 19.2H14.8" stroke="currentColor" stroke-width="0.75" opacity="0.4" stroke-linecap="round"/>
        <path d="M18.7 18.3C18.7 19.3 19.4 19.9 20.2 19.9C21.1 19.9 21.7 19.3 21.7 18.4C21.7 17.5 21.1 16.9 20.2 16.9H18.7" fill="none" stroke="currentColor" stroke-width="1" opacity="0.55" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  currentTab: string;
  phase?: '攻略期' | '牝奴期' | string;
}>(), {
  phase: '攻略期',
});

defineEmits<{
  change: [tab: string];
}>();

const p1Tabs = [
  { key: 'home', label: '首页' },
  { key: 'shop', label: '商城' },
  { key: 'backpack', label: '背包' },
  { key: 'gallery', label: '图鉴' },
] as const;

const p2Tabs = [
  { key: 'home', label: '牝印' },
  { key: 'shop', label: '执事库' },
  { key: 'backpack', label: '法器匣' },
  { key: 'gallery', label: '烙名录' },
] as const;

const tabs = computed(() => (props.phase === '牝奴期' ? p2Tabs : p1Tabs));
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
  position: relative;
}

.page-nav[data-phase='牝奴期'] {
  background:
    radial-gradient(ellipse at 50% 100%, rgba(200, 75, 91, 0.16), transparent 64%),
    linear-gradient(180deg, transparent 0%, rgba(255, 253, 249, 0.36) 34%, rgba(234, 168, 155, 0.14) 100%);
}

.page-nav[data-phase='牝奴期']::before {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  top: 2px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(163, 131, 83, 0.35), transparent);
  pointer-events: none;
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

.page-nav[data-phase='牝奴期'] .nav-tab {
  padding: 4px 11px;

  .tab-icon {
    color: rgba(90, 66, 58, 0.58);
    filter: drop-shadow(0 0 4px rgba(200, 75, 91, 0.08));
  }

  &.active {
    background:
      radial-gradient(ellipse at 50% 80%, rgba(200, 75, 91, 0.18), transparent 70%),
      linear-gradient(180deg, rgba(255, 253, 249, 0.18), transparent);
    box-shadow:
      inset 0 0 0 1px rgba(200, 75, 91, 0.14),
      inset 0 0 14px rgba(200, 75, 91, 0.08);

    .tab-icon {
      color: #c84b5b;
      filter: drop-shadow(0 0 7px rgba(200, 75, 91, 0.28));
    }

    &::after {
      background: linear-gradient(90deg, transparent, #c84b5b, rgba(163, 131, 83, 0.72), transparent);
    }
  }

  &:hover:not(.active) .tab-icon {
    color: #a38353;
  }
}
</style>
