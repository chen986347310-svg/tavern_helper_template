<template>
  <div
    :class="['npc-strip', statusClass, { expanded: expanded }]" :data-npc="npc名 === '白芷' ? 'baiji' : npc名 === '苏芸' ? 'suyun' : npc名 === '纪兰' ? 'jilan' : npc名 === '沈月秋' ? 'shenyueqiu' : 'liuyuyi'"
    :style="{ '--npc-color': npcColor, '--npc-color-dark': npcColorDark, '--fav-value': favorValue }"
    @click="handleClick"
  >
    <!-- 金印封章 (已攻略状态) -->
    <div v-if="data.状态 === '已完成'" class="seal-badge">
      <span class="seal-text">已攻略</span>
    </div>

    <!-- 角落装饰 (已攻略状态) -->
    <template v-if="data.状态 === '已完成'">
      <div class="card-corner top-left"></div>
      <div class="card-corner top-right"></div>
      <div class="card-corner bottom-left"></div>
      <div class="card-corner bottom-right"></div>
    </template>

    <!-- 头像图片区 (响应式宽度, mask渐融) -->
    <div :class="['avatar-zone', { 'img-loaded': imageLoaded }]">
      <img
        v-if="avatarSrc && !imageError"
        :src="avatarSrc"
        class="avatar-img"
        @load="imageLoaded = true"
        @error="imageError = true"
      />
      <span v-if="!avatarSrc || imageError" class="avatar-fallback">{{ npc名[0] }}</span>
    </div>

    <!-- 文字信息区 -->
    <div :class="['text-zone', { 'text-fade': expanded }]">
      <div class="strip-name">{{ npc名 }}</div>
      <div class="strip-status">
        <span class="status-dot"></span>
        {{ data.状态 }}
      </div>
      <div
        v-if="data.状态 === '进行中'"
        class="strip-favor npc-disk-collapsed"
        :data-favor-tier="collapsedFavorTier"
        :aria-label="'灵犀命魂 ' + get灵犀等级(data.好感度)"
      >
        <span class="collapsed-soul-aura" aria-hidden="true"></span>
        <span class="favor-value">{{ get灵犀等级(data.好感度) }}</span>
      </div>
    </div>

    <!-- 展开区域 (进度条 + 装备) -->
    <div :class="['card-expand', { expanded: expanded }]">
      <div class="expand-inner">
        <div
          :class="['dual-ring-panel', probeStateClass, { 'soul-backlash': backlashVisible, 'destiny-assimilated': isDestinyAssimilated, 'soul-locked': soulLocked, 'npc-disk-unstable': isSoulTideActive }]"
          :data-effect="isDestinyAssimilated ? 'destiny-assimilated' : undefined"
          data-ring-style="totem"
          :data-tide="isSoulTideActive ? 'unstable' : undefined"
          :data-pending="soulLocked ? 'soul-whisper' : undefined"
          :data-probe-state="probeState"
          :data-favor-percent="favorPercent"
          :data-conquest-percent="conquestPercent"
          aria-hidden="true"
          @click.stop="handleSoulWhisper"
        >
          <span class="ring-totem-shards" aria-hidden="true"></span>
          <span class="destiny-taiji-core" aria-hidden="true"></span>
          <span v-if="isSoulTideActive" class="soul-glyph-fragments" aria-hidden="true">心 魄 念</span>
          <span v-if="soulLocked" class="soul-thread-line" aria-hidden="true"></span>
          <svg class="dual-ring" viewBox="0 0 64 64">
            <circle class="ring-track outer" cx="32" cy="32" r="26" />
            <circle
              :class="['ring-value', 'favor', 'outer-ring', { 'ink-burst': favorBurst }]"
              cx="32"
              cy="32"
              r="26"
              :stroke-dasharray="outerRingCircumference"
              :stroke-dashoffset="outerFavorDashOffset"
            />
            <circle class="ring-track inner" cx="32" cy="32" r="20" />
            <circle
              :class="['ring-value', 'progress', 'inner-ring', { 'ink-burst': progressBurst }]"
              cx="32"
              cy="32"
              r="20"
              :stroke-dasharray="innerRingCircumference"
              :stroke-dashoffset="innerProgressDashOffset"
            />
          </svg>
          <Transition name="ink-reveal">
            <span v-if="backlashVisible" class="backlash-hint"><span class="backlash-glitch" aria-hidden="true">纟纟露</span><span class="backlash-label">心防反震</span></span>
          </Transition>
          <Transition name="ink-reveal">
            <span v-if="soulLocked && !backlashVisible" class="soul-pending-mark">灵识窥伺</span>
          </Transition>
        </div>
        <div class="expand-row">
          <span class="expand-label">灵犀</span>
          <span class="expand-value">{{ get灵犀等级(data.好感度) }}</span>
        </div>
        <div class="expand-row">
          <span class="expand-label">蚀心</span>
          <span class="expand-value">{{ get道心侵蚀(data.攻略值) }}</span>
        </div>
        <Transition name="ink-reveal">
          <div v-if="revealedSoulWhisper" class="soul-whisper" :data-stage="data.soul_whisper?.stage">
            <span class="whisper-label">心音残片</span>
            <span class="whisper-text">{{ revealedSoulWhisper }}</span>
          </div>
        </Transition>
        <div v-if="装备 && 装备.length > 0" class="equip-section">
          <button class="equip-toggle" @click.stop="equipOpen = !equipOpen">
            佩器 <span class="equip-arrow">{{ equipOpen ? '▴' : '▾' }}</span>
          </button>
          <div :class="['equip-list', { open: equipOpen }]">
            <div class="equip-inner">
              <span v-for="item in displayEquipment" :key="item" class="equip-item">{{ getItemDisplayName(item) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="equip-empty">未供法器</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';

import { get灵犀等级, get道心侵蚀 } from '../composables/useStatusText';
import { getItemDisplayName, sortEquipmentForDisplay } from '../data/itemDisplay';

import avatar白芷 from '../assets/avatars/白芷.png';
import avatar白芷_fallen from '../assets/avatars/白芷_fallen.png';
import avatar苏芸 from '../assets/avatars/苏芸.png';
import avatar苏芸_fallen from '../assets/avatars/苏芸_fallen.png';
import avatar纪兰 from '../assets/avatars/纪兰.png';
import avatar纪兰_fallen from '../assets/avatars/纪兰_fallen.png';
import avatar沈月秋 from '../assets/avatars/沈月秋.png';
import avatar沈月秋_fallen from '../assets/avatars/沈月秋_fallen.png';
import avatar柳素衣 from '../assets/avatars/柳素衣.png';
import avatar柳素衣_fallen from '../assets/avatars/柳素衣_fallen.png';

type NpcName = '白芷' | '苏芸' | '纪兰' | '沈月秋' | '柳素衣';
type SoulProbeState = '无波动' | '可窥探' | '已捕获' | '反震' | '锁闭';

const AVATAR_MAP: Record<NpcName, { normal: string; fallen: string }> = {
  白芷: { normal: avatar白芷, fallen: avatar白芷_fallen },
  苏芸: { normal: avatar苏芸, fallen: avatar苏芸_fallen },
  纪兰: { normal: avatar纪兰, fallen: avatar纪兰_fallen },
  沈月秋: { normal: avatar沈月秋, fallen: avatar沈月秋_fallen },
  柳素衣: { normal: avatar柳素衣, fallen: avatar柳素衣_fallen },
};

const NPC_COLORS: Record<NpcName, string> = {
  白芷: '#a8c4e0',
  苏芸: '#e0a860',
  纪兰: '#b088d4',
  沈月秋: '#d46048',
  柳素衣: '#e8e0d0',
};

const props = defineProps<{
  npc名: NpcName;
  data: { 好感度: number; 攻略值: number; 状态: string; 心声探测态?: SoulProbeState; soul_whisper?: { text?: string; stage?: '警戒' | '动摇' | '沉沦'; is_revealed?: boolean } };
  装备?: string[];
  expanded?: boolean;
  soulLocked?: boolean;
}>();

const emit = defineEmits<{
  click: [];
  toggleExpand: [];
  soulWhisper: [];
}>();

const equipOpen = ref(false);
const imageLoaded = ref(false);
const imageError = ref(false);

const favorBurst = ref(false);
const progressBurst = ref(false);
let favorBurstTimer: ReturnType<typeof setTimeout> | undefined;
let progressBurstTimer: ReturnType<typeof setTimeout> | undefined;

watch(() => props.data?.好感度, (newVal, oldVal) => {
  if (newVal === oldVal) return;
  favorBurst.value = true;
  if (favorBurstTimer) clearTimeout(favorBurstTimer);
  favorBurstTimer = setTimeout(() => { favorBurst.value = false; }, 800);
});

watch(() => props.data?.攻略值, (newVal, oldVal) => {
  if (newVal === oldVal) return;
  progressBurst.value = true;
  if (progressBurstTimer) clearTimeout(progressBurstTimer);
  progressBurstTimer = setTimeout(() => { progressBurst.value = false; }, 800);
});
const backlashVisible = ref(false);
let backlashTimer: ReturnType<typeof setTimeout> | undefined;

const statusClass = computed(() => {
  switch (props.data.状态) {
    case '已完成': return 'completed';
    case '进行中': return 'active';
    default: return 'locked';
  }
});



const NPC_COLORS_DARK: Record<NpcName, string> = {
  白芷: '#4a7a9b',
  苏芸: '#8b5e0f',
  纪兰: '#6a3d8a',
  沈月秋: '#a03020',
  柳素衣: '#6b5b3a',
};
const npcColor = computed(() => NPC_COLORS[props.npc名] || '#d4a017');
const npcColorDark = computed(() => NPC_COLORS_DARK[props.npc名] || '#8b5e0f');
const favorPercent = computed(() => Math.min(Math.max(props.data.好感度 ?? 0, 0), 100));
const conquestPercent = computed(() => Math.min(Math.max(props.data.攻略值 ?? 0, 0), 100));
const favorValue = computed(() => String(favorPercent.value));
const collapsedFavorTier = computed(() => {
  const value = Number(favorValue.value);
  if (value <= 0) return 'dormant';
  if (value < 41) return 'faint';
  if (value < 81) return 'flowing';
  return 'resonant';
});
const outerRingCircumference = '163.36';
const innerRingCircumference = '125.66';

function getRingDashOffset(value: number, circumference: number): string {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (circumference * (1 - clamped / 100)).toFixed(2);
}
const outerFavorDashOffset = computed(() => getRingDashOffset(favorPercent.value, 163.36));
const innerProgressDashOffset = computed(() => getRingDashOffset(conquestPercent.value, 125.66));
const isDestinyAssimilated = computed(() => conquestPercent.value >= 100 || props.data.状态 === '已完成');
const revealedSoulWhisper = computed(() => {
  const whisper = props.data.soul_whisper;
  if (!whisper?.is_revealed) return '';
  return whisper.text?.trim() ?? '';
});

const soulLocked = computed(() => props.soulLocked === true);
const probeState = computed<SoulProbeState>(() => props.data.心声探测态 ?? '无波动');
const probeStateClass = computed(() => (probeState.value === '无波动' ? '' : `probe-${probeState.value}`));
const hasBacklashRisk = computed(() => props.data.攻略值 < 40 || props.data.soul_whisper?.stage === '警戒');
const isSoulTideActive = computed(() => props.data.状态 === '进行中' && !soulLocked.value && !isDestinyAssimilated.value && (probeState.value === '可窥探' || probeState.value === '已捕获'));

const avatarSrc = computed(() => {
  const map = AVATAR_MAP[props.npc名];
  return props.data.状态 === '已完成' ? map.fallen : map.normal;
});

const displayEquipment = computed(() => sortEquipmentForDisplay(props.装备 ?? []));

function handleClick() {
  if (props.data.状态 === '未开始') return;
  emit('click');
  emit('toggleExpand');
}

function handleSoulWhisper() {
  if (props.data.状态 === '未开始') return;
  if (hasBacklashRisk.value) {
    backlashVisible.value = true;
    if (backlashTimer) clearTimeout(backlashTimer);
    backlashTimer = setTimeout(() => {
      backlashVisible.value = false;
    }, 900);
  }
  emit('soulWhisper');
}

onUnmounted(() => {
  if (backlashTimer) clearTimeout(backlashTimer);
});
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

/* NPC 水平横条 */
.npc-strip {
  position: relative;
  --npc-accent: var(--npc-color);
  border: 1px solid var(--theme-border);
  border-radius: $radius-md;
  transition: all 0.35s ease;
  overflow: hidden;
  border: none;
  box-shadow: none;
  /* stone texture */
  background: linear-gradient(135deg, rgba(40,30,20,0.6) 0%, rgba(20,15,10,0.8) 100%);
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;

  &.locked {
    filter: grayscale(100%) brightness(0.4);
    pointer-events: none;
  }

  &.active {
    @include breathing-glow(var(--npc-color));
    cursor: pointer;
  }

  &.completed {
    filter: brightness(1.1);
    box-shadow: $shadow-金色发光强;
    cursor: pointer;
  }

  &:hover:not(.locked) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }

  /* 展开态: aspect-ratio 变化 */
  &.expanded {
    /* 不用 flex-direction: column, 它无法动画会导致跳变 */
  }
}

/* 头像区域 (响应式宽度, 渐融遮罩) */
.avatar-zone {
  width: 25%;
  min-width: 60px;
  max-width: 120px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  transition: width 0.55s ease-out, max-width 0.55s ease-out;

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: none;
    width: 280px;
    height: 280px;
    object-position: center 18%;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &.img-loaded .avatar-img {
    opacity: 1;
  }

  .avatar-fallback {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 100%;
     height: 100%;
     font-family: $font-铭文;
     font-size: 20px;
     font-weight: 700;
     color: var(--npc-color);
     text-shadow: 0 0 8px var(--hh-gold-glow);
    min-height: 0;
     background: linear-gradient(135deg, var(--hh-gold-glow), transparent);
  }

  .locked & .avatar-img {
    filter: grayscale(100%) brightness(0.4);
  }

  /* 折叠态: 右边缘渐融 (伪元素叠加层) */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to left, rgba(26, 18, 12, 1), transparent 50%);
    opacity: 1;
    transition: opacity 0.55s ease-out;
    pointer-events: none;
    z-index: 1;
  }

  /* 展开态: 底部暗色叠加层 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to bottom, transparent, rgba(26, 18, 12, 0.85));
    opacity: 0;
    transition: opacity 0.55s ease-out;
    pointer-events: none;
    z-index: 1;
  }

  .expanded & {
    transition: width 0.35s ease-in-out, max-width 0.35s ease-in-out;
    width: 100%;
    max-width: none;
  }

  .expanded & .avatar-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    object-position: center 20%;
  }

  .expanded &::before {
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
  }

  .expanded &::after {
    transition: opacity 0.3s ease-in-out;
    opacity: 1;
  }
}

/* 文字信息区 */
.text-zone {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  padding: 4px 12px;
  min-height: 0;
  transition: opacity 0.35s ease;

  &.text-fade {
    opacity: 0;
    height: 0;
    padding: 0 12px;
    overflow: hidden;
  }

  .strip-name {
    font-family: $font-铭文;
    font-size: 42pt;
    margin-top: -48px;
    font-family: "Huiwen-mincho", STXingkai, KaiTi, serif;
    color: var(--theme-text-primary);
    letter-spacing: 4px;
  }

  .strip-status {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-family: KaiTi, STKaiti, serif;
    color: var(--theme-text-secondary);

    .status-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--hh-text-muted);
    }
  }
}

