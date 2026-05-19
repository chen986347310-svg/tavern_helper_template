<template>
  <div class="home-page">
    <!-- 系统状态栏 -->
    <SystemBar
      v-if="data.系统.阶段 === '攻略期'"
      mode="攻略期"
      :npcList="NPC列表"
      :npcStates="data.NPC"
      :remainingDays="data.系统.剩余天数"
      :gems="data.系统.灵石"
    />

    <!-- 区域标签 -->
    <div class="section-label">
      <div class="label-line"></div>
      <span class="label-text">宗门弟子</span>
      <div class="label-line"></div>
    </div>

    <!-- NPC 纵向卡片流 -->
    <NpcCard
      v-for="name in NPC列表"
      :key="name"
      :npc名="name"
      :data="data.NPC[name]"
      :装备="data.道具.装备[name]"
      :expanded="expandedNpc === name"
      @click="selectNpc(name)"
      @toggleExpand="toggleExpand(name)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from '../store';
import SystemBar from '../components/SystemBar.vue';
import NpcCard from '../components/NpcCard.vue';

const store = useDataStore();
const data = store.data;

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
type NpcName = typeof NPC列表[number];
const expandedNpc = ref<NpcName | null>(null);

function selectNpc(name: NpcName) {
  if (data.NPC[name].状态 === '未开始') return;
}

function toggleExpand(name: NpcName) {
  expandedNpc.value = expandedNpc.value === name ? null : name;
}
</script>
<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.home-page {
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 区域标签 */
.section-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;

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
</style>