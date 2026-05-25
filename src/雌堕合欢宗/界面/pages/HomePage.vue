<template>
  <div class="home-page scene-context-container" :data-exposure="sceneExposure">
    <!-- 区域标签 -->
    <div class="section-label">
      <div class="label-line"></div>
      <span class="label-text">{{ sceneTitle }}</span>
      <div class="label-line"></div>
    </div>

    <!-- 风声流：当前楼层只入队，下一楼层由 AI 承接 -->
    <section v-if="visibleRumors.length > 0" class="rumor-stream" aria-label="宗门风声">
      <button
        v-for="rumor in visibleRumors"
        :key="rumor.id"
        :class="['rumor-card', { 'is-pending': pendingRumorId === rumor.id, 'is-dimmed': pendingRumorId && pendingRumorId !== rumor.id }]"
        type="button"
        @click="recordRumor(rumor)"
      >
        <span class="rumor-source">{{ pendingRumorId === rumor.id ? '● 锁定' : '◎ 风声' }}</span>
        <span class="rumor-place">{{ rumor.地点 }}{{ rumor.子区域 ? '·' + rumor.子区域 : '' }}</span>
        <span class="rumor-text">{{ rumor.风声文本 }}</span>
      </button>
      <p v-if="pendingRumorId" class="rumor-pending-note">灵识已锁定该风声，将在下回对话中暗中追查。</p>
    </section>

    <!-- 心音回响：NPC 离场后仍保留已捕获/反震记录 -->
    <section v-if="visibleSoulEchoes.length > 0" class="soul-echo-stream" aria-label="心音回响">
      <button
        v-for="echo in visibleSoulEchoes"
        :key="echo.id"
        :class="['soul-echo-card', `is-${echo.result}`, { 'is-focused': focusedSoulNpc === echo.npc, 'is-new': echo.is_new }]"
        type="button"
        @click="focusSoulEcho(echo.npc)"
      >
        <span class="soul-echo-source">{{ focusedSoulNpc === echo.npc ? '● 回响' : '◎ 心音' }}</span>
        <span class="soul-echo-npc">{{ echo.npc }}</span>
        <span class="soul-echo-stage">{{ echo.stage }}</span>
        <span class="soul-echo-text">{{ echo.text }}</span>
      </button>
      <p v-if="focusedSoulNpc" class="soul-echo-note">灵识正凝于{{ focusedSoulNpc }}的心音残响。</p>
    </section>

    <!-- NPC 纵向卡片流 -->
    <TransitionGroup name="npc-flow" tag="div" class="npc-flow">
      <NpcCard
        v-for="name in visibleNpcs"
        :key="name"
        :npc名="name"
        :data="data.NPC[name]"
        :装备="data.道具.装备[name]"
        :expanded="expandedNpc === name"
        :soul-locked="focusedSoulNpc === name"
        @click="selectNpc(name)"
        @toggleExpand="toggleExpand(name)"
        @soulWhisper="recordSoulWhisper(name)"
      />
      <div v-if="visibleNpcs.length === 0" key="empty" class="scene-empty">
        <div class="scene-empty-meta">
          <span v-for="tag in sceneTags" :key="tag">[{{ tag }}]</span>
        </div>
        <p class="scene-empty-text">{{ sceneEmptyText }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDataStore } from '../store';
import NpcCard from '../components/NpcCard.vue';
import { usePendingAction } from '../composables/usePendingAction';
import { get场景NPC列表, get在场NPC列表 } from '../guards';

const props = defineProps<{
  currentScene: SceneName;
}>();

const store = useDataStore();
const data = store.data;
const { 记录追查风声 } = usePendingAction();

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
type NpcName = (typeof NPC列表)[number];
type SceneName = string;
type ShortcutSceneName = '莲灯前苑' | '醉玉小筑' | '绮梦幽阁';
type SceneExposure = '公开' | '半私密' | '私密' | '禁地';
type Rumor = {
  id: string;
  来源: string;
  地点: string;
  子区域?: string;
  相关NPC?: string[];
  风声文本: string;
  故事钩子?: string;
  状态?: string;
};

