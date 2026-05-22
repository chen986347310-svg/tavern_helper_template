<template>
  <div class="npc-detail">
    <!-- 卷轴标题栏 -->
    <div class="detail-header">
      <div class="header-ornament"></div>
      <h3 class="detail-name">{{ npc名 }}</h3>
      <div class="header-ornament"></div>
    </div>

    <!-- 属性面板 -->
    <div class="detail-grid">
      <!-- 好感度 -->
      <div class="detail-row">
        <div class="row-label">
          <span class="label-glyph">情</span>
          <span class="label-text">好感度</span>
        </div>
        <div class="row-bar">
          <div class="bar-track">
            <div class="bar-fill favor" :style="{ width: data.好感度 + '%' }">
              <div class="bar-glow"></div>
            </div>
          </div>
          <span class="bar-value">{{ get灵犀等级(data.好感度) }}</span>
        </div>
      </div>

      <!-- 攻略值 -->
      <div class="detail-row">
        <div class="row-label">
          <span class="label-glyph">攻</span>
          <span class="label-text">攻略值</span>
        </div>
        <div class="row-bar">
          <div class="bar-track">
            <div class="bar-fill progress" :style="{ width: data.攻略值 + '%' }">
              <div class="bar-glow"></div>
            </div>
          </div>
          <span class="bar-value">{{ get道心侵蚀(data.攻略值) }}</span>
        </div>
      </div>

      <!-- 粘滞计数 -->
      <div class="detail-row">
        <div class="row-label">
          <span class="label-glyph">滞</span>
          <span class="label-text">粘滞计数</span>
        </div>
        <div class="row-value">
          <span class="value-num">{{ data.粘滞计数 }}</span>
        </div>
      </div>

      <!-- 状态 -->
      <div class="detail-row">
        <div class="row-label">
          <span class="label-glyph">态</span>
          <span class="label-text">状态</span>
        </div>
        <div class="row-value">
          <span class="status-badge" :class="data.状态">
            <span class="badge-dot"></span>
            {{ data.状态 }}
          </span>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="detail-footer">
      <div class="footer-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { get灵犀等级, get道心侵蚀 } from '../composables/useStatusText';

type NpcName = '白芷' | '苏芸' | '纪兰' | '沈月秋' | '柳素衣';

defineProps<{
  npc名: NpcName;
  data: {
    好感度: number;
    攻略值: number;
    粘滞计数: number;
    状态: string;
  };
}>();
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

/* ═══════════════════════════════════
   灵鉴·NPC详情面板 — 金箔贴片
   ═══════════════════════════════════ */

.npc-detail {
  padding: 16px;
  border: none;
  box-shadow: none;
  background: var(--hh-bg-surface);
  border-radius: $radius-lg;
}

/* 标题栏 */
.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .header-ornament {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--hh-border-accent), transparent);
  }

  .detail-name {
    font-family: $font-铭文;
    font-size: 20px;
    font-weight: 700;
    color: $册缘鎏金;
    letter-spacing: 0.2em;
    margin: 0;
    text-shadow: 0 0 12px var(--hh-gold-glow);
  }
}

/* 属性网格 */
.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 单行 */
.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 标签 */
.row-label {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 80px;
  flex-shrink: 0;

  .label-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: var(--hh-gold);
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 3px;
    background: var(--hh-bg-card);
  }

  .label-text {
    font-size: 12px;
    color: var(--hh-text-secondary);
    letter-spacing: 4px;
  }
}

/* 进度条容器 */
.row-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-track {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  overflow: hidden;
  border: none;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
  position: relative;
  overflow: hidden;

  &.favor {
    @include thermometer-bar(var(--affinity-value, 0));
  }

  &.progress {
    background: linear-gradient(90deg, #5a4a30, #b8860b);
  }

  .bar-glow {
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 100%;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 0 3px 3px 0;
  }
}

.bar-value {
  font-family: $font-铭文;
  font-size: 14px;
  color: var(--hh-gold);
  min-width: 28px;
  text-align: right;
}

/* 数值 */
.row-value {
  flex: 1;

  .value-num {
    font-family: $font-铭文;
    font-size: 16px;
    color: var(--hh-text-secondary);
  }
}

/* 状态徽记 */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  letter-spacing: 4px;
  transition: all 0.3s ease;

  .badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  &.未开始 {
    background: rgba(100, 80, 50, 0.15);
    color: var(--hh-text-secondary);
    border: none;

    .badge-dot {
      background: var(--hh-text-muted);
    }
  }

  &.进行中 {
    background: rgba(139, 115, 85, 0.15);
    color: var(--hh-text-secondary);
    border: none;

    .badge-dot {
      background: #8b7355;
      box-shadow: 0 0 4px rgba(139, 115, 85, 0.4);
    }
  }

  &.已完成 {
    background: var(--hh-gold-glow);
    color: $册缘鎏金;
    border: none;

    .badge-dot {
      background: $册缘鎏金;
      box-shadow: 0 0 6px var(--hh-gold);
    }
  }
}

/* 底部装饰线 */
.detail-footer {
  margin-top: 16px;

  .footer-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--hh-gold-glow), transparent);
  }
}
</style>
