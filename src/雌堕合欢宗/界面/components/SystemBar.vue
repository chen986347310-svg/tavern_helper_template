<template>
  <div
    class="system-bar"
    role="toolbar"
    :aria-label="mode === '攻略期' ? '攻略进度状态栏' : '牝奴堕落状态栏'"
  >
    <!-- 攻略期模式 -->
    <div v-if="mode === '攻略期'" class="bar-left" role="group" aria-label="弟子攻略状态">
      <div
        v-for="npc in npcList"
        :key="npc"
        :class="['taiji-icon', npcStates[npc]?.状态 === '已完成' ? 'taiji--conquered' : 'taiji--unconquered']"
        role="img"
        :aria-label="npc + (npcStates[npc]?.状态 === '已完成' ? ' 已攻略' : ' 未攻略')"
      >
        <svg class="taiji-svg" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
          <path d="M20 2 A18 18 0 0 1 20 38 A9 9 0 0 1 20 20 A9 9 0 0 0 20 2" fill="currentColor" opacity="0.7"/>
          <path d="M20 38 A18 18 0 0 1 20 2 A9 9 0 0 1 20 20 A9 9 0 0 0 20 38" fill="currentColor" opacity="0.35"/>
          <circle cx="20" cy="11" r="2.5" fill="currentColor" opacity="0.5"/>
          <circle cx="20" cy="29" r="2.5" fill="currentColor" opacity="0.8"/>
        </svg>
        <span class="taiji-name">{{ npc }}</span>
      </div>
    </div>

    <!-- 牝奴期模式 -->
    <div v-else class="bar-left bar-left--blossom">
      <div
        class="blossom-ring-wrapper"
        role="progressbar"
        :aria-valuenow="堕落度"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="'堕落度 ' + 堕落度 + '%'"
      >
        <svg class="blossom-ring-svg" viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(180,150,100,0.12)" stroke-width="5"/>
          <circle
            cx="40" cy="40" r="34"
            fill="none"
            :stroke="blossomColor"
            stroke-width="5"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            transform="rotate(-90 40 40)"
            class="blossom-progress"
          />
        </svg>
        <svg
          v-for="i in 5"
          :key="i"
          class="blossom-petal"
          :class="{ lit: i <= litPetals }"
          :style="petalStyle(i)"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M8 1C8 1 12 5 12 8C12 11 10 14 8 15C6 14 4 11 4 8C4 5 8 1 8 1Z" fill="currentColor"/>
        </svg>
        <span class="blossom-value">{{ 堕落度 }}%</span>
      </div>
    </div>

    <!-- 右侧数值 -->
    <div class="bar-stats" role="group" aria-label="资源数值">
      <template v-if="mode === '攻略期'">
        <div class="stat-item">
          <span class="stat-label">余日</span>
          <span class="stat-value" :aria-label="'剩余 ' + (remainingDays ?? 0) + ' 天'">{{ remainingDays ?? 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">灵石</span>
          <span class="stat-value" :aria-label="(gems ?? 0) + ' 灵石'">{{ gems ?? 0 }}</span>
        </div>
      </template>
      <template v-else>
        <div class="stat-item">
          <span class="stat-label">牝阴决</span>
          <span class="stat-value" :aria-label="'牝阴决 ' + (牝阴决层数 ?? 0) + ' 层'">{{ 牝阴决层数 ?? 0 }}/9</span>
        </div>
      </template>
    </div>

    <!-- 日/夜切换 -->
    <button class="theme-toggle" @click="toggleTheme" :aria-label="theme === 'dark' ? '切换白昼模式' : '切换暗夜模式'">
      <svg v-if="theme === 'dark'" class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="5" fill="currentColor"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <svg v-else class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
type NpcName = '白芷' | '苏芸' | '纪兰' | '沈月秋' | '柳素衣';

type SystemBarProps =
  | { mode: '攻略期'; npcList: NpcName[]; npcStates: Record<NpcName, { 状态: string }>; remainingDays?: number; gems?: number; 牝阴决层数?: number; 堕落度?: number }
  | { mode: '牝奴期'; 堕落度: number; 牝阴决层数?: number; npcList?: NpcName[]; npcStates?: Record<NpcName, { 状态: string }>; remainingDays?: number; gems?: number };

const props = defineProps<SystemBarProps>();

const circumference = 2 * Math.PI * 34;

const dashOffset = computed(() => {
  if (props.mode !== '牝奴期') return circumference;
  return circumference * (1 - (props.堕落度 ?? 0) / 100);
});

const blossomColor = computed(() => {
  const v = props.mode === '牝奴期' ? (props.堕落度 ?? 0) : 0;
  if (v < 30) return 'rgba(180,150,100,0.4)';
  if (v < 70) return '#f0a0b0';
  return '#e85070';
});

const litPetals = computed(() => {
  if (props.mode !== '牝奴期') return 0;
  return Math.floor((props.堕落度 ?? 0) / 20);
});

function petalStyle(index: number) {
  const angle = (index - 1) * 72 - 90;
  const rad = (angle * Math.PI) / 180;
  const radius = 30;
  const x = 50 + radius * Math.cos(rad);
  const y = 50 + radius * Math.sin(rad);
  return {
    left: x + '%',
    top: y + '%',
    transform: 'translate(-50%, -50%)',
  };
}

import { computed } from 'vue';
import { useTheme } from '../composables/useTheme';
const { theme, toggleTheme } = useTheme();
</script>
<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.system-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 10px;
  margin-bottom: 8px;
  @include gold-foil;
  background: var(--theme-bg-secondary);
  border-color: var(--theme-border);
  border-radius: $radius-md;
}

/* ── 左侧区域 ── */
.bar-left {
  display: flex;
  gap: 6px;
  flex: 1;
  justify-content: center;
  align-items: center;
}

/* ── 攻略期太极图标 ── */
.taiji-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 38px;
  min-height: 38px;
  padding: 4px 2px;
  justify-content: center;

  .taiji-svg {
    width: 24px;
    height: 24px;
    transition: all 0.4s ease;
  }

  .taiji-name {
    font-family: $font-铭文;
    font-size: 9px;
    color: rgba(180, 150, 100, 0.4);
    letter-spacing: 0.05em;
    line-height: 1;
  }

  &.taiji--unconquered .taiji-svg {
    color: $taiji-未攻略色;
    filter: drop-shadow(0 0 4px rgba(74, 122, 155, 0.4));
    animation: taiji-breathe 3s ease-in-out infinite;
  }

  &.taiji--conquered .taiji-svg {
    color: $taiji-已攻略色;
    filter: drop-shadow(0 0 6px rgba(212, 96, 138, 0.5));
    animation: taiji-breathe 3s ease-in-out infinite;
  }
}

