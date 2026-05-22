<template>
  <div class="home-page">
    <!-- 区域标签 -->
    <div class="section-label">
      <div class="label-line"></div>
      <span class="label-text">宗门弟子</span>
      <div class="label-line"></div>
    </div>

    <!-- NPC 纵向卡片流 -->
    <TransitionGroup name="npc-flow" tag="div" class="npc-flow">
      <NpcCard
        v-for="name in visibleNpcs"
        :key="name"
        :npc名="name"
        :data="data.NPC[name]"
        :装备="data.道具.装备[name]"
        :expanded="expandedNpc === name"
        @click="selectNpc(name)"
        @toggleExpand="toggleExpand(name)"
        @soulWhisper="recordSoulWhisper(name)"
      />
      <div v-if="visibleNpcs.length === 0" key="empty" class="scene-empty">
        {{ currentSceneConfig.emptyText }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDataStore } from '../store';
import NpcCard from '../components/NpcCard.vue';
import { usePendingAction } from '../composables/usePendingAction';
import { get场景NPC列表 } from '../guards';

const props = defineProps<{
  currentScene: SceneName;
}>();

const store = useDataStore();
const data = store.data;
const { 记录灵识窃取 } = usePendingAction();

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
type NpcName = (typeof NPC列表)[number];
type SceneName = '莲灯前苑' | '醉玉小筑' | '绮梦幽阁';

const 场景列表: Array<{ name: SceneName; emptyText: string }> = [
  { name: '莲灯前苑', emptyText: '莲灯照影，前苑风声细碎，此刻未见熟悉身影。' },
  { name: '醉玉小筑', emptyText: '酒香犹温，小筑帘影轻垂，你等待的人尚未现身。' },
  { name: '绮梦幽阁', emptyText: '幽阁灯火低垂，此间暂归清寂，唯余心潮暗涌。' },
];

const expandedNpc = ref<NpcName | null>(null);

const visibleNpcs = computed(() => get场景NPC列表(data.NPC, props.currentScene));
const currentSceneConfig = computed(() => 场景列表.find(scene => scene.name === props.currentScene) ?? 场景列表[0]);

watch(visibleNpcs, npcs => {
  if (expandedNpc.value && !npcs.includes(expandedNpc.value)) {
    expandedNpc.value = null;
  }
});

function selectNpc(name: NpcName) {
  if (data.NPC[name].状态 === '未开始') return;
}

function toggleExpand(name: NpcName) {
  expandedNpc.value = expandedNpc.value === name ? null : name;
}

function recordSoulWhisper(name: NpcName) {
  记录灵识窃取(name);
}
</script>
<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.home-page {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.npc-flow {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scene-empty {
  padding: 26px 18px;
  text-align: center;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
  letter-spacing: 4px;
  line-height: 1.8;
  color: var(--theme-text-muted);
  background: radial-gradient(ellipse at 50% 50%, var(--hh-bg-card), transparent 70%);
}

.npc-flow-enter-active,
.npc-flow-leave-active {
  transition: opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), filter 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.npc-flow-enter-from {
  opacity: 0;
  transform: translateX(18px);
  filter: blur(5px);
}

.npc-flow-leave-to {
  opacity: 0;
  transform: scale(0.95);
  filter: blur(3px);
}

/* 区域标签 */
.section-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;

  .label-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--theme-border), transparent);
  }

  .label-text {
    font-family: $font-铭文;
    font-size: 12px;
    color: var(--theme-text-muted);
    letter-spacing: 4px;
  }
}
</style>