<template>
  <div class="home-page">
    <!-- 系统状态栏 -->
    <div class="system-bar">
      <div class="phase-badge">
        <span class="badge-glyph">境</span>
        <span class="badge-text">{{ data.系统.阶段 }}</span>
      </div>
      <div class="bar-divider"></div>
      <div class="stat-item">
        <span class="stat-label">余日</span>
        <span class="stat-value">{{ data.系统.剩余天数 }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">灵石</span>
        <span class="stat-value">{{ data.系统.灵石 }}</span>
      </div>
    </div>

    <!-- NPC 灵牌阵列 -->
    <div class="section-label">
      <div class="label-line"></div>
      <span class="label-text">宗门弟子</span>
      <div class="label-line"></div>
    </div>

    <div class="npc-grid">
      <NpcCard
        v-for="name in NPC列表"
        :key="name"
        :npc名="name"
        :data="data.NPC[name]"
        @click="selectNpc(name)"
      />
    </div>

    <!-- NPC 详情面板 -->
    <Transition name="slide">
      <div v-if="selectedNpc" class="npc-detail-wrap">
        <NpcDetail :npc名="selectedNpc" :data="data.NPC[selectedNpc]" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from '../store';
import NpcCard from '../components/NpcCard.vue';
import NpcDetail from '../components/NpcDetail.vue';

const store = useDataStore();
const data = store.data;

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
type NpcName = typeof NPC列表[number];
const selectedNpc = ref<NpcName | null>(null);

function selectNpc(name: NpcName) {
  selectedNpc.value = selectedNpc.value === name ? null : name;
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

/* ═══════════════════════════════════
   首页·宗门总览 — 金册扉页
   ═══════════════════════════════════ */

.home-page {
  padding: 12px 0;
}

/* 系统状态栏 — 金册扉页 */
.system-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  margin-bottom: 16px;
  @include gold-foil;
  border-radius: $radius-md;

  .phase-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    background: rgba(212, 160, 23, 0.1);
    border: 1px solid rgba(212, 160, 23, 0.25);
    border-radius: $radius-sm;

    .badge-glyph {
      font-family: $font-铭文;
      font-size: 12px;
      color: rgba(212, 160, 23, 0.6);
    }

    .badge-text {
      font-family: $font-铭文;
      font-size: 13px;
      color: $册缘鎏金;
      letter-spacing: 0.08em;
    }
  }

  .bar-divider {
    width: 1px;
    height: 20px;
    background: rgba(212, 160, 23, 0.15);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;

    .stat-label {
      font-size: 10px;
      color: rgba(180, 150, 100, 0.4);
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-family: $font-铭文;
      font-size: 16px;
      font-weight: 700;
      color: rgba(212, 160, 23, 0.8);
    }
  }
}

/* 区域标签 — 金册装饰线 */
.section-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  .label-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 160, 23, 0.2), transparent);
  }

  .label-text {
    font-family: $font-铭文;
    font-size: 12px;
    color: rgba(180, 150, 100, 0.4);
    letter-spacing: 0.15em;
  }
}

/* NPC 网格 — 五位女修的命格金页 */
.npc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

/* NPC 详情包裹 */
.npc-detail-wrap {
  margin-top: 4px;
}

/* 详情展开动画 — 金册翻页 */
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
