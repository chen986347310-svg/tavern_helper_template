<template>
  <div
    :class="['system-bar', { 'system-bar--rumor': hasActiveRumor, 'system-bar--p2': mode === '牝奴期' }]"
    role="toolbar"
    :aria-label="mode === '攻略期' ? '攻略进度状态栏' : '牝奴堕落状态栏'"
    :data-rumor-active="hasActiveRumor ? 'true' : 'false'"
  >
    <!-- 攻略期模式 -->
    <div v-if="mode === '攻略期'" class="bar-left" role="group" aria-label="弟子攻略状态">
      <TransitionGroup
        name="ink-fade"
        tag="div"
        class="npc-active-group npc-active-group--converge"
        data-transition="ink-fade"
        aria-label="当前在场命魂"
      >
        <div
          v-for="npc in displayedNpcList"
          :key="npc"
          :class="['taiji-icon', npcStates[npc]?.状态 === '已完成' ? 'taiji--conquered' : 'taiji--unconquered']"
          role="img"
          :aria-label="npc + (npcStates[npc]?.状态 === '已完成' ? ' 已攻略' : ' 未攻略')"
          :style="soulStyle(npc)"
        >
          <svg class="taiji-svg" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
            <path d="M20 2 A18 18 0 0 1 20 38 A9 9 0 0 1 20 20 A9 9 0 0 0 20 2" fill="currentColor" opacity="0.7"/>
            <path d="M20 38 A18 18 0 0 1 20 2 A9 9 0 0 1 20 20 A9 9 0 0 0 20 38" fill="currentColor" opacity="0.35"/>
            <circle cx="20" cy="11" r="2.5" fill="currentColor" opacity="0.5"/>
            <circle cx="20" cy="29" r="2.5" fill="currentColor" opacity="0.8"/>
          </svg>
          <span class="taiji-name">{{ npc }}</span>
        </div>
      </TransitionGroup>
    </div>

    <!-- 牝奴期模式 -->
    <div v-else class="bar-left bar-left--blossom">
      <div
        class="blossom-bar-wrapper"
        role="progressbar"
        :aria-valuenow="堕落度"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="'堕落度 ' + 堕落度 + '%'"
      >
        <div class="blossom-bar-meta">
          <span class="p2-stigma-glyph" aria-hidden="true">印</span>
          <span class="blossom-value">{{ 堕落度 }}%</span>
        </div>
        <div class="blossom-bar-track" aria-hidden="true">
          <span class="blossom-bar-fill" :style="blossomBarStyle"></span>
        </div>
      </div>
    </div>

    <!-- 右侧数值 -->
    <div class="bar-stats" role="group" aria-label="资源数值">
      <template v-if="mode === '攻略期'">
        <div class="stat-item stat-time">
          <span class="stat-glyph">辰</span>
          <span class="stat-value time-value" :aria-label="'当前时辰 ' + (时辰 ?? '晨时')">{{ 时辰 ?? '晨时' }}</span>
        </div>        <div class="stat-item">
          <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" opacity="0.7"/></svg>
          <span class="stat-value" :aria-label="'剩余 ' + (remainingDays ?? 0) + ' 日'">{{ remainingDays ?? 0 }}</span>
        </div>
        <div class="stat-item">
          <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2L2 12l10 10 10-10L12 2z" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.7"/><path d="M12 2L2 12h20L12 2z" fill="currentColor" opacity="0.3"/></svg>
          <span class="stat-value" :aria-label="(gems ?? 0) + ' 灵石'">{{ gems ?? 0 }}</span>
        </div>
      </template>
      <template v-else>
        <div class="stat-item stat-time">
          <span class="stat-glyph">辰</span>
          <span class="stat-value time-value" :aria-label="'当前时辰 ' + (时辰 ?? '晨时')">{{ 时辰 ?? '晨时' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-glyph">决</span>
          <span class="stat-value" :aria-label="'牝阴决 ' + (牝阴决层数 ?? 0) + ' 层'">{{ 牝阴决层数 ?? 0 }}/9</span>
        </div>
        <div class="stat-item p2-routine-stat">
          <span class="stat-glyph">课</span>
          <span class="stat-value" :aria-label="'当前日课 ' + (当前日课 || '候命')">{{ 当前日课 || '候命' }}</span>
        </div>
        <div v-if="当前命令" class="stat-item p2-command-stat" :data-command-intensity="命令强度 ?? 0">
          <span class="stat-glyph">令</span>
          <span class="stat-value" :aria-label="'当前命令 ' + 当前命令">{{ 当前命令 }}</span>
        </div>
      </template>
    </div>


    <!-- 日/夜切换 -->
    <button
      :class="['theme-toggle', { 'theme-toggle--p2': mode === '牝奴期' }]"
      :data-theme-mode="theme"
      @click="toggleTheme"
      :aria-label="themeToggleAria"
      :title="themeToggleTitle"
    >
      <template v-if="mode === '牝奴期'">
        <span class="p2-theme-thread" aria-hidden="true"></span>
        <span class="p2-theme-mark" aria-hidden="true">{{ theme === 'chenxiang' ? '香' : '绯' }}</span>
      </template>
      <svg v-else-if="theme === 'chenxiang'" class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="5" fill="currentColor"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <svg v-else class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
      </svg>
    </button>

  </div>
</template>

<script setup lang="ts">
type NpcName = '白芷' | '苏芸' | '纪兰' | '沈月秋' | '柳素衣';
type SceneName = string;
type TimeName = '晨时' | '午时' | '酉时' | '亥时';
type Rumor = { id?: string; 地点: string; 风声文本: string; 状态?: string; 来源?: string; 羞名等级?: string };

type SystemBarProps =
  | { mode: '攻略期'; npcList: readonly NpcName[]; presentNpcList?: readonly NpcName[]; npcStates: Record<NpcName, { 状态: string; 好感度?: number }>; remainingDays?: number; gems?: number; currentScene?: SceneName; 时辰?: TimeName; 牝阴决层数?: number; 堕落度?: number; rumorList?: readonly Rumor[] }
  | { mode: '牝奴期'; 堕落度: number; 牝阴决层数?: number; 当前日课?: string; 当前命令?: string; 命令强度?: number; npcList?: readonly NpcName[]; presentNpcList?: readonly NpcName[]; npcStates?: Record<NpcName, { 状态: string; 好感度?: number }>; remainingDays?: number; gems?: number; currentScene?: SceneName; 时辰?: TimeName; rumorList?: readonly Rumor[] };

const props = defineProps<SystemBarProps>();

const NPC_SOUL_COLORS: Record<NpcName, string> = {
  白芷: '#a8c4e0',
  苏芸: '#e0a860',
  纪兰: '#b088d4',
  沈月秋: '#d46048',
  柳素衣: '#e8e0d0',
};

const NPC_SOUL_RGB: Record<NpcName, string> = {
  白芷: '168, 196, 224',
  苏芸: '224, 168, 96',
  纪兰: '176, 136, 212',
  沈月秋: '212, 96, 72',
  柳素衣: '232, 224, 208',
};

function soulStyle(npc: NpcName) {
  const favorability = props.mode === '攻略期' ? Math.min(Math.max(props.npcStates[npc]?.好感度 ?? 0, 0), 100) : 0;
  return {
    '--soul-color': NPC_SOUL_COLORS[npc],
    '--soul-color-rgb': NPC_SOUL_RGB[npc],
    '--fav-value': String(favorability),
  };
}



const displayedNpcList = computed(() => props.mode === '攻略期' ? (props.presentNpcList ?? props.npcList) : []);
const activeRumors = computed(() => (props.rumorList ?? []).filter(rumor => rumor.状态 !== '已失效').slice(0, 3));
const hasActiveRumor = computed(() => activeRumors.value.length > 0);


const blossomColor = computed(() => {
  const v = props.mode === '牝奴期' ? (props.堕落度 ?? 0) : 0;
  if (v < 30) return 'color-mix(in srgb, var(--p2-gold) 44%, transparent)';
  if (v < 70) return 'color-mix(in srgb, var(--p2-blood) 62%, var(--p2-gold))';
  return 'var(--p2-blood)';
});

const blossomBarStyle = computed(() => ({
  width: `${props.mode === '牝奴期' ? Math.min(Math.max(props.堕落度 ?? 0, 0), 100) : 0}%`,
  background: blossomColor.value,
}));

import { computed } from 'vue';
import { useTheme } from '../composables/useTheme';
const { theme, toggleTheme } = useTheme();
const themeToggleTitle = computed(() => {
  if (props.mode === '牝奴期') return theme.value === 'chenxiang' ? '切换桃烙绯印' : '切换敛香沉香';
  return theme.value === 'chenxiang' ? '切换桃花模式' : '切换沉香模式';
});
const themeToggleAria = computed(() => themeToggleTitle.value);
</script>
<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.system-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 10px;
  margin-bottom: 8px;
  border: none;
  box-shadow: none;
  background: transparent;
  border-radius: 0;
  position: relative;
  overflow: visible;

  /* 五气朝元阵 · 两端淡出 */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      var(--hh-bg-main) 0%,
      transparent 15%,
      transparent 85%,
      var(--hh-bg-main) 100%
    );
    pointer-events: none;
    z-index: 1;
  }
}

