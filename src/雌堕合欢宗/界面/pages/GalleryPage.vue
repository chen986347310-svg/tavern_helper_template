<template>
  <div class="gallery-page">
    <!-- NPC 档案 -->
    <div class="section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">鉴</span>
        <span class="header-text">命魂录</span>
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
            <span class="cell-glyph">犀</span>
            <span class="cell-label">灵犀</span>
            <span class="cell-value">{{ get灵犀等级(data.NPC[selectedNpc]?.好感度 ?? 0) }}</span>
          </div>
          <div class="detail-cell">
            <span class="cell-glyph">蚀</span>
            <span class="cell-label">蚀心</span>
            <span class="cell-value">{{ get道心侵蚀(data.NPC[selectedNpc]?.攻略值 ?? 0) }}</span>
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

    <!-- 秘录筛选 -->
    <div class="archive-filter-bar" aria-label="因果秘录筛选">
      <button
        type="button"
        :class="['filter-chip', { active: activeNpcFilter === '' }]"
        data-filter-npc=""
        @click="activeNpcFilter = ''"
      >全部</button>
      <button
        v-for="name in NPC列表"
        :key="name"
        type="button"
        :class="['filter-chip', { active: activeNpcFilter === name }]"
        :data-filter-npc="name"
        @click="activeNpcFilter = activeNpcFilter === name ? '' : name"
      >{{ name }}</button>
      <span class="filter-separator"></span>
      <button
        v-for="status in rumorStatusFilters"
        :key="status"
        type="button"
        :class="['filter-chip', { active: activeRumorStatusFilter === status }]"
        :data-filter-rumor-status="status"
        @click="activeRumorStatusFilter = activeRumorStatusFilter === status ? '' : status"
      >{{ status }}</button>
    </div>

    <!-- 心音回响 -->
    <div :class="['section soul-archive-section', { 'is-collapsed': collapsedSections.soul }]">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">心</span>
        <span class="header-text">心音册</span>
        <button class="section-fold" type="button" data-collapse-section="soul" @click="collapsedSections.soul = !collapsedSections.soul">
          {{ collapsedSections.soul ? '展卷' : '合卷' }}
        </button>
        <div class="header-line"></div>
      </div>

      <div v-if="!collapsedSections.soul" class="soul-archive-list timeline-archive">
        <button
          v-for="echo in filteredSoulEchoArchives"
          :key="echo.id"
          :class="['soul-archive-item', `is-${echo.result}`, { focused: data.系统.当前聚焦心声NPC === echo.npc, fresh: echo.is_new }]"
          type="button"
          @click="focusSoulEcho(echo.npc)"
        >
          <span class="timeline-dot soul-timeline-dot" aria-hidden="true"></span>
          <span class="timeline-meta soul-timeline-mark">{{ echo.time || '时辰未录' }}</span>
          <span class="timeline-meta soul-timeline-scene">{{ echo.scene || '无名之地' }}</span>
          <span class="echo-npc">{{ echo.npc }}</span>
          <span class="echo-stage">{{ echo.stage }}</span>
          <span class="echo-text">{{ echo.text }}</span>
        </button>
        <div v-if="filteredSoulEchoArchives.length === 0" class="empty-state soul-archive-empty">
          <span class="empty-glyph">寂</span>
          <span class="empty-text">心音未落</span>
        </div>
      </div>
    </div>

    <!-- 风声卷 -->
    <div class="section rumor-archive-section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">风</span>
        <span class="header-text">风声卷</span>
        <div class="header-line"></div>
      </div>

      <div class="rumor-archive-list timeline-archive">
        <button
          v-for="rumor in filteredRumorArchives"
          :key="rumor.id"
          :class="['rumor-archive-item', `is-${rumor.状态 ?? '未读'}`, { focused: data.系统.当前追查风声ID === rumor.id }]"
          type="button"
          @click="focusRumor(rumor.id)"
        >
          <span class="timeline-dot rumor-timeline-dot" aria-hidden="true"></span>
          <span class="timeline-meta rumor-timeline-mark">{{ rumor.来源 ?? '无名风声' }}</span>
          <span class="timeline-meta rumor-timeline-scene">{{ rumor.地点 }}{{ rumor.子区域 ? ' · ' + rumor.子区域 : '' }}</span>
          <span class="rumor-status">{{ rumor.状态 ?? '未读' }}</span>
          <span class="rumor-text">{{ rumor.风声文本 }}</span>
          <span class="rumor-hook">{{ rumor.故事钩子 }}</span>
        </button>
        <div v-if="filteredRumorArchives.length === 0" class="empty-state rumor-archive-empty">
          <span class="empty-glyph">寂</span>
          <span class="empty-text">风声未至</span>
        </div>
      </div>
    </div>

    <!-- 已解锁场景 -->
    <div class="section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">景</span>
        <span class="header-text">场景志</span>
        <div class="header-line"></div>
      </div>

      <div class="scene-archive-list">
        <div class="scene-archive-group is-current">
          <div class="scene-group-title">当前所在</div>
          <button
            type="button"
            :class="['scene-archive-item', 'current', { active: activeSceneFilter === currentSceneArchive.name }]"
            :data-filter-scene="currentSceneArchive.name"
            @click="toggleSceneFilter(currentSceneArchive.name)"
          >
            <span class="scene-name">{{ currentSceneArchive.name }}</span>
            <span class="scene-meta">{{ currentSceneArchive.subArea || '无细分' }}</span>
            <span class="scene-meta">{{ currentSceneArchive.exposure }}</span>
          </button>
        </div>

        <div class="scene-archive-group is-unlocked">
          <div class="scene-group-title">已解锁</div>
          <button
            v-for="scene in unlockedSceneArchives"
            :key="scene"
            type="button"
            :class="['scene-archive-item', { active: activeSceneFilter === scene }]"
            :data-filter-scene="scene"
            @click="toggleSceneFilter(scene)"
          >
            <span class="scene-name">{{ scene }}</span>
            <span class="scene-meta">商城/剧情入口</span>
          </button>
          <div v-if="unlockedSceneArchives.length === 0" class="empty-state scene-archive-empty">
            <span class="empty-glyph">空</span>
            <span class="empty-text">尚无额外解锁</span>
          </div>
        </div>

        <div class="scene-archive-group is-core">
          <div class="scene-group-title">核心地点</div>
          <button
            v-for="scene in coreSceneArchives"
            :key="scene"
            type="button"
            :class="['scene-archive-item', 'core', { active: activeSceneFilter === scene }]"
            :data-filter-scene="scene"
            @click="toggleSceneFilter(scene)"
          >
            <span class="scene-name">{{ scene }}</span>
            <span class="scene-meta">宗门常驻</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 已解锁剧情 -->
    <div class="section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">缘</span>
        <span class="header-text">缘起簿</span>
        <div class="header-line"></div>
      </div>

      <div class="unlock-list">
        <div v-for="story in data.剧情.已解锁" :key="story" class="unlock-item">
          <span class="item-dot"></span>
          <span class="item-text">{{ story }}</span>
        </div>
        <div v-if="data.剧情.已解锁.length === 0" class="empty-state">
          <span class="empty-glyph">空</span>
          <span class="empty-text">卷页未启</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from '../store';