/* 横条内命魂光晕 */
.strip-favor {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  min-width: 86px;
  position: relative;
  isolation: isolate;

  .collapsed-soul-aura {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    position: relative;
    border-radius: 50%;
    background:
      radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--npc-color) 45%, transparent) 0%, transparent 36%),
      radial-gradient(circle at 50% 50%, rgba(18, 10, 10, 0.8) 0%, rgba(18, 10, 10, 0.15) 70%, transparent 100%);
    box-shadow:
      0 0 calc(var(--fav-value, 0) * 0.18px + 4px) color-mix(in srgb, var(--npc-color) calc(var(--fav-value, 0) * 0.45%), transparent),
      inset 0 0 10px rgba(0, 0, 0, 0.48);
    opacity: calc(var(--fav-value, 0) * 0.006 + 0.22);
    transition: box-shadow 0.6s var(--hh-easing-rescale, cubic-bezier(0.4, 0, 0.2, 1)), opacity 0.6s var(--hh-easing-rescale, cubic-bezier(0.4, 0, 0.2, 1));
    animation: collapsed-soul-breath 10s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
  }

  .collapsed-soul-aura::after {
    content: '';
    position: absolute;
    inset: 5px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--npc-color) 52%, transparent);
    filter: blur(2px);
    opacity: 0.42;
  }

  .favor-value {
    font-family: $font-铭文;
    font-size: 11px;
    color: color-mix(in srgb, var(--npc-color) 64%, var(--hh-gold));
    min-width: 44px;
    text-align: right;
    letter-spacing: 2px;
    text-shadow: 0 0 calc(var(--fav-value, 0) * 0.08px + 4px) color-mix(in srgb, var(--npc-color) 28%, transparent);
  }

  &[data-favor-tier='dormant'] .collapsed-soul-aura {
    opacity: 0.16;
    filter: grayscale(0.8) brightness(0.65);
  }

  &[data-favor-tier='resonant'] .collapsed-soul-aura {
    opacity: 0.92;
    animation-duration: 7s;
  }
}