/* ── 左侧区域 ── */
.bar-left {
  display: flex;
  gap: 6px;
  flex: 1;
  justify-content: center;
  align-items: center;
}


.npc-active-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  min-height: 48px;
  position: relative;
}

.npc-active-group--converge {
  flex: 1 1 auto;
  justify-content: center;
  align-content: center;
  isolation: isolate;
  mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  transition: gap 0.55s cubic-bezier(0.4, 0, 0.2, 1), min-height 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}

.ink-fade-enter-active {
  transition: opacity 0.8s cubic-bezier(0.215, 0.61, 0.355, 1), transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1), filter 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.ink-fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19), transform 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19), filter 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19);
  position: absolute;
  z-index: 0;
  pointer-events: none;
}

.ink-fade-move {
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}

.ink-fade-enter-from {
  opacity: 0;
  filter: blur(8px) saturate(0.65);
  transform: translateY(8px) scale(0.95);
}

.ink-fade-leave-to {
  opacity: 0;
  filter: blur(6px) saturate(0.55);
  transform: translateY(-4px) scale(0.92);
}
/* ── 攻略期太极图标 ── */
.taiji-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 38px;
  min-height: 38px;
  padding: 4px 2px;
  justify-content: center;
  position: relative;
  border: none;
  border-radius: 0;
  box-shadow: 0 0 calc(var(--fav-value, 0) * 0.2px + 5px) rgba(var(--soul-color-rgb, 168, 196, 224), calc(var(--fav-value, 0) * 0.0035 + 0.1));
  animation: soul-breath 10s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;

  .taiji-svg {
    width: 24px;
    height: 24px;
    transition: all 0.4s ease;
  }

  .taiji-name {
    display: block;
    min-width: max-content;
    font-family: $font-铭文;
    font-size: 9px;
    color: var(--hh-text-muted);
    letter-spacing: 1px;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    writing-mode: horizontal-tb;
  }

  &.taiji--unconquered .taiji-svg {
    color: var(--soul-color, $taiji-未攻略色);
    filter: drop-shadow(0 0 15px rgba(74, 122, 155, 0.3));
    animation: taiji-breathe 3s ease-in-out infinite;
  }

  &.taiji--conquered .taiji-svg {
    color: var(--soul-color, $taiji-已攻略色);
    filter: drop-shadow(0 0 15px rgba(212, 96, 138, 0.3));
    animation: taiji-breathe 3s ease-in-out infinite;
  }
}