import { get灵犀等级, get道心侵蚀 } from '../composables/useStatusText';

const store = useDataStore();
const data = store.data;

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
const selectedNpc = ref<string | null>(null);
const activeNpcFilter = ref<NpcName | ''>('');
const activeRumorStatusFilter = ref<RumorArchive['状态'] | ''>('');
const activeSceneFilter = ref('');
const collapsedSections = ref({ soul: false });
const rumorStatusFilters = ['未读', '已追查', '已失效'] as const;
const coreSceneArchives = ['莲灯前苑', '醉玉小筑', '绮梦幽阁', '药庐', '经阁', '阴阳池', '掌门殿偏殿', '渊底灵脉'] as const;

type NpcName = (typeof NPC列表)[number];
type SoulEchoArchive = {
  id: string;
  npc: NpcName;
  text: string;
  stage: '警戒' | '动摇' | '沉沦';
  result: '捕获' | '反震' | '锁闭';
  scene: string;
  time: string;
  is_new?: boolean;
};

type RumorArchive = {
  id: string;
  来源?: string;
  地点: string;
  子区域?: string;
  相关NPC?: string[];
  紧急度?: string;
  风声文本: string;
  故事钩子?: string;
  状态?: '未读' | '已读' | '已追查' | '已失效';
};

const soulEchoArchives = computed(() => ((data.系统.心音回响 ?? []) as SoulEchoArchive[])
  .filter(echo => echo.text?.trim())
  .slice(-12)
  .reverse());

