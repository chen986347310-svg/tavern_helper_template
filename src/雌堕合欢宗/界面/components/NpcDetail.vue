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
          <span class="bar-value">{{ data.好感度 }}</span>
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
          <span class="bar-value">{{ data.攻略值 }}</span>
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
defineProps<{
  npc名: string;
  data: {
    好感度: number;
    攻略值: number;
    粘滞计数: number;
    状态: string;
  };
}>();
</script>

<style lang="scss" scoped>
/* ═══════════════════════════════════
   灵鉴·NPC详情面板
   ═══════════════════════════════════ */

.npc-detail {
  padding: 16px;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(139, 90, 43, 0.03) 3px,
      rgba(139, 90, 43, 0.03) 4px
    ),
    linear-gradient(180deg, rgba(42, 31, 20, 0.9) 0%, rgba(30, 21, 13, 0.95) 100%);
  border: 1px solid rgba(212, 160, 23, 0.2);
  border-radius: 8px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    background: radial-gradient(ellipse at 50% 0%, rgba(212, 160, 23, 0.04) 0%, transparent 50%);
    pointer-events: none;
  }
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
    background: linear-gradient(90deg, transparent, rgba(212, 160, 23, 0.3), transparent);
  }

  .detail-name {
    font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
    font-size: 20px;
    font-weight: 700;
    color: #d4a017;
    letter-spacing: 0.2em;
    margin: 0;
    text-shadow: 0 0 12px rgba(212, 160, 23, 0.2);
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
    font-family: 'Noto Serif SC', serif;
    font-size: 14px;
    color: rgba(212, 160, 23, 0.5);
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(212, 160, 23, 0.15);
    border-radius: 3px;
    background: rgba(212, 160, 23, 0.03);
  }

  .label-text {
    font-size: 12px;
    color: rgba(180, 150, 100, 0.5);
    letter-spacing: 0.05em;
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
  border: 1px solid rgba(212, 160, 23, 0.06);
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
  position: relative;
  overflow: hidden;

  &.favor {
    background: linear-gradient(90deg, #6b5b3a, #d4a017);
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
  font-family: 'Noto Serif SC', serif;
  font-size: 14px;
  color: rgba(212, 160, 23, 0.7);
  min-width: 28px;
  text-align: right;
}

/* 数值 */
.row-value {
  flex: 1;

  .value-num {
    font-family: 'Noto Serif SC', serif;
    font-size: 16px;
    color: rgba(180, 150, 100, 0.7);
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
  letter-spacing: 0.05em;
  transition: all 0.3s ease;

  .badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  &.未开始 {
    background: rgba(100, 80, 50, 0.15);
    color: rgba(180, 150, 100, 0.5);
    border: 1px solid rgba(100, 80, 50, 0.2);

    .badge-dot {
      background: rgba(180, 150, 100, 0.3);
    }
  }

  &.进行中 {
    background: rgba(139, 115, 85, 0.15);
    color: rgba(180, 150, 100, 0.7);
    border: 1px solid rgba(139, 115, 85, 0.25);

    .badge-dot {
      background: #8b7355;
      box-shadow: 0 0 4px rgba(139, 115, 85, 0.4);
    }
  }

  &.已完成 {
    background: rgba(212, 160, 23, 0.1);
    color: #d4a017;
    border: 1px solid rgba(212, 160, 23, 0.25);

    .badge-dot {
      background: #d4a017;
      box-shadow: 0 0 6px rgba(212, 160, 23, 0.5);
    }
  }
}

/* 底部装饰线 */
.detail-footer {
  margin-top: 16px;

  .footer-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 160, 23, 0.15), transparent);
  }
}
</style>