@keyframes soul-breath {
  0% { opacity: 0.82; }
  100% { opacity: 1; }
}

@keyframes taiji-breathe {
  0%, 100% { filter: drop-shadow(0 0 12px currentColor); opacity: 0.8; }
  50% { filter: drop-shadow(0 0 20px currentColor); opacity: 1; }
}

/* ── 牝奴期血墨条 ── */
.bar-left--blossom {
  justify-content: flex-start;
}

.blossom-bar-wrapper {
  position: relative;
  width: 116px;
  min-height: 36px;
  padding: 6px 8px;
  flex-shrink: 0;
  display: grid;
  grid-template-rows: auto 8px;
  gap: 5px;
  background:
    linear-gradient(90deg, rgba(var(--p2-skin-rgb), 0.82), rgba(var(--p2-skin-rgb), 0.5)),
    radial-gradient(ellipse at 12% 50%, color-mix(in srgb, var(--p2-blood) 10%, transparent), transparent 62%);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--p2-gold) 18%, transparent),
    inset 0 -8px 16px color-mix(in srgb, var(--p2-incense) 5%, transparent);
}

.blossom-bar-meta {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.blossom-bar-track {
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--p2-incense) 14%, transparent), rgba(var(--p2-skin-rgb), 0.68)),
    color-mix(in srgb, var(--p2-gold) 10%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--p2-gold) 18%, transparent);
}