const rumorArchives = computed(() => ((data.系统.风声列表 ?? []) as RumorArchive[])
  .filter(rumor => rumor.id && rumor.风声文本?.trim())
  .slice(0, 12));

const filteredSoulEchoArchives = computed(() => soulEchoArchives.value
  .filter(echo => !activeNpcFilter.value || echo.npc === activeNpcFilter.value)
  .filter(echo => !activeSceneFilter.value || echo.scene === activeSceneFilter.value));

const filteredRumorArchives = computed(() => rumorArchives.value
  .filter(rumor => !activeNpcFilter.value || (rumor.相关NPC ?? []).includes(activeNpcFilter.value))
  .filter(rumor => !activeRumorStatusFilter.value || (rumor.状态 ?? '未读') === activeRumorStatusFilter.value)
  .filter(rumor => !activeSceneFilter.value || rumor.地点 === activeSceneFilter.value));

const currentSceneArchive = computed(() => ({
  name: data.系统.场景上下文?.地点 || data.系统.当前场景 || '未知之地',
  subArea: data.系统.场景上下文?.子区域 ?? '',
  exposure: data.系统.场景上下文?.公开度 ?? '公开',
}));

const unlockedSceneArchives = computed(() => Array.from(new Set((data.场景.已解锁 ?? []) as string[]))
  .filter(scene => scene));

function selectNpc(name: string) {
  selectedNpc.value = selectedNpc.value === name ? null : name;
}

function focusSoulEcho(name: NpcName) {
  data.系统.当前聚焦心声NPC = data.系统.当前聚焦心声NPC === name ? '' : name;
  selectedNpc.value = name;
}

function focusRumor(id: string) {
  data.系统.当前追查风声ID = data.系统.当前追查风声ID === id ? '' : id;
}

function toggleSceneFilter(scene: string) {
  activeSceneFilter.value = activeSceneFilter.value === scene ? '' : scene;
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


/* 秘录筛选 — 不触发剧情，只收束视线 */
.archive-filter-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin: 0 0 14px;
  padding: 10px 12px;
  overflow: hidden;
  background:
    linear-gradient(90deg, transparent, color-mix(in srgb, var(--hh-bg-card) 92%, transparent), transparent),
    repeating-linear-gradient(105deg, transparent 0 18px, color-mix(in srgb, var(--hh-text-primary) 5%, transparent) 19px 20px);
  box-shadow: inset 0 0 24px color-mix(in srgb, var(--hh-glow-color) 22%, transparent);
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

.archive-filter-bar::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 20% 50%, color-mix(in srgb, var(--hh-accent) 14%, transparent), transparent 58%),
    radial-gradient(ellipse at 82% 50%, color-mix(in srgb, var(--hh-text-primary) 8%, transparent), transparent 62%);
  opacity: 0.8;
}

