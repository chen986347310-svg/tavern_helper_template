<template>
  <div
    :class="['npc-strip', statusClass, { expanded: expanded }]"
    :style="{ '--npc-color': npcColor, '--npc-color-dark': npcColorDark }"
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
      <div v-if="data.状态 === '进行中'" class="strip-favor">
        <div class="favor-bar">
          <div class="favor-fill" :style="{ width: data.好感度 + '%' }"></div>
        </div>
        <span class="favor-value">{{ data.好感度 }}</span>
      </div>
    </div>

    <!-- 展开区域 (进度条 + 装备) -->
    <div :class="['card-expand', { expanded: expanded }]">
      <div class="expand-inner">
        <div class="expand-row">
          <span class="expand-label">好感度</span>
          <div class="expand-bar">
            <div class="expand-bar-fill favor" :style="{ width: data.好感度 + '%' }"></div>
          </div>
          <span class="expand-value">{{ data.好感度 }}</span>
        </div>
        <div class="expand-row">
          <span class="expand-label">攻略值</span>
          <div class="expand-bar">
            <div class="expand-bar-fill progress" :style="{ width: data.攻略值 + '%' }"></div>
          </div>
          <span class="expand-value">{{ data.攻略值 }}</span>
        </div>
        <div v-if="装备 && 装备.length > 0" class="equip-section">
          <button class="equip-toggle" @click.stop="equipOpen = !equipOpen">
            装备 <span class="equip-arrow">{{ equipOpen ? '▴' : '▾' }}</span>
          </button>
          <div :class="['equip-list', { open: equipOpen }]">
            <div class="equip-inner">
              <span v-for="item in 装备" :key="item" class="equip-item">{{ item }}</span>
            </div>
          </div>
        </div>
        <div v-else class="equip-empty">暂无装备</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

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
  data: { 好感度: number; 攻略值: number; 状态: string };
  装备?: string[];
  expanded?: boolean;
}>();

const emit = defineEmits<{
  click: [];
  toggleExpand: [];
}>();

const equipOpen = ref(false);
const imageLoaded = ref(false);
const imageError = ref(false);

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

const avatarSrc = computed(() => {
  const map = AVATAR_MAP[props.npc名];
  return props.data.状态 === '已完成' ? map.fallen : map.normal;
});

function handleClick() {
  if (props.data.状态 === '未开始') return;
  emit('click');
  emit('toggleExpand');
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

/* NPC 水平横条 */
.npc-strip {
  position: relative;
  border: 1px solid var(--theme-border);
  border-radius: $radius-md;
  transition: all 0.35s ease;
  overflow: hidden;
  @include gold-foil;
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
    border-color: rgba(212, 160, 23, 0.5);
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
    object-fit: cover;
    object-position: center 20%;
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
     text-shadow: 0 0 8px rgba(212, 160, 23, 0.2);
     min-height: 44px;
     background: linear-gradient(135deg, rgba(212, 160, 23, 0.05), transparent);
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
  padding: 8px 12px;
  min-height: 44px;
  transition: opacity 0.35s ease;

  &.text-fade {
    opacity: 0;
    height: 0;
    padding: 0 12px;
    overflow: hidden;
  }

  .strip-name {
    font-family: $font-铭文;
    font-size: 16px;
    font-weight: 700;
    color: var(--theme-text-primary);
    letter-spacing: 0.1em;
  }

  .strip-status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: var(--theme-text-secondary);

    .status-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: rgba(180, 150, 100, 0.3);
    }
  }
}

/* 横条内好感度条 */
.strip-favor {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  min-width: 80px;

  .favor-bar {
    flex: 1;
    height: 4px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 2px;
    overflow: hidden;
  }

  .favor-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.4s ease;
    background: linear-gradient(90deg, #6b5b3a, #d4a017);
  }

  .favor-value {
    font-family: $font-铭文;
    font-size: 11px;
    color: rgba(212, 160, 23, 0.7);
    min-width: 24px;
    text-align: right;
  }
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
    letter-spacing: 0.08em;
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
    border: 1px solid var(--theme-border-subtle);
    position: relative;
  }

  .expand-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.4s ease;

    &.favor {
      background: var(--theme-bar-fill);
      box-shadow: 0 0 8px rgba(212, 160, 23, 0.2);
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

/* 装备折叠面板 */
.equip-section {
  margin-top: 8px;
  border-top: 1px solid var(--theme-border-subtle);
  padding-top: 8px;
}

.equip-toggle {
  @include gold-seal-btn;
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
  border: 1px solid var(--theme-border-subtle);
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
  letter-spacing: 0.15em;
  padding: 2px 8px;
  border: 1.5px solid var(--npc-accent);
  border-radius: 3px;
  opacity: 0.85;
  text-shadow: 0 0 6px color-mix(in srgb, var(--npc-accent) 50%, transparent);
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
    background: var(--npc-accent);
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
  box-shadow:
    0 0 12px color-mix(in srgb, var(--npc-accent) 35%, transparent),
    inset 0 0 20px color-mix(in srgb, var(--npc-accent) 10%, transparent);
  animation: completed-breathe 4s ease-in-out infinite;

  &::before {
    background: linear-gradient(
      90deg,
      transparent 0%,
      color-mix(in srgb, var(--npc-accent) 8%, transparent) 25%,
      transparent 50%,
      color-mix(in srgb, var(--npc-accent) 8%, transparent) 75%,
      transparent 100%
    ) !important;
  }

  .strip-name {
    color: var(--npc-accent);
    text-shadow: 0 0 8px color-mix(in srgb, var(--npc-accent) 40%, transparent);
  }

  .strip-status .status-dot {
    background: var(--npc-accent);
    box-shadow: 0 0 4px color-mix(in srgb, var(--npc-accent) 50%, transparent);
  }

}

@keyframes completed-breathe {
  0%, 100% {
    box-shadow:
      0 0 12px color-mix(in srgb, var(--npc-accent) 20%, transparent),
      inset 0 0 20px color-mix(in srgb, var(--npc-accent) 4%, transparent);
  }
  50% {
    box-shadow:
      0 0 20px color-mix(in srgb, var(--npc-accent) 35%, transparent),
      inset 0 0 30px color-mix(in srgb, var(--npc-accent) 8%, transparent);
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

</style>