.blossom-bar-fill {
  display: block;
  height: 100%;
  transition: width 0.42s ease, background 0.42s ease;
  box-shadow:
    0 0 10px color-mix(in srgb, var(--p2-blood) 28%, transparent),
    inset 0 0 8px rgba(var(--p2-skin-rgb), 0.18);
}

.blossom-value {
  font-family: $font-铭文;
  font-size: 12px;
  font-weight: 700;
  color: var(--p2-blood);
  line-height: 1;
  text-shadow: 0 0 8px color-mix(in srgb, var(--p2-blood) 24%, transparent);
}

.p2-stigma-glyph {
  font-family: $font-铭文;
  font-size: 13px;
  color: var(--p2-blood);
  opacity: 0.86;
  filter: drop-shadow(0 0 8px color-mix(in srgb, var(--p2-blood) 24%, transparent));
  pointer-events: none;
}

/* ── 右侧数值 ── */
.bar-stats {
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .stat-icon {
    width: 14px;
    height: 14px;
    color: var(--hh-text-muted);
    flex-shrink: 0;
    filter: drop-shadow(0 0 6px var(--hh-glow-color, rgba(156,44,49,0.35)));
  }

  .stat-glyph {
    font-family: $font-铭文;
    font-size: 10px;
    color: var(--hh-text-muted);
    letter-spacing: 2px;
  }

  .stat-label {
    font-size: 9px;
    color: var(--hh-text-muted);
    letter-spacing: 4px;
  }

  .stat-value {
    font-family: $font-铭文;
    font-size: 12px;
    font-weight: 700;
    color: var(--theme-gold);
  }
}

.system-bar--p2 {
  &::before {
    background:
      linear-gradient(
        90deg,
        rgba(var(--p2-skin-rgb), 0.92) 0%,
        transparent 15%,
        transparent 85%,
        rgba(var(--p2-skin-rgb), 0.92) 100%
      ),
      radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--p2-mist) 64%, transparent), transparent 70%);
  }

  .bar-left--blossom {
    filter: drop-shadow(0 0 8px color-mix(in srgb, var(--p2-blood) 18%, transparent));
  }

  .blossom-bar-wrapper {
    width: clamp(96px, 24vw, 126px);
  }

  .bar-stats {
    gap: 6px;
    min-width: 0;
  }

  .stat-item {
    min-width: 0;
    min-height: 28px;
    padding: 4px 7px;
    background:
      linear-gradient(90deg, rgba(var(--p2-skin-rgb), 0.74), rgba(var(--p2-skin-rgb), 0.46)),
      radial-gradient(ellipse at 0% 50%, color-mix(in srgb, var(--p2-blood) 8%, transparent), transparent 64%);
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--p2-gold) 16%, transparent),
      inset 0 -8px 12px color-mix(in srgb, var(--p2-incense) 4%, transparent);
  }

  .stat-glyph {
    flex: 0 0 auto;
    width: 14px;
    color: var(--p2-blood);
    text-align: center;
    letter-spacing: 0;
    text-shadow: 0 0 8px color-mix(in srgb, var(--p2-blood) 22%, transparent);
  }

  .stat-value {
    min-width: 0;
    color: color-mix(in srgb, var(--p2-incense) 88%, #1f1512);
    text-shadow: none;
    font-size: 12px;
    line-height: 1.15;
  }

  .p2-routine-stat,
  .p2-command-stat {
    min-width: 0;

    .stat-value {
      max-width: clamp(76px, 22vw, 132px);
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;
      word-break: keep-all;
      overflow-wrap: anywhere;
    }
  }

  .p2-command-stat .stat-value {
    color: var(--p2-blood);
    text-shadow: 0 0 8px color-mix(in srgb, var(--p2-blood) 28%, transparent);
  }
}


