<template>
  <div class="phase2-page">
    <!-- 牝奴期状态栏 -->
    <SystemBar
      mode="牝奴期"
      :堕落度="data.牝奴.堕落度"
      :牝阴决层数="data.牝奴.牝阴决层数"
    />

    <!-- 堕落阶段描述 -->
    <div class="stage-card">
      <div class="stage-header">
        <span class="stage-glyph">堕</span>
        <span class="stage-title">{{ stageName }}</span>
      </div>
      <div class="stage-desc">
        堕落度 {{ data.牝奴.堕落度 }}% — {{ stageDescription }}
      </div>
    </div>

    <!-- 改造进度 -->
    <div class="transform-section">
      <div class="transform-header">
        <span class="transform-glyph">造</span>
        <span class="transform-title">改造进度</span>
      </div>
      <div class="transform-grid">
        <div :class="['transform-item', { done: data.牝奴.改造进度.泌乳 }]">
          <span class="item-icon">{{ data.牝奴.改造进度.泌乳 ? '✓' : '○' }}</span>
          <span class="item-label">泌乳</span>
        </div>
        <div :class="['transform-item', { done: data.牝奴.改造进度.肛门 }]">
          <span class="item-icon">{{ data.牝奴.改造进度.肛门 ? '✓' : '○' }}</span>
          <span class="item-label">肛门</span>
        </div>
        <div :class="['transform-item', { done: data.牝奴.改造进度.憋尿 }]">
          <span class="item-icon">{{ data.牝奴.改造进度.憋尿 ? '✓' : '○' }}</span>
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
        <div class="yinjue-fill" :style="{ width: (data.牝奴.牝阴决层数 / 9 * 100) + '%' }"></div>
      </div>
    </div>

    <!-- 道具状态折叠面板 -->
    <div class="item-section">
      <button class="item-toggle" @click="itemOpen = !itemOpen">
        <span class="item-glyph">器</span>
        <span>道具状态</span>
        <span class="item-arrow">{{ itemOpen ? '▴' : '▾' }}</span>
      </button>
      <div :class="['item-list', { open: itemOpen }]">
        <div class="item-inner">
          <div v-if="equippedItems.length === 0" class="item-empty">暂无装备道具</div>
          <div v-for="item in equippedItems" :key="item" class="item-row">{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from '../store';
import SystemBar from '../components/SystemBar.vue';
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
  @include gold-foil;
  border-radius: $radius-md;
  padding: 12px 14px;
}

.stage-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .stage-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: rgba(212, 160, 23, 0.5);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(212, 160, 23, 0.15);
    border-radius: 3px;
    background: rgba(212, 160, 23, 0.03);
  }

  .stage-title {
    font-family: $font-铭文;
    font-size: 14px;
    color: $铭文赤金;
    letter-spacing: 0.1em;
  }
}

.stage-desc {
  font-size: 12px;
  color: rgba(180, 150, 100, 0.6);
  line-height: 1.6;
}

/* 改造进度 */
.transform-section {
  @include gold-foil;
  border-radius: $radius-md;
  padding: 12px 14px;
}

.transform-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  .transform-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: rgba(212, 160, 23, 0.5);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(212, 160, 23, 0.15);
    border-radius: 3px;
    background: rgba(212, 160, 23, 0.03);
  }

  .transform-title {
    font-family: $font-铭文;
    font-size: 13px;
    color: rgba(180, 150, 100, 0.5);
    letter-spacing: 0.1em;
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
  padding: 4px 10px;
  border: 1px solid rgba(180, 150, 100, 0.15);
  border-radius: $radius-sm;
  transition: all 0.3s ease;

  .item-icon {
    font-size: 12px;
    color: rgba(180, 150, 100, 0.3);
  }

  .item-label {
    font-size: 12px;
    color: rgba(180, 150, 100, 0.5);
  }

  &.done {
    border-color: rgba(212, 160, 23, 0.3);
    background: rgba(212, 160, 23, 0.05);

    .item-icon {
      color: $铭文赤金;
      text-shadow: 0 0 6px rgba(212, 160, 23, 0.4);
    }

    .item-label {
      color: $铭文赤金;
    }
  }
}

/* 牝阴决 */
.yinjue-section {
  @include gold-foil;
  border-radius: $radius-md;
  padding: 12px 14px;
}

.yinjue-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .yinjue-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: rgba(212, 160, 23, 0.5);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(212, 160, 23, 0.15);
    border-radius: 3px;
    background: rgba(212, 160, 23, 0.03);
  }

  .yinjue-title {
    font-family: $font-铭文;
    font-size: 13px;
    color: rgba(180, 150, 100, 0.5);
    letter-spacing: 0.1em;
    flex: 1;
  }

  .yinjue-value {
    font-family: $font-铭文;
    font-size: 14px;
    font-weight: 700;
    color: $铭文赤金;
  }
}

.yinjue-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(212, 160, 23, 0.06);

  .yinjue-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.4s ease;
    background: linear-gradient(90deg, #5a4a30, #b8860b, );
  }
}

/* 道具状态 */
.item-section {
  @include gold-foil;
  border-radius: $radius-md;
  overflow: hidden;
}

.item-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: none;
  border: none;
  color: rgba(180, 150, 100, 0.5);
  font-family: $font-铭文;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(212, 160, 23, 0.05);
  }

  .item-glyph {
    font-size: 14px;
    color: rgba(212, 160, 23, 0.5);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(212, 160, 23, 0.15);
    border-radius: 3px;
    background: rgba(212, 160, 23, 0.03);
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
  font-size: 12px;
  color: rgba(180, 150, 100, 0.3);
  text-align: center;
  padding: 8px 0;
}

.item-row {
  padding: 4px 0;
  font-size: 12px;
  color: rgba(180, 150, 100, 0.6);
  border-bottom: 1px solid rgba(212, 160, 23, 0.06);

  &:last-child {
    border-bottom: none;
  }
}
</style>