.ring-track,
.ring-value {
  fill: none;
  stroke-linecap: round;
}

.ring-track {
  stroke: var(--hh-border);
  stroke-width: 2;
  opacity: 0.35;
}

.ring-value {
  transition: stroke-dashoffset 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;

  &.favor {
    stroke: var(--npc-color);
    stroke-width: 2.2;
    filter: drop-shadow(0 0 8px color-mix(in srgb, var(--npc-color) 35%, transparent));
  }

  &.favor.outer-ring {
    stroke-width: 2.4;
  }

  &.progress {
    stroke: var(--hh-accent);
    stroke-width: 2.4;
    filter: drop-shadow(0 0 10px var(--hh-glow-color));
  }

  &.progress.inner-ring {
    stroke-width: 2.4;
  }
}

.dual-ring-panel {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 4px 0 2px;

  .ring-totem-shards {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 72px;
    height: 72px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    pointer-events: none;
    opacity: 0.5;
    background:
      repeating-conic-gradient(from 8deg, color-mix(in srgb, var(--npc-color) 34%, transparent) 0 5deg, transparent 5deg 15deg),
      radial-gradient(circle, transparent 58%, color-mix(in srgb, var(--hh-text-highlight) 18%, transparent) 60%, transparent 64%);
    filter: blur(0.2px) drop-shadow(0 0 8px color-mix(in srgb, var(--npc-color) 22%, transparent));
    mask-image: radial-gradient(circle, transparent 42%, black 46%, black 66%, transparent 70%);
    -webkit-mask-image: radial-gradient(circle, transparent 42%, black 46%, black 66%, transparent 70%);
  }

  .destiny-taiji-core {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 30px;
    height: 30px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    pointer-events: none;
    background:
      radial-gradient(circle at 50% 25%, color-mix(in srgb, var(--npc-color) 72%, #f7efe2) 0 13%, transparent 14%),
      radial-gradient(circle at 50% 75%, rgba(156, 44, 49, 0.82) 0 13%, transparent 14%),
      conic-gradient(from 90deg, color-mix(in srgb, var(--npc-color) 54%, rgba(8, 12, 10, 0.92)) 0 50%, rgba(156, 44, 49, 0.62) 50% 100%);
    box-shadow:
      inset 0 0 10px rgba(0, 0, 0, 0.62),
      0 0 14px color-mix(in srgb, var(--npc-color) 28%, transparent);
    opacity: 0.78;
    animation: taiji-core-spin 20s linear infinite;
  }

  .soul-glyph-fragments {
    position: absolute;
    inset: -2px 0 auto;
    text-align: center;
    font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
    font-size: 9px;
    letter-spacing: 6px;
    color: color-mix(in srgb, var(--npc-color) 60%, transparent);
    opacity: 0.28;
    pointer-events: none;
    animation: soul-glyph-flicker 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
  }

  .soul-thread-line {
    position: absolute;
    left: 50%;
    top: 6px;
    width: 2px;
    height: 52px;
    transform: translateX(-50%) rotate(18deg);
    border-radius: 999px;
    background: linear-gradient(to bottom, transparent, rgba(156, 44, 49, 0.95), transparent);
    box-shadow: 0 0 16px rgba(156, 44, 49, 0.55);
    pointer-events: none;
    animation: soul-thread-bind 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
  }

  &.npc-disk-unstable {
    animation: tide-pulse 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;

    .dual-ring {
      animation: ring-glitch 8s linear infinite, soul-ring-breathe 4s ease-in-out infinite;
    }

    .ring-value {
      stroke-dasharray: 12 6;
    }
  }

  &.soul-backlash {
    .ring-totem-shards,
    .destiny-taiji-core {
      animation: disk-backlash-shake 0.42s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dual-ring {
      animation: ring-backlash-shake 0.42s cubic-bezier(0.4, 0, 0.2, 1), soul-ring-breathe 4s ease-in-out infinite;
    }
  }

  &.probe-可窥探 {
    .ring-totem-shards { opacity: 0.72; }
    .dual-ring { filter: drop-shadow(0 0 16px color-mix(in srgb, var(--npc-color) 36%, transparent)); }
  }

  &.probe-已捕获 {
    .ring-totem-shards {
      opacity: 0.88;
      filter: blur(0.1px) drop-shadow(0 0 14px color-mix(in srgb, var(--hh-text-highlight) 32%, transparent));
    }

    .dual-ring {
      filter: drop-shadow(0 0 18px color-mix(in srgb, var(--hh-text-highlight) 38%, transparent));
    }
  }

  &.probe-反震 {
    .ring-totem-shards,
    .destiny-taiji-core {
      animation: disk-backlash-shake 0.56s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dual-ring {
      animation: ring-backlash-shake 0.56s cubic-bezier(0.4, 0, 0.2, 1), soul-ring-breathe 4s ease-in-out infinite;
    }

    .dual-ring {
      filter: grayscale(0.2) drop-shadow(0 0 18px rgba(156, 44, 49, 0.45));
    }
  }

  &.probe-锁闭 {
    filter: grayscale(0.72) brightness(0.68);

    .dual-ring {
      animation: none;
      opacity: 0.5;
    }

    .ring-totem-shards { opacity: 0.2; }
  }

  &.soul-locked {
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 7px;
      width: 1px;
      height: 50px;
      transform: translateX(-50%) rotate(18deg);
      background: linear-gradient(to bottom, transparent, rgba(156, 44, 49, 0.88), transparent);
      box-shadow: 0 0 12px rgba(156, 44, 49, 0.5);
      pointer-events: none;
      animation: soul-thread-bind 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
    }

    .dual-ring {
      filter: drop-shadow(0 0 14px rgba(156, 44, 49, 0.38));
    }
  }

  &.destiny-assimilated {
    &::before {
      content: '';
      position: absolute;
      inset: 2px 50%;
      width: 70px;
      transform: translateX(-50%);
      border-radius: 50%;
      background:
        radial-gradient(circle, rgba(156, 44, 49, 0.26) 0%, rgba(156, 44, 49, 0.12) 36%, transparent 72%),
        conic-gradient(from 120deg, transparent, rgba(156, 44, 49, 0.34), transparent, color-mix(in srgb, var(--npc-color) 24%, transparent), transparent);
      filter: blur(10px);
      opacity: 0.82;
      pointer-events: none;
      animation: destiny-assimilate-halo 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite alternate;
    }

    .dual-ring {
      animation: destiny-ring-merge 20s linear infinite;
    }

    .destiny-taiji-core {
      background:
        radial-gradient(circle, rgba(156, 44, 49, 0.92) 0 20%, transparent 21%),
        conic-gradient(from 90deg, rgba(156, 44, 49, 0.78), color-mix(in srgb, var(--npc-color) 28%, rgba(156, 44, 49, 0.82)), rgba(156, 44, 49, 0.78));
      box-shadow: 0 0 18px rgba(156, 44, 49, 0.5), inset 0 0 12px rgba(0, 0, 0, 0.72);
    }

    .ring-track {
      stroke: rgba(156, 44, 49, 0.28);
      opacity: 0.55;
    }

    .ring-value.favor.outer-ring,
    .ring-value.progress.inner-ring {
      stroke: #9c2c31;
      filter: drop-shadow(0 0 14px rgba(156, 44, 49, 0.42));
      animation: destiny-assimilate 1.5s cubic-bezier(0.23, 1, 0.32, 1) infinite alternate;
    }

    .ring-value.favor.outer-ring {
      opacity: 0.78;
      stroke: color-mix(in srgb, #9c2c31 82%, var(--npc-color));
    }
  }
}

.backlash-hint,
.soul-pending-mark {
  position: absolute;
  left: 50%;
  bottom: -13px;
  transform: translateX(-50%);
  z-index: 5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 58px;
  padding: 2px 8px 3px;
  white-space: nowrap;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 4px;
  color: #f6dfc5;
  background:
    linear-gradient(to right, transparent, rgba(18, 10, 10, 0.86) 18%, rgba(18, 10, 10, 0.92) 82%, transparent),
    radial-gradient(ellipse at 50% 50%, rgba(156, 44, 49, 0.35), transparent 72%);
  border: 1px solid color-mix(in srgb, var(--hh-text-highlight, #e0b3b1) 42%, transparent);
  border-left-color: transparent;
  border-right-color: transparent;
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.95),
    0 0 10px var(--hh-glow-color, rgba(224, 179, 177, 0.35)),
    0 0 18px color-mix(in srgb, var(--npc-color) 40%, transparent);
  box-shadow: 0 0 14px rgba(156, 44, 49, 0.28);
  pointer-events: none;
  backdrop-filter: blur(2px);
  mask-image: linear-gradient(to right, transparent, black 14%, black 86%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 14%, black 86%, transparent);
}

.soul-pending-mark {
  bottom: -17px;
  color: color-mix(in srgb, var(--hh-text-highlight, #e0b3b1) 72%, #fff4e8);
}

.backlash-hint {
  min-width: 72px;
  color: #ffd8d2;
  background:
    linear-gradient(to right, transparent, rgba(28, 6, 6, 0.9) 18%, rgba(46, 10, 10, 0.94) 82%, transparent),
    radial-gradient(ellipse at 50% 50%, rgba(212, 48, 48, 0.42), transparent 72%);
  box-shadow: 0 0 18px rgba(212, 48, 48, 0.35);
}

.backlash-glitch {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.backlash-label {
  display: block;
  width: 100%;
  text-align: center;
}

.dual-ring {
  width: 64px;
  height: 64px;
  transform: rotate(-90deg);
  animation: soul-ring-breathe 4s ease-in-out infinite;

  .outer {
    stroke-width: 2.4;
  }

  .inner {
    stroke-width: 2;
  }
}

@keyframes taiji-core-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes tide-pulse {
  from { filter: drop-shadow(0 0 3px color-mix(in srgb, var(--npc-color) 18%, transparent)); }
  to { filter: drop-shadow(0 0 14px color-mix(in srgb, var(--npc-color) 42%, transparent)); }
}

@keyframes ring-glitch {
  from { transform: rotate(-90deg); }
  to { transform: rotate(270deg); }
}

@keyframes ring-backlash-shake {
  0%, 100% { transform: rotate(-90deg); }
  20% { transform: rotate(-94deg); }
  45% { transform: rotate(-86deg); }
  70% { transform: rotate(-92deg); }
}

@keyframes disk-backlash-shake {
  0%, 100% { transform: translate(-50%, -50%) translateX(0); filter: hue-rotate(0deg); }
  20% { transform: translate(-50%, -50%) translateX(-3px); filter: hue-rotate(-18deg); }
  45% { transform: translate(-50%, -50%) translateX(3px); filter: hue-rotate(18deg); }
  70% { transform: translate(-50%, -50%) translateX(-2px); filter: hue-rotate(-10deg); }
}

@keyframes soul-glyph-flicker {
  from { opacity: 0.12; filter: blur(1px); }
  to { opacity: 0.38; filter: blur(0); }
}

@keyframes soul-ring-breathe {
  0%, 100% { filter: drop-shadow(0 0 8px color-mix(in srgb, var(--npc-color) 18%, transparent)); }
  50% { filter: drop-shadow(0 0 16px color-mix(in srgb, var(--npc-color) 30%, transparent)); }
}

@keyframes destiny-assimilate {
  from { opacity: 0.82; stroke-width: 2.2; }
  to { opacity: 1; stroke-width: 2.8; }
}

@keyframes destiny-assimilate-halo {
  from { opacity: 0.45; transform: translateX(-50%) scale(0.94); }
  to { opacity: 0.86; transform: translateX(-50%) scale(1.08); }
}

@keyframes destiny-ring-merge {
  from { transform: rotate(-90deg); }
  to { transform: rotate(270deg); }
}

@keyframes soul-thread-bind {
  from { opacity: 0.52; transform: translateX(-50%) rotate(14deg) scaleY(0.88); }
  to { opacity: 1; transform: translateX(-50%) rotate(22deg) scaleY(1.06); }
}

/* 展开区域 */
.card-expand {
  @include expand-panel;
  width: 100%;

  &.expanded {
    border-top: 1px solid var(--theme-border-subtle);
  }
}

.expand-inner {
  padding: 0 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: padding 0.35s ease;

  .expanded & {
    padding: 12px 14px;
  }
}

.expand-row {
  display: flex;
  align-items: center;
  gap: 10px;

  .expand-label {
    font-size: 12px;
    color: var(--theme-text-secondary);
    letter-spacing: 4px;
    min-width: 52px;
    flex-shrink: 0;
    font-weight: 500;
  }

  .expand-bar {
    flex: 1;
    height: 8px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    overflow: hidden;
    border: none;
    position: relative;
  }

  .expand-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.4s ease;

    &.favor {
      background: var(--theme-bar-fill);
      box-shadow: 0 0 8px var(--hh-gold-glow);
    }

    &.progress {
      background: var(--theme-progress-fill);
      box-shadow: 0 0 6px rgba(90, 74, 48, 0.3);
    }
  }

  .expand-value {
    font-family: $font-铭文;
    font-size: 13px;
    font-weight: 700;
    color: var(--theme-gold);
    min-width: 32px;
    text-align: right;
    @include inscription-engrave;
  }
}

.soul-whisper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  color: var(--theme-text-primary);
  background:
    radial-gradient(ellipse at 20% 50%, color-mix(in srgb, var(--npc-color) 18%, transparent) 0%, transparent 62%),
    linear-gradient(90deg, transparent, color-mix(in srgb, var(--hh-bg-card) 72%, transparent), transparent);
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 12%;
    right: 12%;
    height: 1px;
    background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--npc-color) 55%, transparent), transparent);
    opacity: 0.65;
  }

  &::before { top: 0; }
  &::after { bottom: 0; }

  .whisper-label {
    font-family: $font-铭文;
    font-size: 11px;
    color: var(--theme-text-muted);
    letter-spacing: 4px;
  }

  .whisper-text {
    font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
    font-size: 13px;
    line-height: 1.8;
    letter-spacing: 2px;
    text-shadow: 0 0 14px color-mix(in srgb, var(--npc-color) 28%, transparent);
  }

  &[data-stage='沉沦'] .whisper-text {
    color: var(--npc-color);
  }
}

.ink-reveal-enter-active,
.ink-reveal-leave-active {
  transition: clip-path 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1), filter 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}

.ink-reveal-enter-from,
.ink-reveal-leave-to {
  clip-path: circle(0% at 50% 50%);
  opacity: 0;
  filter: blur(6px);
}

.ink-reveal-enter-to,
.ink-reveal-leave-from {
  clip-path: circle(140% at 50% 50%);
  opacity: 1;
  filter: blur(0);
}
/* 装备折叠面板 */
.equip-section {
  margin-top: 8px;
  border-top: 1px solid var(--theme-border-subtle);
  padding-top: 8px;
}

.equip-toggle {
  border: none;
  background: var(--hh-bg-card);
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-family: $font-铭文;
  color: var(--theme-text-secondary);
  min-height: 44px;

  .equip-arrow {
    margin-left: auto;
    font-size: 11px;
  }
}

.equip-list {
  @include expand-panel;
}

.equip-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 0 4px;
}

