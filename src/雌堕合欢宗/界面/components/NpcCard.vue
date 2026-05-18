<template>
  <div :class="['npc-card', statusClass]" @click="$emit('click')">
    <!-- 灵牌顶部装饰 -->
    <div class="card-crest">
      <div class="crest-line"></div>
      <span class="crest-dot"></span>
      <div class="crest-line"></div>
    </div>

    <!-- NPC 名号 -->
    <div class="npc-name">{{ npc名 }}</div>

    <!-- 状态徽记 -->
    <div class="npc-status">
      <span class="status-dot"></span>
      {{ data.状态 }}
    </div>

    <!-- 好感度条 -->
    <div class="progress-track">
      <div class="progress-label">好感</div>
      <div class="progress-bar">
        <div class="bar-fill" :style="{ width: data.好感度 + '%' }"></div>
      </div>
      <div class="progress-value">{{ data.好感度 }}</div>
    </div>

    <!-- 底部数值 -->
    <div class="stats">
      <div class="stat-item">
        <span class="stat-label">攻略</span>
        <span class="stat-value">{{ data.攻略值 }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">粘滞</span>
        <span class="stat-value">{{ data.粘滞计数 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  npc名: string;
  data: {
    好感度: number;
    攻略值: number;
    粘滞计数: number;
    状态: string;
  };
}>();

defineEmits<{
  click: [];
}>();

const statusClass = computed(() => {
  switch (props.data.状态) {
    case '已完成': return 'completed';
    case '进行中': return 'active';
    default: return 'locked';
  }
});
</script>

<style lang="scss" scoped>
/* ═══════════════════════════════════
   灵牌·NPC卡片
   ═══════════════════════════════════ */

.npc-card {
  position: relative;
  padding: 14px 12px 12px;
  background:
    /* 纸纹 */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(139, 90, 43, 0.04) 3px,
      rgba(139, 90, 43, 0.04) 4px
    ),
    linear-gradient(180deg, rgba(42, 31, 20, 0.95) 0%, rgba(30, 21, 13, 0.98) 100%);
  border: 1px solid rgba(212, 160, 23, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;

  /* 内发光 */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: radial-gradient(ellipse at 50% 0%, rgba(212, 160, 23, 0.06) 0%, transparent 60%);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(212, 160, 23, 0.4);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.5),
      0 0 16px rgba(212, 160, 23, 0.08);
  }

  /* 已完成：金框高亮 */
  &.completed {
    border-color: rgba(212, 160, 23, 0.5);
    box-shadow:
      0 0 12px rgba(212, 160, 23, 0.1),
      inset 0 0 20px rgba(212, 160, 23, 0.03);

    .npc-name {
      color: #d4a017;
      text-shadow: 0 0 8px rgba(212, 160, 23, 0.3);
    }

    .status-dot {
      background: #d4a017;
      box-shadow: 0 0 6px rgba(212, 160, 23, 0.5);
    }
  }

  /* 进行中：微光 */
  &.active {
    border-color: rgba(180, 150, 100, 0.3);

    .status-dot {
      background: #8b7355;
      box-shadow: 0 0 4px rgba(139, 115, 85, 0.4);
    }
  }

  /* 锁定：暗淡 */
  &.locked {
    opacity: 0.45;
    filter: saturate(0.3);

    &:hover {
      opacity: 0.6;
    }
  }
}

/* 顶部装饰线 */
.card-crest {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;

  .crest-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 160, 23, 0.25), transparent);
  }

  .crest-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(212, 160, 23, 0.4);
  }
}

/* NPC 名号 */
.npc-name {
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
  font-size: 18px;
  font-weight: 700;
  color: rgba(212, 160, 23, 0.85);
  text-align: center;
  letter-spacing: 0.15em;
  margin-bottom: 6px;
  transition: all 0.3s ease;
}

/* 状态徽记 */
.npc-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 11px;
  color: rgba(180, 150, 100, 0.5);
  letter-spacing: 0.08em;
  margin-bottom: 12px;

  .status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(180, 150, 100, 0.3);
    transition: all 0.3s ease;
  }
}

/* 好感度轨道 */
.progress-track {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;

  .progress-label {
    font-size: 10px;
    color: rgba(180, 150, 100, 0.4);
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .progress-bar {
    flex: 1;
    height: 4px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid rgba(212, 160, 23, 0.08);
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #6b5b3a, #d4a017);
    border-radius: 2px;
    transition: width 0.4s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      width: 3px;
      height: 100%;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 0 2px 2px 0;
    }
  }

  .progress-value {
    font-size: 11px;
    font-family: 'Noto Serif SC', serif;
    color: rgba(212, 160, 23, 0.7);
    min-width: 24px;
    text-align: right;
  }
}

/* 底部数值 */
.stats {
  display: flex;
  justify-content: center;
  gap: 16px;

  .stat-item {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .stat-label {
    font-size: 10px;
    color: rgba(180, 150, 100, 0.35);
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 13px;
    font-family: 'Noto Serif SC', serif;
    color: rgba(180, 150, 100, 0.7);
  }
}
</style>
