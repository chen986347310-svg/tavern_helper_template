<template>
  <div class="phase2-page">
    <!-- 牝奴期状态栏 -->
    <!-- 淫纹视觉 -->
    <div class="yinwen-section" v-if="data.牝奴.堕落度 >= 50">
      <div class="yinwen-marks">
        <span
          v-for="i in yinwenCount"
          :key="i"
          class="yinwen-mark"
          :style="{ color: yinwenColor, animationDelay: i * 0.2 + 's' }"
        >纹</span>
      </div>
      <div class="yinwen-label">淫纹 x{{ yinwenCount }}</div>
    </div>

    <!-- 堕落阶段描述 -->
    <div class="stage-card">
      <div class="stage-header">
        <span class="stage-glyph">堕</span>
        <span class="stage-title">{{ stageName }}</span>
      </div>
      <div class="stage-desc">道心侵蚀 {{ data.牝奴.堕落度 }}% — {{ stageDescription }}</div>
    </div>

    <!-- 身躯改塑 -->
    <div class="transform-section">
      <div class="transform-header">
        <span class="transform-glyph">造</span>
        <span class="transform-title">身躯改塑</span>
      </div>
      <div class="transform-grid">
        <div :class="['transform-item', { done: data.牝奴.改造进度.泌乳 }]">
          <span class="item-icon">{{ data.牝奴.改造进度.泌乳 ? '✦' : '✧' }}</span>
          <span class="item-label">泌乳</span>
        </div>
        <div :class="['transform-item', { done: data.牝奴.改造进度.肛门 }]">
          <span class="item-icon">{{ data.牝奴.改造进度.肛门 ? '✦' : '✧' }}</span>
          <span class="item-label">肛门</span>
        </div>
        <div :class="['transform-item', { done: data.牝奴.改造进度.憋尿 }]">
          <span class="item-icon">{{ data.牝奴.改造进度.憋尿 ? '✦' : '✧' }}</span>
          <span class="item-label">憋尿</span>
        </div>
      </div>
    </div>

    <!-- 牝阴决层数 -->
    <div class="yinjue-section">
      <div class="yinjue-header">
        <span class="yinjue-glyph">决</span>
        <span class="yinjue-title">牝阴决</span>
        <span class="yinjue-value">{{ data.牝奴.牝阴决层数 }}/9</span>
      </div>
      <div class="yinjue-bar">
        <div class="yinjue-fill" :style="{ width: (data.牝奴.牝阴决层数 / 9) * 100 + '%' }"></div>
      </div>
    </div>

    <!-- 拘束法器折叠面板 -->
    <div class="item-section">
      <button class="item-toggle" @click="itemOpen = !itemOpen">
        <span class="item-glyph">器</span>
        <span>拘束法器</span>
        <span class="item-arrow">{{ itemOpen ? '▴' : '▾' }}</span>
      </button>
      <div :class="['item-list', { open: itemOpen }]">
        <div class="item-inner">
          <div v-if="equippedItems.length === 0" class="item-empty">
            <div class="tray-row">
              <span class="tray-slot"></span>
              <span class="tray-slot"></span>
              <span class="tray-slot"></span>
            </div>
            <span class="tray-text">虚位以待</span>
          </div>
          <div v-for="item in equippedItems" :key="item" class="item-row">{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from '../store';
import { get堕落度阶段 } from '../guards';

const store = useDataStore();
const data = store.data;

const itemOpen = ref(false);

const stageName = computed(() => get堕落度阶段(data.牝奴.堕落度));

const stageDescription = computed(() => {
  const 堕落度 = data.牝奴.堕落度;
  if (堕落度 < 10) return '意识清醒, 内心抵抗身体的异变';
  if (堕落度 < 30) return '身体开始背叛意志, 快感阈值降低';
  if (堕落度 < 50) return '本能逐渐凌驾理智, 渴望被支配';
  if (堕落度 < 70) return '淫纹显现, 情欲如潮无法自控';
  if (堕落度 < 90) return '身心彻底沉溺, 主动索求一切';
  return '雌堕完成, 已然成为欲望的化身';
});

const yinwenCount = computed(() => {
  const d = data.牝奴.堕落度;
  if (d >= 90) return 5;
  if (d >= 70) return 4;
  if (d >= 60) return 3;
  if (d >= 50) return 2;
  return 0;
});

const yinwenColor = computed(() => {
  const d = data.牝奴.堕落度;
  if (d >= 90) return '#8b0000';
  if (d >= 70) return '#c84040';
  if (d >= 60) return '#d46048';
  return '#b088d4';
});

const equippedItems = computed(() => {
  return data.道具.装备['玩家'] || [];
});
</script>
<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.phase2-page {
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 堕落阶段卡片 */
.stage-card {
  border: none;
  border-radius: $radius-md;
  padding: 12px 14px;
  background:
    radial-gradient(ellipse at 50% 50%, var(--hh-accent-glow) 0%, transparent 70%),
    var(--hh-bg-surface);
  position: relative;
}

.stage-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .stage-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: var(--hh-gold);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--hh-gold-glow);
    border-radius: 3px;
    background: var(--hh-gold-glow);
  }

  .stage-title {
    font-family: $font-铭文;
    font-size: 14px;
    color: $铭文赤金;
    letter-spacing: 4px;
  }
}

.stage-desc {
  font-size: 12px;
  color: var(--hh-text-secondary);
  line-height: 1.6;
}