.equip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--theme-text-secondary);
  border: none;
  border-radius: $radius-sm;
  background: var(--theme-accent-glow);
  transition: all 0.2s ease;

  &::before {
    content: '◆';
    font-size: 8px;
    color: var(--theme-accent);
    flex-shrink: 0;
  }

  &:hover {
    background: var(--theme-border);
    color: var(--theme-text-primary);
  }
}

.equip-empty {
  font-size: 12px;
  color: var(--theme-text-muted);
  text-align: center;
  padding: 8px 0;
  font-style: italic;
}

/* === 攻略完成装饰 === */

/* 金印封章 */
.seal-badge {
  position: absolute;
  top: 6px;
  right: 8px;
  z-index: 5;
  pointer-events: none;
  animation: seal-appear 0.6s ease-out;
}

.seal-text {
  display: inline-block;
  font-family: $font-铭文;
  font-size: 10px;
  font-weight: 700;
  color: var(--npc-accent);
  letter-spacing: 4px;
  padding: 2px 8px;
  border: none;
  border-radius: 3px;
  opacity: 0.85;
  text-shadow: 0 0 8px color-mix(in srgb, var(--npc-accent) 60%, transparent), 0 0 16px color-mix(in srgb, var(--npc-accent) 30%, transparent);
  background: color-mix(in srgb, var(--npc-accent) 12%, transparent);
  transform: rotate(-6deg);

}