type SoulEcho = {
  id: string;
  npc: NpcName;
  text: string;
  stage: '警戒' | '动摇' | '沉沦';
  result: '捕获' | '反震' | '锁闭';
  scene?: string;
  time?: string;
  floor?: number;
  is_new?: boolean;
};

type SceneContext = {
  地点?: string;
  子区域?: string;
  公开度?: SceneExposure;
  在场NPC?: string[];
  氛围?: string[];
  故事钩子?: string[];
};

const 场景列表: Array<{ name: ShortcutSceneName; emptyText: string }> = [
  { name: '莲灯前苑', emptyText: '莲灯照影，前苑风声细碎，此刻未见熟悉身影。' },
  { name: '醉玉小筑', emptyText: '酒香犹温，小筑帘影轻垂，你等待的人尚未现身。' },
  { name: '绮梦幽阁', emptyText: '幽阁灯火低垂，此间暂归清寂，唯余心潮暗涌。' },
];

const expandedNpc = ref<NpcName | null>(null);
const pendingRumorId = ref('');


const sceneContext = computed(() => (data.系统.场景上下文 ?? {}) as SceneContext);
const presentNpcs = computed(() => get在场NPC列表(sceneContext.value));
const visibleNpcs = computed(() => {
  const present = presentNpcs.value;
  return present.length > 0 ? present : get场景NPC列表(data.NPC, props.currentScene);
});
const currentSceneConfig = computed(() => 场景列表.find(scene => scene.name === props.currentScene) ?? 场景列表[0]);
const visibleRumors = computed(() => ((data.系统.风声列表 ?? []) as Rumor[]).filter(rumor => rumor.状态 !== '已失效').slice(0, 3));
const visibleSoulEchoes = computed(() => ((data.系统.心音回响 ?? []) as SoulEcho[]).filter(echo => echo.text?.trim()).slice(-3).reverse());
const focusedSoulNpc = computed<NpcName | ''>(() => {
  const focused = data.系统.当前聚焦心声NPC ?? '';
  return NPC列表.includes(focused as NpcName) ? (focused as NpcName) : '';
});
const sceneExposure = computed<SceneExposure>(() => sceneContext.value.公开度 ?? '公开');
const sceneTitle = computed(() => {
  const place = sceneContext.value.地点 || props.currentScene;
  return sceneContext.value.子区域 ? `${place}·${sceneContext.value.子区域}` : place;
});
const sceneTags = computed(() => {
  const tags = sceneContext.value.氛围?.filter(Boolean) ?? [];
  return tags.length > 0 ? tags.slice(0, 3) : ['宿墨未干', '幽香留存'];
});
const sceneEmptyText = computed(() => sceneContext.value.故事钩子?.find(Boolean) ?? currentSceneConfig.value.emptyText);

function updateNarrativeEntryStatus(rumorId: string, status: '可追查' | '追查中') {
  const storyState = (data.剧情 as any).线索状态;
  if (!storyState) return;
  const entry = Object.values(storyState).find((item: any) => item?.风声ID === rumorId) as { 状态?: string } | undefined;
  if (entry) entry.状态 = status;
}

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

function clearPendingSoulWhisper(target?: NpcName) {
  data.系统.待处理交互 = (data.系统.待处理交互 ?? []).filter((action: { 类型?: string; 目标?: string }) => {
    if (action.类型 !== '灵识窃取') return true;
    return target ? action.目标 !== target : false;
  });
}

function focusSoulEcho(name: NpcName) {
  data.系统.当前聚焦心声NPC = focusedSoulNpc.value === name ? '' : name;
}

function recordSoulWhisper(name: NpcName) {
  clearPendingSoulWhisper(name);
  focusSoulEcho(name);
}