@keyframes taiji-breathe {
  0%, 100% { filter: drop-shadow(0 0 3px currentColor); opacity: 0.8; }
  50% { filter: drop-shadow(0 0 8px currentColor); opacity: 1; }
}

/* ── 牝奴期樱花圆环 ── */
.bar-left--blossom {
  justify-content: center;
}

.blossom-ring-wrapper {
  position: relative;
  width: 64px;
  height: 64px;
  flex-shrink: 0;

  .blossom-ring-svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .blossom-progress {
    transition: stroke-dashoffset 0.5s ease;
  }
}

.blossom-petal {
  position: absolute;
  width: 14px;
  height: 14px;
  color: $blossom-未亮;
  transition: all 0.4s ease;

  &.lit {
    color: $blossom-亮色;
    filter: drop-shadow(0 0 6px rgba(240, 160, 176, 0.6));
  }
}

.blossom-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-铭文;
  font-size: 13px;
  font-weight: 700;
  color: $铭文赤金;
  @include inscription-engrave;
}

/* ── 右侧数值 ── */
.bar-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;

  .stat-item {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .stat-label {
    font-size: 9px;
    color: rgba(180, 150, 100, 0.4);
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-family: $font-铭文;
    font-size: 12px;
    font-weight: 700;
    color: var(--theme-gold);
  }
}


/* ── 日/夜切换按钮 ── */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--theme-border);
  border-radius: 50%;
  background: var(--theme-bg-secondary);
  color: var(--theme-gold);
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-left: 8px;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 8px var(--theme-accent-glow);

  &:hover {
    background: var(--theme-accent-glow);
    color: var(--theme-accent);
    box-shadow: 0 0 12px var(--theme-border);
  }

  .theme-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
