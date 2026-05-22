<template>
  <div class="gallery-page">
    <!-- NPC 档案 -->
    <div class="section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">鉴</span>
        <span class="header-text">NPC档案</span>
        <div class="header-line"></div>
      </div>

      <div class="npc-list">
        <div
          v-for="name in NPC列表"
          :key="name"
          :class="['npc-entry', { unlocked: data.NPC[name]?.状态 !== '未开始' }]"
          @click="selectNpc(name)"
        >
          <div class="entry-left">
            <span class="entry-dot"></span>
            <span class="npc-name">{{ name }}</span>
          </div>
          <span class="npc-status">{{ data.NPC[name]?.状态 ?? '未开始' }}</span>
        </div>
      </div>
    </div>

    <!-- NPC 详情 -->
    <Transition name="slide">
      <div v-if="selectedNpc" class="npc-detail-panel">
        <div class="panel-header">
          <div class="header-line"></div>
          <span class="panel-name">{{ selectedNpc }}</span>
          <div class="header-line"></div>
        </div>

        <div class="detail-grid">
          <div class="detail-cell">
            <span class="cell-glyph">情</span>
            <span class="cell-label">好感度</span>
            <span class="cell-value">{{ data.NPC[selectedNpc]?.好感度 ?? 0 }}</span>
          </div>
          <div class="detail-cell">
            <span class="cell-glyph">攻</span>
            <span class="cell-label">攻略值</span>
            <span class="cell-value">{{ data.NPC[selectedNpc]?.攻略值 ?? 0 }}</span>
          </div>
          <div class="detail-cell">
            <span class="cell-glyph">态</span>
            <span class="cell-label">状态</span>
            <span class="cell-value status" :class="data.NPC[selectedNpc]?.状态 ?? '未开始'">
              {{ data.NPC[selectedNpc]?.状态 ?? '未开始' }}
            </span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 已解锁场景 -->
    <div class="section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">景</span>
        <span class="header-text">已解锁场景</span>
        <div class="header-line"></div>
      </div>

      <div class="unlock-list">
        <div v-for="scene in data.场景.已解锁" :key="scene" class="unlock-item">
          <span class="item-dot"></span>
          <span class="item-text">{{ scene }}</span>
        </div>
        <div v-if="data.场景.已解锁.length === 0" class="empty-state">
          <span class="empty-glyph">空</span>
          <span class="empty-text">暂无</span>
        </div>
      </div>
    </div>

    <!-- 已解锁剧情 -->
    <div class="section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">缘</span>
        <span class="header-text">已解锁剧情</span>
        <div class="header-line"></div>
      </div>

      <div class="unlock-list">
        <div v-for="story in data.剧情.已解锁" :key="story" class="unlock-item">
          <span class="item-dot"></span>
          <span class="item-text">{{ story }}</span>
        </div>
        <div v-if="data.剧情.已解锁.length === 0" class="empty-state">
          <span class="empty-glyph">空</span>
          <span class="empty-text">暂无</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();
const data = store.data;

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
const selectedNpc = ref<string | null>(null);

function selectNpc(name: string) {
  selectedNpc.value = selectedNpc.value === name ? null : name;
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

/* ═══════════════════════════════════
   鉴·图鉴页面 — 金册玉牒
   ═══════════════════════════════════ */

.gallery-page {
  padding: 12px 0;
}

/* 区域 */
.section {
  margin-bottom: 20px;
}

/* 区域标题 — 金册装饰线 */
.section-header {
  @include section-header;
}

/* NPC 列表 — 金线姻缘 */
.npc-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.npc-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: var(--hh-bg-card);
  border: none;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all 0.35s ease;

  .entry-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .entry-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--hh-text-muted);
      transition: all 0.25s ease;
    }
  }

  .npc-name {
    font-family: $font-铭文;
    font-size: 14px;
    color: var(--hh-text-secondary);
    letter-spacing: 4px;
    transition: color 0.25s ease;
  }

  .npc-status {
    font-size: 12px;
    color: var(--hh-text-muted);
    letter-spacing: 4px;
  }

  &.unlocked {
    background: var(--hh-bg-hover);

    .entry-left .entry-dot {
      background: var(--hh-accent);
      box-shadow: 0 0 6px var(--hh-glow-color);
    }

    .npc-name {
      color: var(--hh-text-primary);
    }

    .npc-status {
      color: var(--hh-accent);
    }

    &:hover {
      background: var(--hh-accent-glow);
      box-shadow: 0 0 18px var(--hh-glow-color);
    }
  }

  &:hover {
    background: var(--hh-bg-hover);
  }
}

/* NPC 详情面板 — 金箔贴片 */
.npc-detail-panel {
  margin-bottom: 20px;
  padding: 16px;
  border: none;
  background: var(--hh-bg-surface);
  border-radius: $radius-md;

  .panel-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;

    .header-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--hh-gold-glow), transparent);
    }

    .panel-name {
      font-family: $font-铭文;
      font-size: 18px;
      font-weight: 700;
      color: $册缘鎏金;
      letter-spacing: 4px;
      @include inscription-engrave;
    }
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.detail-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  background: var(--hh-bg-card);
  border: none;
  border-radius: $radius-sm;

  .cell-glyph {
    font-family: $font-铭文;
    font-size: 12px;
    color: var(--hh-text-muted);
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 3px;
    background: var(--hh-bg-card);
  }

  .cell-label {
    font-size: 10px;
    color: var(--hh-text-muted);
    letter-spacing: 4px;
  }

  .cell-value {
    font-family: $font-铭文;
    font-size: 18px;
    font-weight: 700;
    color: var(--hh-text-primary);

    &.status {
      font-size: 12px;
      font-weight: 400;
      padding: 2px 8px;
      border-radius: 3px;

      &.未开始 {
        color: var(--hh-text-muted);
        background: rgba(100, 80, 50, 0.1);
      }

      &.进行中 {
        color: var(--hh-text-secondary);
        background: var(--hh-gold-glow);
      }

      &.已完成 {
        color: $册缘鎏金;
        background: var(--hh-gold-glow);
        box-shadow: $shadow-金色发光;
      }
    }
  }
}

/* 解锁列表 — 金册年表 */
.unlock-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.unlock-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: none;
  background: var(--hh-bg-card);
  border-radius: $radius-sm;
  transition: all 0.35s ease;

  &:hover {
    background: var(--hh-bg-hover);
    box-shadow: 0 0 12px var(--hh-glow-color);
  }

  .item-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--hh-accent);
    flex-shrink: 0;
  }

  .item-text {
    font-family: $font-铭文;
    font-size: 13px;
    color: var(--hh-text-secondary);
    letter-spacing: 4px;
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px;

  .empty-glyph {
    font-family: $font-铭文;
    font-size: 20px;
    color: var(--hh-text-muted);
  }

  .empty-text {
    font-size: 12px;
    color: var(--hh-text-muted);
    letter-spacing: 4px;
  }
}

/* 展开动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
