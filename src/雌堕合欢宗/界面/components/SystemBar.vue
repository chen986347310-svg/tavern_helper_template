<template>
  <div class="system-bar">
    <!-- 攻略期模式 -->
    <template v-if="mode === '攻略期'">
      <div class="taiji-row">
        <div
          v-for="npc in npcList"
          :key="npc"
          :class="['taiji-icon', npcStates[npc]?.状态 === '已完成' ? 'taiji--conquered' : 'taiji--unconquered']"
          :title="npc"
        >
          <span class="taiji-glyph">☯</span>
          <span class="taiji-name">{{ npc }}</span>
        </div>
      </div>
    </template>

    <!-- 牝奴期模式 -->
    <template v-else>
      <div class="blossom-ring-wrapper">
        <div class="blossom-ring-track" :style="{ '--ring-angle': ringAngle + 'deg' }"></div>
        <div class="blossom-petals">
          <span
            v-for="i in 5"
            :key="i"
            :class="['blossom-petal', { lit: i <= litPetals }]"
            :style="petalStyle(i)"
          >✿</span>
        </div>
        <span class="blossom-value">{{ 堕落度 }}%</span>
      </div>
    </template>

    <!-- 右侧数值 -->
    <div class="bar-stats">
      <template v-if="mode === '攻略期'">
        <div class="stat-item">
          <span class="stat-label">余日</span>
          <span class="stat-value">{{ remainingDays }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">灵石</span>
          <span class="stat-value">{{ gems }}</span>
        </div>
      </template>
      <template v-else>
        <div class="stat-item">
          <span class="stat-label">牝阴决</span>
          <span class="stat-value">{{ 牝阴决层数 }}/9</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
type NpcName = '白芷' | '苏芸' | '纪兰' | '沈月秋' | '柳素衣';

type SystemBarProps =
  | { mode: '攻略期'; npcList: NpcName[]; npcStates: Record<NpcName, { 状态: string }>; remainingDays?: number; gems?: number; 牝阴决层数?: number; 堕落度?: number }
  | { mode: '牝奴期'; 堕落度: number; 牝阴决层数?: number; npcList?: NpcName[]; npcStates?: Record<NpcName, { 状态: string }>; remainingDays?: number; gems?: number };

const props = defineProps<SystemBarProps>();

const ringAngle = computed(() => {
  if (props.mode === '牝奴期') return (props.堕落度 ?? 0) * 3.6;
  return 0;
});

const litPetals = computed(() => {
  if (props.mode !== '牝奴期') return 0;
  return Math.floor((props.堕落度 ?? 0) / 20);
});

function petalStyle(index: number) {
  const angle = (index - 1) * 72 - 90;
  const rad = (angle * Math.PI) / 180;
  const radius = 38;
  const x = 50 + radius * Math.cos(rad);
  const y = 50 + radius * Math.sin(rad);
  return {
    left: x + '%',
    top: y + '%',
    transform: 'translate(-50%, -50%)',
  };
}

import { computed } from 'vue';</script>
<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.system-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  margin-bottom: 16px;
  @include gold-foil;
  border-radius: $radius-md;
}

/* 攻略期太极图标行 */
.taiji-row {
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.taiji-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  .taiji-glyph {
    font-size: $taiji-尺寸;
    line-height: 1;
    transition: all 0.4s ease;
  }

  .taiji-name {
    font-family: $font-铭文;
    font-size: 9px;
    color: rgba(180, 150, 100, 0.4);
    letter-spacing: 0.05em;
  }

  &.taiji--unconquered .taiji-glyph {
    @include taiji-glow($taiji-未攻略色);
  }

  &.taiji--conquered .taiji-glyph {
    @include taiji-glow($taiji-已攻略色);
  }
}

/* 牝奴期樱花圆环 */
.blossom-ring-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  flex-shrink: 0;

  @include blossom-ring;

  .blossom-ring-track {
    position: absolute;
    inset: 0;
  }
}

.blossom-petals {
  position: absolute;
  inset: 0;
}

.blossom-petal {
  position: absolute;
  font-size: 14px;
  color: -未亮;
  transition: all 0.4s ease;

  &.lit {
    color: -亮色;
    text-shadow: 0 0 8px rgba(240, 160, 176, 0.6);
  }
}

.blossom-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-铭文;
  font-size: 14px;
  font-weight: 700;
  color: $铭文赤金;
  @include inscription-engrave;
}

/* 右侧数值 */
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
    font-size: 10px;
    color: rgba(180, 150, 100, 0.4);
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-family: $font-铭文;
    font-size: 13px;
    font-weight: 700;
    color: rgba(212, 160, 23, 0.8);
  }
}
</style>