function recordRumor(rumor: Rumor) {
  if (pendingRumorId.value === rumor.id) {
    pendingRumorId.value = '';
    data.系统.待处理交互 = (data.系统.待处理交互 ?? []).filter((action: { 风声ID?: string }) => action.风声ID !== rumor.id);
    updateNarrativeEntryStatus(rumor.id, '可追查');
    return;
  }

  pendingRumorId.value = rumor.id;
  data.系统.待处理交互 = (data.系统.待处理交互 ?? []).filter((action: { 类型?: string }) => action.类型 !== '追查风声');
  updateNarrativeEntryStatus(rumor.id, '追查中');
  记录追查风声(rumor);
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

.scene-context-container {
  position: relative;
  min-height: 100%;
  isolation: isolate;
  transition: background 1.2s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 1.2s cubic-bezier(0.25, 0.8, 0.25, 1);

  &::before {
    content: "";
    position: absolute;
    inset: -8px -10px;
    z-index: -1;
    opacity: 0;
    pointer-events: none;
    background: transparent;
    transition: opacity 1.2s cubic-bezier(0.25, 0.8, 0.25, 1), background 1.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  &[data-exposure='公开'] {
    background: radial-gradient(ellipse at top, rgba(224, 168, 96, 0.045), transparent 62%);
  }

  &[data-exposure='半私密'] {
    background: radial-gradient(ellipse at 50% 0%, rgba(191, 161, 122, 0.055), transparent 66%);
  }

  &[data-exposure='私密'] {
    background: radial-gradient(circle at center, transparent 42%, rgba(16, 12, 24, 0.38) 100%);
  }

  &[data-exposure='禁地'] {
    background:
      radial-gradient(circle at 50% 42%, rgba(44, 18, 58, 0.16), transparent 48%),
      radial-gradient(ellipse at bottom, rgba(8, 32, 24, 0.24), transparent 72%);
    box-shadow: inset 0 0 44px rgba(8, 24, 18, 0.28);
  }

  &[data-exposure='禁地']::before {
    opacity: 1;
    background:
      radial-gradient(circle at 18% 18%, rgba(156, 44, 49, 0.09), transparent 34%),
      radial-gradient(circle at 82% 72%, rgba(64, 96, 78, 0.12), transparent 38%),
      linear-gradient(135deg, rgba(8, 12, 10, 0.34), rgba(44, 18, 58, 0.16), rgba(8, 12, 10, 0.28));
    animation: forbidden-veil 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
  }
}

.rumor-stream {
  display: flex;
  flex-direction: column;
  gap: 5px;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.rumor-card {
  width: 100%;
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border: none;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
  color: color-mix(in srgb, var(--theme-text-primary, #d9b48f) 84%, #fff2dc);
  text-align: left;
  cursor: pointer;
  background:
    radial-gradient(ellipse at 18% 50%, color-mix(in srgb, var(--theme-accent, #d9b48f) 12%, transparent), transparent 60%),
    linear-gradient(90deg, transparent, var(--hh-bg-card), transparent);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.95), 0 0 10px color-mix(in srgb, var(--hh-glow-color, rgba(217, 180, 143, 0.32)) 40%, transparent);
  transition: opacity 0.4s ease, transform 0.4s ease, color 0.4s ease, filter 0.4s ease;

  &:hover {
    transform: translateX(6px);
    color: var(--theme-gold);
    filter: drop-shadow(0 0 12px var(--hh-glow-color));
  }

  &.is-pending {
    color: var(--theme-gold);
    font-weight: 700;
    border-bottom-color: rgba(224, 168, 96, 0.3);
  }

  &.is-dimmed {
    opacity: 0.2;
  }
}

.rumor-source,
.rumor-place {
  font-size: 10px;
  color: color-mix(in srgb, var(--theme-text-primary, #d9b48f) 66%, transparent);
  white-space: nowrap;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.9);
}

.rumor-place {
  color: color-mix(in srgb, var(--theme-accent, #d9b48f) 88%, #fff5e8);
  text-shadow: 0 0 10px color-mix(in srgb, var(--theme-accent, #d9b48f) 34%, transparent);
}

.rumor-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: color-mix(in srgb, var(--theme-text-primary, #d9b48f) 88%, #fff5e8);
  text-shadow: 0 0 12px rgba(0, 0, 0, 0.96), 0 0 10px color-mix(in srgb, var(--hh-glow-color, rgba(217, 180, 143, 0.32)) 45%, transparent);
}

.soul-echo-stream {
  display: flex;
  flex-direction: column;
  gap: 5px;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.soul-echo-card {
  width: 100%;
  display: grid;
  grid-template-columns: auto auto auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border: none;
  border-bottom: 1px solid color-mix(in srgb, var(--hh-accent) 22%, transparent);
  color: #d9b48f;
  color: var(--hh-text-primary, #d9b48f);
  color: color-mix(in srgb, var(--theme-text-primary, #d9b48f) 82%, #fff2dc);
  text-align: left;
  cursor: pointer;
  background:
    radial-gradient(ellipse at 18% 50%, color-mix(in srgb, var(--hh-accent) 16%, transparent), transparent 62%),
    linear-gradient(90deg, transparent, var(--hh-bg-card), transparent);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
  letter-spacing: 2px;
  text-shadow: 0 0 12px rgba(0, 0, 0, 0.96), 0 0 10px color-mix(in srgb, var(--hh-glow-color, rgba(224, 179, 177, 0.28)) 44%, transparent);
  transition: opacity 0.4s ease, transform 0.4s ease, color 0.4s ease, filter 0.4s ease;

  &:hover,
  &.is-focused {
    transform: translateX(6px);
    color: #9c2c31;
    color: var(--hh-accent, #9c2c31);
    filter: drop-shadow(0 0 12px var(--hh-glow-color));
  }

  &.is-new {
    box-shadow: inset 0 0 18px color-mix(in srgb, var(--hh-accent) 10%, transparent);
  }

  &.is-反震 {
    color: #ffd8d2;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(156, 44, 49, 0.22), transparent 62%),
      linear-gradient(90deg, transparent, var(--hh-bg-card), transparent);
  }

  &.is-锁闭 {
    filter: grayscale(0.6) brightness(0.75);
  }
}

.soul-echo-source,
.soul-echo-npc,
.soul-echo-stage {
  font-size: 10px;
  color: #bfa17a;
  color: var(--hh-text-secondary, #bfa17a);
  color: color-mix(in srgb, var(--theme-text-primary, #d9b48f) 70%, transparent);
  white-space: nowrap;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.92);
}

.soul-echo-npc {
  color: #9c2c31;
  color: var(--hh-accent, #9c2c31);
  color: color-mix(in srgb, var(--theme-accent, #d9b48f) 90%, #fff5e8);
  text-shadow: 0 0 10px color-mix(in srgb, var(--theme-accent, #d9b48f) 36%, transparent);
}

.soul-echo-stage {
  color: #9c2c31;
  color: var(--hh-accent, #9c2c31);
  color: color-mix(in srgb, var(--hh-accent, #e0b3b1) 90%, #fff4f0);
  text-shadow: 0 0 10px color-mix(in srgb, var(--hh-accent, #e0b3b1) 34%, transparent);
}

.soul-echo-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: #d9b48f;
  color: var(--hh-text-primary, #d9b48f);
  color: color-mix(in srgb, var(--theme-text-primary, #d9b48f) 90%, #fff7ef);
  text-shadow: 0 0 12px rgba(0, 0, 0, 0.96), 0 0 12px color-mix(in srgb, var(--hh-accent, #e0b3b1) 28%, transparent);
}

.soul-echo-note {
  margin: 0;
  padding: 2px 18px 0;
  text-align: right;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
  font-size: 10px;
  letter-spacing: 3px;
  color: #9c2c31;
  color: var(--hh-accent, #9c2c31);
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.9), 0 0 10px var(--hh-glow-color, rgba(156, 44, 49, 0.35));
  animation: pending-note-drift 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.rumor-pending-note {
  margin: 0;
  padding: 2px 18px 0;
  text-align: right;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--theme-text-muted);
  animation: pending-note-drift 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.npc-flow {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scene-empty {
  min-height: 180px;
  padding: 18px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 12px;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
  color: var(--theme-text-muted);
  background:
    radial-gradient(ellipse at 50% 35%, var(--hh-bg-card), transparent 62%),
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.025), transparent);
}

.scene-empty-meta {
  align-self: end;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 10px;
  letter-spacing: 3px;
}

.scene-empty-text {
  max-height: 150px;
  margin: 0;
  writing-mode: vertical-rl;
  line-height: 1.9;
  letter-spacing: 4px;
  color: rgba(184, 194, 198, 0.68);
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

@keyframes forbidden-veil {
  0% { opacity: 0.72; transform: scale(0.995); }
  100% { opacity: 1; transform: scale(1.01); }
}

@keyframes pending-note-drift {
  from { opacity: 0; transform: translateX(8px); filter: blur(3px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
}
</style>
