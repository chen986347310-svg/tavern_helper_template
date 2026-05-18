<template>
  <div class="app-container">
    <div class="scroll-frame">
      <!-- 金色角落装饰 -->
      <div class="corner-ornament top-left"></div>
      <div class="corner-ornament top-right"></div>
      <div class="corner-ornament bottom-left"></div>
      <div class="corner-ornament bottom-right"></div>

      <!-- 卷轴顶部装饰条 -->
      <div class="scroll-header">
        <div class="header-line"></div>
        <span class="header-glyph">合</span>
        <div class="header-line"></div>
      </div>

      <div class="content-area">
        <Transition name="fade" mode="out-in">
          <HomePage v-if="currentTab === 'home'" />
          <ShopPage v-else-if="currentTab === 'shop'" />
          <BackpackPage v-else-if="currentTab === 'backpack'" />
          <GalleryPage v-else-if="currentTab === 'gallery'" />
        </Transition>
      </div>

      <PageNav :currentTab="currentTab" @change="currentTab = $event" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HomePage from './界面/pages/HomePage.vue';
import ShopPage from './界面/pages/ShopPage.vue';
import BackpackPage from './界面/pages/BackpackPage.vue';
import GalleryPage from './界面/pages/GalleryPage.vue';
import PageNav from './界面/components/PageNav.vue';

const currentTab = ref('home');
</script>

<style lang="scss" scoped>
/* ═══════════════════════════════════
   夜卷·合欢渊 — 主容器
   ═══════════════════════════════════ */

.app-container {
  width: 100%;
  aspect-ratio: 2 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(101, 67, 33, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 50% 80%, rgba(60, 40, 20, 0.1) 0%, transparent 50%),
    #0a0604;
  overflow: hidden;
}

/* 卷轴外框 */
.scroll-frame {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background:
    /* 纸张纤维纹理 */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(139, 90, 43, 0.03) 2px,
      rgba(139, 90, 43, 0.03) 3px
    ),
    /* 墨渍斑驳 */
    radial-gradient(ellipse at 20% 15%, rgba(80, 50, 20, 0.08) 0%, transparent 40%),
    radial-gradient(ellipse at 75% 60%, rgba(80, 50, 20, 0.06) 0%, transparent 35%),
    radial-gradient(ellipse at 40% 85%, rgba(80, 50, 20, 0.05) 0%, transparent 30%),
    /* 基底渐变 */
    linear-gradient(180deg, #2a1f14 0%, #1e150d 50%, #2a1f14 100%);
  border: 1px solid rgba(212, 160, 23, 0.3);
  box-shadow:
    0 0 40px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(0, 0, 0, 0.4),
    inset 0 0 60px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(212, 160, 23, 0.15),
    inset 0 -1px 0 rgba(212, 160, 23, 0.1);
  overflow: hidden;
}

/* 金色角落装饰 */
.corner-ornament {
  position: absolute;
  width: 24px;
  height: 24px;
  z-index: 10;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: linear-gradient(135deg, #d4a017, #b8860b);
    opacity: 0.6;
  }

  &.top-left {
    top: 4px;
    left: 4px;
    &::before { top: 0; left: 0; width: 16px; height: 1px; }
    &::after { top: 0; left: 0; width: 1px; height: 16px; }
  }

  &.top-right {
    top: 4px;
    right: 4px;
    &::before { top: 0; right: 0; width: 16px; height: 1px; }
    &::after { top: 0; right: 0; width: 1px; height: 16px; }
  }

  &.bottom-left {
    bottom: 4px;
    left: 4px;
    &::before { bottom: 0; left: 0; width: 16px; height: 1px; }
    &::after { bottom: 0; left: 0; width: 1px; height: 16px; }
  }

  &.bottom-right {
    bottom: 4px;
    right: 4px;
    &::before { bottom: 0; right: 0; width: 16px; height: 1px; }
    &::after { bottom: 0; right: 0; width: 1px; height: 16px; }
  }
}

/* 卷轴顶部装饰条 */
.scroll-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  flex-shrink: 0;

  .header-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 160, 23, 0.4), transparent);
  }

  .header-glyph {
    font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
    font-size: 14px;
    color: rgba(212, 160, 23, 0.5);
    letter-spacing: 0.1em;
  }
}

/* 内容区域 */
.content-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 8px;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(212, 160, 23, 0.2);
    border-radius: 2px;

    &:hover {
      background: rgba(212, 160, 23, 0.4);
    }
  }
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