@keyframes seal-appear {
  0% { opacity: 0; transform: scale(1.8) rotate(-15deg); }
  60% { opacity: 1; transform: scale(0.95) rotate(-4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

/* 角落装饰线 */
.card-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  z-index: 3;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: linear-gradient(90deg, var(--npc-accent), transparent);
    opacity: 0.6;
  }


  &.top-left {
    top: 3px;
    left: 3px;
    &::before { top: 0; left: 0; width: 10px; height: 1px; }
    &::after { top: 0; left: 0; width: 1px; height: 10px; }
  }

  &.top-right {
    top: 3px;
    right: 3px;
    &::before { top: 0; right: 0; width: 10px; height: 1px; }
    &::after { top: 0; right: 0; width: 1px; height: 10px; }
  }

  &.bottom-left {
    bottom: 3px;
    left: 3px;
    &::before { bottom: 0; left: 0; width: 10px; height: 1px; }
    &::after { bottom: 0; left: 0; width: 1px; height: 10px; }
  }

  &.bottom-right {
    bottom: 3px;
    right: 3px;
    &::before { bottom: 0; right: 0; width: 10px; height: 1px; }
    &::after { bottom: 0; right: 0; width: 1px; height: 10px; }
  }
}

/* 已攻略卡片特殊样式 */
.npc-strip.completed {
  border-color: var(--npc-accent);
  background:
    radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--npc-accent) 20%, transparent) 0%, transparent 60%),
    linear-gradient(135deg, rgba(40,30,20,0.6) 0%, rgba(20,15,10,0.8) 100%);
  animation: soul-breathe 4s ease-in-out infinite;

  /* gradient replaces before pseudo */

  .strip-name {
    color: var(--npc-accent);
    text-shadow: 0 0 8px color-mix(in srgb, var(--npc-accent) 40%, transparent);
  }

  .strip-status .status-dot {
    background: linear-gradient(90deg, var(--npc-accent), transparent);
    box-shadow: 0 0 4px color-mix(in srgb, var(--npc-accent) 50%, transparent);
  }

}

