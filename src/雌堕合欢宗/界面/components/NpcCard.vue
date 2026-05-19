<template>
  <div :class="['npc-card', statusClass]" :style="{ '--npc-name': npc名, '--affinity-value': data.好感度 }" @click="$emit('click')">
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

type NpcName = '白芷' | '苏芸' | '纪兰' | '沈月秋' | '柳素衣';

const props = defineProps<{
  npc名: NpcName;
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
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

/* ═══════════════════════════════════
   灵牌·NPC卡片 — 金箔贴片
   ═══════════════════════════════════ */

.npc-card {
  position: relative;
  padding: 14px 12px 12px;
  @include gold-foil;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;

  // 双层描边（深金 + 浅金，间距 2px）
  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border: 1px solid rgba(212, 160, 23, 0.1);
    border-radius: $radius-lg;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.5),
      0 0 16px rgba(212, 160, 23, 0.08);
  }

  // 已完成：金框高亮 + NPC专属色
  &.completed {
    @include status-badge('completed');

    // NPC专属微色（仅在已完成攻略状态时显示）
    .npc-name {
      @include npc-color(var(--npc-name));
    }
  }

  // 进行中：微光
  &.active {
    @include status-badge('active');
  }

  // 锁定：暗淡
  &.locked {
    @include status-badge('locked');
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
  font-family: $font-铭文;
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

/* 好感度轨道 — 温度计隐喻 */
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
    border-radius: 2px;
    transition: width 0.4s ease;
    position: relative;

    // 好感度温度计效果
    @include thermometer-bar(var(--affinity-value, 0));

    // 当前位置光点
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);
    }
  }

  .progress-value {
    font-size: 11px;
    font-family: $font-铭文;
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
    font-family: $font-铭文;
    color: rgba(180, 150, 100, 0.7);
  }
}
</style>