.filter-chip {
  position: relative;
  z-index: 1;
  border: none;
  padding: 5px 10px;
  overflow: hidden;
  background:
    linear-gradient(90deg, transparent, color-mix(in srgb, var(--hh-bg-hover) 72%, transparent), transparent),
    color-mix(in srgb, var(--hh-bg-card) 72%, transparent);
  box-shadow: inset 0 0 12px color-mix(in srgb, var(--hh-text-primary) 9%, transparent);
  color: #d9b48f;
  color: var(--hh-text-primary, #d9b48f);
  color: color-mix(in srgb, var(--hh-text-muted) 82%, #fff5e8);
  font-family: $font-铭文;
  font-size: 11px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: color 0.25s ease, filter 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;

  &::after {
    content: '';
    position: absolute;
    inset: auto 8px 2px;
    height: 1px;
    background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--hh-accent) 58%, #fff0dd), transparent);
    opacity: 0.35;
    transition: opacity 0.25s ease;
  }

  &:hover,
  &.active {
    color: #9c2c31;
  color: var(--hh-accent, #9c2c31);
    color: color-mix(in srgb, var(--hh-accent) 86%, #fff5e8);
    background: color-mix(in srgb, var(--hh-accent) 12%, transparent);
    box-shadow:
      inset 0 0 16px color-mix(in srgb, var(--hh-accent) 14%, transparent),
      0 0 10px color-mix(in srgb, var(--hh-glow-color) 45%, transparent);
    filter: drop-shadow(0 0 8px var(--hh-glow-color));

    &::after {
      opacity: 0.9;
    }
  }
}

.filter-separator {
  width: 1px;
  align-self: stretch;
  min-height: 18px;
  background: linear-gradient(to bottom, transparent, var(--hh-text-muted), transparent);
  opacity: 0.38;
}

.section-fold {
  border: none;
  background: transparent;
  color: color-mix(in srgb, var(--hh-text-muted) 78%, #fff5e8);
  font-family: $font-铭文;
  font-size: 10px;
  letter-spacing: 3px;
  cursor: pointer;
  transition: color 0.25s ease, filter 0.25s ease;

  &:hover {
    color: #9c2c31;
  color: var(--hh-accent, #9c2c31);
    filter: drop-shadow(0 0 8px var(--hh-glow-color));
  }
}

.soul-archive-section.is-collapsed {
  .section-header {
    opacity: 0.78;
  }
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
    color: #bfa17a;
  color: var(--hh-text-secondary, #bfa17a);
    letter-spacing: 4px;
    transition: color 0.25s ease;
  }

  .npc-status {
    font-size: 12px;
    color: rgba(217, 180, 143, 0.58);
  color: var(--hh-text-muted, rgba(217, 180, 143, 0.58));
    letter-spacing: 4px;
  }

  &.unlocked {
    background: var(--hh-bg-hover);

    .entry-left .entry-dot {
      background: var(--hh-accent);
      box-shadow: 0 0 6px var(--hh-glow-color);
    }

    .npc-name {
      color: #d9b48f;
  color: var(--hh-text-primary, #d9b48f);
    }

    .npc-status {
      color: #9c2c31;
  color: var(--hh-accent, #9c2c31);
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
    color: rgba(217, 180, 143, 0.58);
  color: var(--hh-text-muted, rgba(217, 180, 143, 0.58));
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
    color: rgba(217, 180, 143, 0.58);
  color: var(--hh-text-muted, rgba(217, 180, 143, 0.58));
    letter-spacing: 4px;
  }

  .cell-value {
    font-family: $font-铭文;
    font-size: 18px;
    font-weight: 700;
    color: #d9b48f;
  color: var(--hh-text-primary, #d9b48f);

    &.status {
      font-size: 12px;
      font-weight: 400;
      padding: 2px 8px;
      border-radius: 3px;

      &.未开始 {
        color: rgba(217, 180, 143, 0.58);
  color: var(--hh-text-muted, rgba(217, 180, 143, 0.58));
        background: rgba(100, 80, 50, 0.1);
      }

      &.进行中 {
        color: #bfa17a;
  color: var(--hh-text-secondary, #bfa17a);
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


/* 心音册 — 灵识残响，强制覆盖 button 默认黑字 */
.soul-archive-item {
  display: grid;
  grid-template-columns: auto auto auto 1fr;
  gap: 8px 10px;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background:
    radial-gradient(ellipse at 14% 50%, rgba(217, 180, 143, 0.1), transparent 58%),
    linear-gradient(90deg, transparent, var(--hh-bg-hover), transparent);
  color: #d9b48f;
  color: var(--hh-text-primary, #d9b48f);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 0.35s ease, filter 0.35s ease, opacity 0.35s ease;

  &:hover,
  &.focused {
    transform: translateX(4px);
    filter: drop-shadow(0 0 10px var(--hh-glow-color, rgba(156, 44, 49, 0.35)));
  }
}

.echo-npc,
.echo-stage {
  color: #9c2c31;
  color: var(--hh-accent, #9c2c31);
  font-family: $font-铭文;
  font-size: 11px;
  letter-spacing: 3px;
  text-shadow: 0 0 8px var(--hh-glow-color, rgba(156, 44, 49, 0.35));
}

.echo-place {
  color: #bfa17a;
  color: var(--hh-text-secondary, #bfa17a);
  font-size: 11px;
  letter-spacing: 2px;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.88);
}

.echo-text {
  grid-column: 1 / -1;
  color: #d9b48f;
  color: var(--hh-text-primary, #d9b48f);
  font-family: $font-铭文;
  font-size: 13px;
  line-height: 1.75;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.92), 0 0 8px var(--hh-glow-color, rgba(156, 44, 49, 0.35));
}
/* 风声卷 — 暗阁传闻，强制覆盖 button 默认黑字 */
.rumor-archive-list,
.soul-archive-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.soul-archive-list.timeline-archive,
.rumor-archive-list.timeline-archive {
  position: relative;
  padding-left: 22px;
}

.timeline-archive::before {
  content: "";
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 8px;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(191, 161, 122, 0.18), rgba(156, 44, 49, 0.32), rgba(191, 161, 122, 0.18), transparent);
  box-shadow: 0 0 12px rgba(156, 44, 49, 0.18);
  pointer-events: none;
}

.timeline-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background:
    radial-gradient(circle, #f1d9b8 0 18%, var(--hh-accent, #9c2c31) 24% 46%, transparent 54%),
    radial-gradient(circle, rgba(156, 44, 49, 0.25), transparent 72%);
  box-shadow: 0 0 10px var(--hh-glow-color, rgba(156, 44, 49, 0.35));
  transform: translateX(-22px);
}

.timeline-meta {
  color: #bfa17a;
  color: var(--hh-text-secondary, #bfa17a);
  font-family: $font-铭文;
  font-size: 10px;
  letter-spacing: 3px;
  white-space: nowrap;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.9);
}

.soul-timeline-mark,
.rumor-timeline-mark {
  color: #9c2c31;
  color: var(--hh-accent, #9c2c31);
  text-shadow: 0 0 9px var(--hh-glow-color, rgba(156, 44, 49, 0.35));
}

.rumor-archive-item {
  display: grid;
  grid-template-columns: auto auto auto 1fr;
  gap: 8px 10px;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background:
    radial-gradient(ellipse at 12% 50%, color-mix(in srgb, var(--hh-accent) 10%, transparent), transparent 58%),
    linear-gradient(90deg, transparent, color-mix(in srgb, var(--hh-bg-hover) 72%, transparent), transparent);
  color: #d9b48f;
  color: var(--hh-text-primary, #d9b48f);
  color: color-mix(in srgb, var(--hh-text-primary) 88%, #fff3e8);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 0.35s ease, filter 0.35s ease, opacity 0.35s ease;

  &:hover,
  &.focused {
    transform: translateX(4px);
    filter: drop-shadow(0 0 10px var(--hh-glow-color));
  }
}

.rumor-status {
  color: #9c2c31;
  color: var(--hh-accent, #9c2c31);
  color: color-mix(in srgb, var(--hh-accent) 82%, #fff2e0);
  font-family: $font-铭文;
  font-size: 10px;
  letter-spacing: 3px;
  text-shadow: 0 0 8px var(--hh-glow-color);
}

.rumor-place {
  color: color-mix(in srgb, var(--hh-text-primary) 86%, #fff5e8);
  font-family: $font-铭文;
  font-size: 11px;
  letter-spacing: 3px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
}

.rumor-text {
  grid-column: 1 / -1;
  color: #d9b48f;
  color: var(--hh-text-primary, #d9b48f);
  color: color-mix(in srgb, var(--hh-text-primary) 92%, #fff7ed);
  font-family: $font-铭文;
  font-size: 13px;
  line-height: 1.75;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.92), 0 0 8px var(--hh-glow-color);
}

.rumor-hook {
  grid-column: 1 / -1;
  color: #bfa17a;
  color: var(--hh-text-secondary, #bfa17a);
  color: color-mix(in srgb, var(--hh-text-muted) 70%, #fff5e8);
  font-size: 11px;
  line-height: 1.6;
  letter-spacing: 2px;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.88);
}
/* 场景志 — 地脉卷宗 */
.scene-archive-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scene-archive-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px 10px;
  background:
    radial-gradient(ellipse at 18% 40%, color-mix(in srgb, var(--hh-accent) 10%, transparent), transparent 62%),
    linear-gradient(90deg, transparent, var(--hh-bg-card), transparent);
}

.scene-group-title {
  font-family: $font-铭文;
  font-size: 11px;
  color: #9c2c31;
  color: var(--hh-accent, #9c2c31);
  color: color-mix(in srgb, var(--hh-accent) 82%, #fff3e8);
  letter-spacing: 4px;
  text-shadow: 0 0 10px var(--hh-glow-color);
}

.scene-archive-item {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  overflow: hidden;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--hh-bg-hover) 12%, transparent), color-mix(in srgb, var(--hh-bg-hover) 72%, transparent), color-mix(in srgb, var(--hh-bg-hover) 12%, transparent)),
    repeating-linear-gradient(100deg, transparent 0 16px, color-mix(in srgb, var(--hh-text-primary) 4%, transparent) 17px 18px);
  color: #d9b48f;
  color: var(--hh-text-primary, #d9b48f);
  color: color-mix(in srgb, var(--hh-text-primary) 86%, #fff1df);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 0.35s ease, filter 0.35s ease, box-shadow 0.35s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse at 14% 45%, color-mix(in srgb, var(--hh-accent) 12%, transparent), transparent 55%),
      radial-gradient(ellipse at 86% 50%, color-mix(in srgb, var(--hh-text-primary) 7%, transparent), transparent 62%);
    opacity: 0.72;
  }

  &:hover {
    transform: translateX(4px);
    filter: drop-shadow(0 0 10px var(--hh-glow-color));
  }

  &.current {
    box-shadow: inset 0 0 18px color-mix(in srgb, var(--hh-accent) 10%, transparent);
  }

  &.active {
    box-shadow:
      inset 0 0 22px color-mix(in srgb, var(--hh-accent) 16%, transparent),
      0 0 14px color-mix(in srgb, var(--hh-glow-color) 55%, transparent);

    .scene-name {
      color: #9c2c31;
  color: var(--hh-accent, #9c2c31);
    color: color-mix(in srgb, var(--hh-accent) 86%, #fff5e8);
    }
  }

  .scene-name {
    position: relative;
    z-index: 1;
    min-width: 0;
    font-family: $font-铭文;
    font-size: 13px;
    color: #d9b48f;
  color: var(--hh-text-primary, #d9b48f);
    color: color-mix(in srgb, var(--hh-text-primary) 88%, #fff5e8);
    letter-spacing: 4px;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
  }

  .scene-meta {
    position: relative;
    z-index: 1;
    font-size: 10px;
    color: #bfa17a;
  color: var(--hh-text-secondary, #bfa17a);
    color: color-mix(in srgb, var(--hh-text-muted) 76%, #fff5e8);
    letter-spacing: 3px;
    white-space: nowrap;
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
    color: #bfa17a;
  color: var(--hh-text-secondary, #bfa17a);
    letter-spacing: 4px;
  }
}

/* 空状态 */
.empty-state {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 22px 20px;
  overflow: hidden;
  background:
    linear-gradient(90deg, transparent, color-mix(in srgb, var(--hh-bg-card) 64%, transparent), transparent),
    repeating-linear-gradient(112deg, transparent 0 20px, color-mix(in srgb, var(--hh-text-primary) 4%, transparent) 21px 22px);
  box-shadow: inset 0 0 20px color-mix(in srgb, var(--hh-glow-color) 12%, transparent);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at center, color-mix(in srgb, var(--hh-accent) 10%, transparent), transparent 62%);
    opacity: 0.66;
  }

  .empty-glyph {
    position: relative;
    z-index: 1;
    font-family: $font-铭文;
    font-size: 20px;
    color: rgba(217, 180, 143, 0.58);
  color: var(--hh-text-muted, rgba(217, 180, 143, 0.58));
  }

  .empty-text {
    position: relative;
    z-index: 1;
    font-size: 12px;
    color: rgba(217, 180, 143, 0.58);
  color: var(--hh-text-muted, rgba(217, 180, 143, 0.58));
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