@keyframes soul-breathe {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 8px color-mix(in srgb, var(--npc-accent) 25%, transparent));
  }
  50% {
    transform: scale(1.02);
    filter: drop-shadow(0 0 16px color-mix(in srgb, var(--npc-accent) 45%, transparent));
  }
}

/* 头像区域在已攻略状态上浓度更高 */
.npc-strip.completed .avatar-zone {
  &::before {
    background: linear-gradient(to left, color-mix(in srgb, var(--npc-accent) 15%, rgba(26, 18, 12, 1)), transparent 60%);
  }
}

/* 展开区域进度条在已攻略状态下加强 */
.npc-strip.completed .expand-bar-fill.favor {
  box-shadow: 0 0 10px color-mix(in srgb, var(--npc-accent) 30%, transparent);
}

.npc-strip.completed .expand-bar-fill.progress {
  box-shadow: 0 0 8px color-mix(in srgb, var(--npc-accent) 25%, transparent);
}


@keyframes completed-breathe-light {
  0%, 100% {
    box-shadow:
      0 0 10px color-mix(in srgb, var(--npc-accent) 25%, rgba(0,0,0,0.08)),
      inset 0 0 15px color-mix(in srgb, var(--npc-accent) 6%, rgba(44,26,8,0.04));
  }
  50% {
    box-shadow:
      0 0 18px color-mix(in srgb, var(--npc-accent) 40%, rgba(0,0,0,0.12)),
      inset 0 0 25px color-mix(in srgb, var(--npc-accent) 12%, rgba(44,26,8,0.06));
  }
}