/* 身躯改塑 */
.transform-section {
  border: none;
  border-radius: $radius-md;
  padding: 12px 14px;
  background: var(--hh-bg-surface);
}

.transform-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  .transform-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: var(--hh-gold);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--hh-gold-glow);
    border-radius: 3px;
    background: var(--hh-gold-glow);
  }

  .transform-title {
    font-family: $font-铭文;
    font-size: 13px;
    color: var(--hh-text-secondary);
    letter-spacing: 4px;
  }
}

.transform-grid {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.transform-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: $radius-sm;
  transition: all 0.4s ease;
  background: transparent;

  .item-bud {
    font-size: 14px;
    color: var(--hh-text-muted);
    opacity: 0.3;
    transition: all 0.4s ease;
    filter: drop-shadow(0 0 4px transparent);

    &.bloomed {
      opacity: 1;
      color: var(--hh-accent);
      filter: drop-shadow(0 0 8px var(--hh-glow-color));
      animation: bud-bloom 2s ease-in-out infinite;
    }
  }

  .item-label {
    font-size: 12px;
    color: var(--hh-text-secondary);
    letter-spacing: 4px;
    transition: color 0.4s ease;
  }

  &.done {
    background: var(--hh-accent-glow);
    box-shadow: 0 0 16px var(--hh-glow-color);

    .item-label {
      color: var(--hh-accent);
    }
  }
}

@keyframes bud-bloom {
  0%, 100% { filter: drop-shadow(0 0 6px var(--hh-glow-color)); opacity: 0.8; }
  50% { filter: drop-shadow(0 0 14px var(--hh-glow-color)); opacity: 1; }
}

/* 牝阴决 */
.yinjue-section {
  border: none;
  border-radius: $radius-md;
  padding: 12px 14px;
  background: var(--hh-bg-surface);
}

.yinjue-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .yinjue-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: var(--hh-gold);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--hh-gold-glow);
    border-radius: 3px;
    background: var(--hh-gold-glow);
  }

  .yinjue-title {
    font-family: $font-铭文;
    font-size: 13px;
    color: var(--hh-text-secondary);
    letter-spacing: 4px;
    flex: 1;
  }

  .yinjue-value {
    font-family: "Cinzel", Georgia, serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--hh-text-primary);
    text-shadow: 0 0 8px var(--hh-glow-color);
    letter-spacing: 2px;
  }
}

.yinjue-bar {
  height: 3px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  overflow: visible;
  border: none;
  position: relative;

  .yinjue-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.6s ease;
    background: var(--hh-progress-fill);
    box-shadow: 0 0 8px var(--hh-glow-color), 0 0 16px var(--hh-glow-color);
    animation: incense-burn 3s ease-in-out infinite;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: -2px;
      top: -3px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--hh-accent);
      box-shadow: 0 0 8px var(--hh-glow-color);
      animation: ember-pulse 1.5s ease-in-out infinite;
    }
  }
}

@keyframes incense-burn {
  0%, 100% { box-shadow: 0 0 6px var(--hh-glow-color); }
  50% { box-shadow: 0 0 14px var(--hh-glow-color), 0 0 20px var(--hh-glow-color); }
}

@keyframes ember-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

/* 拘束法器 */
.item-section {
  border: none;
  border-radius: $radius-md;
  overflow: hidden;
  background: var(--hh-bg-surface);
}

.item-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: none;
  border: none;
  color: var(--hh-text-secondary);
  font-family: $font-铭文;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: var(--hh-gold-glow);
  }

  .item-glyph {
    font-size: 14px;
    color: var(--hh-gold);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--hh-gold-glow);
    border-radius: 3px;
    background: var(--hh-gold-glow);
  }

  .item-arrow {
    margin-left: auto;
  }
}

.item-list {
  @include expand-panel;
}

.item-inner {
  padding: 0 14px 12px;
}

.item-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 0;

  .tray-row {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .tray-slot {
    width: 48px;
    height: 36px;
    border: 1px dashed var(--hh-divider-alpha);
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.15);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: 6px;
      border: 1px solid var(--hh-gold-glow);
      border-radius: 2px;
      opacity: 0.3;
    }
  }

  .tray-text {
    font-family: $font-铭文;
    font-size: 11px;
    color: var(--hh-text-muted);
    letter-spacing: 4px;
    opacity: 0.5;
  }
}

.item-row {
  padding: 4px 0;
  font-size: 12px;
  color: var(--hh-text-secondary);
  border-bottom: 1px solid var(--hh-gold-glow);

  &:last-child {
    border-bottom: none;
  }
}

/* 淫纹视觉 */
.yinwen-section {
  border: none;
  border-radius: $radius-md;
  padding: 10px 14px;
  text-align: center;
  background: radial-gradient(ellipse at 50% 50%, var(--hh-accent-glow) 0%, transparent 70%), var(--hh-bg-surface);
}

.yinwen-marks {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 6px;
}

.yinwen-mark {
  font-family: $font-铭文;
  font-size: 18px;
  font-weight: 700;
  text-shadow: 0 0 8px currentColor;
  animation: yinwen-glow 2s ease-in-out infinite;
}

.yinwen-label {
  font-size: 11px;
  color: var(--hh-text-muted);
  letter-spacing: 4px;
}

@keyframes yinwen-glow {
  0%, 100% { opacity: 0.7; text-shadow: 0 0 6px currentColor; }
  50% { opacity: 1; text-shadow: 0 0 14px currentColor; }
}
</style>