/* ── 风声涟漪 ── */
.system-bar--rumor {
  &::after {
    content: '';
    position: absolute;
    inset: -4px 34px;
    z-index: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at 50% 50%, rgba(224, 168, 96, 0.12), transparent 64%);
    mask-image: linear-gradient(to right, transparent, black 18%, black 82%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 18%, black 82%, transparent);
    animation: rumor-ripple 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
}


@keyframes rumor-ripple {
  0%, 100% { opacity: 0.16; transform: scaleX(0.96); filter: blur(1px); }
  50% { opacity: 0.42; transform: scaleX(1.03); filter: blur(2px); }
}


/* ── 日/夜切换按钮 ── */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--theme-gold);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  margin-left: 8px;
  position: relative;
  z-index: 2;
  animation: array-eye-rotate 20s linear infinite;
  filter: drop-shadow(0 0 6px var(--hh-glow-color));

  &:hover {
    color: var(--theme-accent);
    filter: drop-shadow(0 0 12px var(--hh-glow-color));
  }

  &:active {
    animation: ink-spread 0.6s ease-out, array-eye-rotate 20s linear infinite;
  }

  .theme-icon {
    width: 18px;
    height: 18px;
  }
}

.theme-toggle--p2 {
  width: 34px;
  height: 34px;
  border-radius: 999px 999px 78% 78%;
  background:
    radial-gradient(ellipse at 50% 58%, rgba(var(--p2-skin-rgb), 0.6), transparent 58%),
    linear-gradient(180deg, color-mix(in srgb, var(--p2-gold) 18%, transparent), rgba(var(--p2-skin-rgb), 0.18));
  color: var(--p2-incense);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--p2-gold) 28%, transparent),
    inset 0 0 18px color-mix(in srgb, var(--p2-blood) 8%, transparent);
  animation: p2-theme-breath 5.4s ease-in-out infinite;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    width: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--p2-gold) 72%, transparent), transparent);
    transform: translateX(-50%);
  }

  &::before { top: 7px; }
  &::after { bottom: 7px; }

  &:hover {
    color: var(--p2-blood);
    filter: drop-shadow(0 0 12px color-mix(in srgb, var(--p2-blood) 22%, transparent));
  }

  .p2-theme-mark {
    font-family: $font-铭文;
    font-size: 14px;
    line-height: 1;
    position: relative;
    z-index: 1;
  }

  .p2-theme-thread {
    position: absolute;
    left: 50%;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--p2-gold) 54%, transparent), transparent);
    transform: translateX(-50%);
  }
}

.theme-toggle--p2[data-theme-mode='taohua'] {
  color: var(--p2-blood);
  background:
    radial-gradient(ellipse at 50% 58%, color-mix(in srgb, var(--p2-blood) 18%, transparent), transparent 58%),
    linear-gradient(180deg, color-mix(in srgb, var(--p2-mist) 86%, transparent), rgba(var(--p2-skin-rgb), 0.18));
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--p2-blood) 28%, transparent),
    inset 0 0 18px color-mix(in srgb, var(--p2-blood) 14%, transparent),
    0 0 12px color-mix(in srgb, var(--p2-blood) 12%, transparent);
}

@keyframes p2-theme-breath {
  0%, 100% { transform: scale(1); filter: saturate(0.96); }
  50% { transform: scale(1.025); filter: saturate(1.16); }
}

/* 五气朝元阵 · 阵眼自转 */
@keyframes array-eye-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 墨迹扩散 */
@keyframes ink-spread {
  0% { filter: drop-shadow(0 0 0 0 var(--hh-glow-color)); }
  50% { filter: drop-shadow(0 0 20px var(--hh-glow-color)); }
  100% { filter: drop-shadow(0 0 6px var(--hh-glow-color)); }
}


</style>