/* ── 墨迹扩散：值变更时环上短暂脉冲 ── */
.ring-value.ink-burst {
  animation: ink-burst-pulse 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes ink-burst-pulse {
  0% { filter: drop-shadow(0 0 0 transparent); }
  30% { filter: drop-shadow(0 0 12px currentColor); }
  100% { filter: drop-shadow(0 0 0 transparent); }
}

/* ── 反震红轨道：好感度环倒退空白闪烁暗红 ── */
.dual-ring-panel.soul-backlash .favor.outer-ring {
  animation: backlash-red-track 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.42s;
}

@keyframes backlash-red-track {
  0% { stroke: var(--npc-color); filter: drop-shadow(0 0 0 transparent); }
  30% { stroke: rgba(156, 44, 49, 0.7); filter: drop-shadow(0 0 8px rgba(156, 44, 49, 0.5)); }
  100% { stroke: var(--npc-color); filter: drop-shadow(0 0 0 transparent); }
}

/* ── 反震乱码古字 → 淡出为锁闭提示 ── */
.backlash-glitch {
  display: inline;
  font-size: 0.85em;
  color: rgba(156, 44, 49, 0.6);
  animation: glitch-fade 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  margin-right: 2px;
}

@keyframes glitch-fade {
  0% { opacity: 1; filter: blur(0); }
  60% { opacity: 0.5; filter: blur(1px); }
  100% { opacity: 0; filter: blur(2px); }
}

.backlash-label {
  animation: label-reveal 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
}

@keyframes label-reveal {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* ── 同化粒子效果：攻略完成时伪元素粒子扩散 ── */
.dual-ring-panel.destiny-assimilated::before,
.dual-ring-panel.destiny-assimilated::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

.dual-ring-panel.destiny-assimilated::before {
  width: 4px;
  height: 4px;
  top: 10%;
  left: 20%;
  background: rgba(156, 44, 49, 0.6);
  animation: assimilate-particle 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
}

.dual-ring-panel.destiny-assimilated::after {
  width: 3px;
  height: 3px;
  bottom: 15%;
  right: 18%;
  background: rgba(212, 160, 23, 0.5);
  animation: assimilate-particle 3s cubic-bezier(0.23, 1, 0.32, 1) 0.8s infinite;
}

@keyframes assimilate-particle {
  0%, 100% { opacity: 0; transform: translate(0, 0) scale(1); }
  20% { opacity: 0.8; transform: translate(-4px, -3px) scale(1.5); }
  50% { opacity: 0.4; transform: translate(3px, -6px) scale(1); }
  80% { opacity: 0.6; transform: translate(-2px, 4px) scale(1.2); }
}
</style>
