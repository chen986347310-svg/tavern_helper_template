<template>
  <div class="phase2-page">
    <div class="phase2-console">
      <StigmaCore
        :corruption="data.牝奴.堕落度"
        :yinjue-layer="data.牝奴.牝阴决层数"
        :command="data.牝奴.当前命令"
        :intensity="data.牝奴.命令强度"
      />
      <DailyRoutinePanel
        :routine="data.牝奴.当前日课"
        :count="data.牝奴.今日调教次数"
        :settlement="data.牝奴.最近调教结算"
      />
      <DominatorPanel
        :current="data.牝奴.当前支配者"
        :last="data.牝奴.上次支配者"
        :counts="data.牝奴.支配次数"
      />
      <WhisperPanel :rumors="p2Rumors" @chase-rumor="queueShameRumor" />
      <BrandTagsPanel :tags="data.牝奴.羞名标签" />
    </div>

    <!-- 淫纹视觉 -->
    <div class="yinwen-section" v-if="data.牝奴.堕落度 >= 50">
      <svg class="yinwen-sigil" :data-yinwen-count="yinwenCount" viewBox="0 0 200 150" aria-hidden="true">
        <g :class="['yinwen-piece', 'yinwen-piece--core', { active: isYinwenSegmentActive('core') }]">
          <path d="M100 64 C96 58 87 57 87 63 C87 70 100 77 100 77 C100 77 113 70 113 63 C113 57 104 58 100 64Z" />
          <path d="M100 62 C98 59.5 93 59 93 63 C93 67 100 71 100 71 C100 71 107 67 107 63 C107 59 102 59.5 100 62" />
        </g>
        <g :class="['yinwen-piece', 'yinwen-piece--left', { active: isYinwenSegmentActive('left') }]">
          <path d="M100 36 C88 40 79 50 79 61 C79 73 87 80 98 82" />
          <path d="M81 46 C67 36 51 32 39 38" />
          <circle cx="36" cy="38" r="3.5" />
          <path d="M39 38 C27 48 19 62 19 76" />
          <path d="M79 63 C63 67 49 77 41 91" />
        </g>
        <g :class="['yinwen-piece', 'yinwen-piece--right', { active: isYinwenSegmentActive('right') }]">
          <path d="M100 36 C112 40 121 50 121 61 C121 73 113 80 102 82" />
          <path d="M119 46 C133 36 149 32 161 38" />
          <circle cx="164" cy="38" r="3.5" />
          <path d="M161 38 C173 48 181 62 181 76" />
          <path d="M121 63 C137 67 151 77 159 91" />
        </g>
        <g :class="['yinwen-piece', 'yinwen-piece--crown', { active: isYinwenSegmentActive('crown') }]">
          <path d="M39 38 C41 26 49 16 61 12" />
          <path d="M161 38 C159 26 151 16 139 12" />
          <path d="M61 12 C77 6 92 4 100 4 C108 4 123 6 139 12" />
          <path d="M73 14 C85 9 95 7 100 7 C105 7 115 9 127 14" />
        </g>
        <g :class="['yinwen-piece', 'yinwen-piece--root', { active: isYinwenSegmentActive('root') }]">
          <path d="M98 82 C97 92 95 102 93 112" />
          <path d="M102 82 C103 92 105 102 107 112" />
          <path d="M93 112 C85 122 79 130 75 138" />
          <path d="M107 112 C115 122 121 130 125 138" />
          <path d="M75 138 C87 144 100 148 100 148 C100 148 113 144 125 138" />
        </g>
      </svg>
      <div class="yinwen-label">{{ yinwenLabel }}</div>
    </div>

    <!-- 堕落阶段描述 -->
    <div class="stage-card">
      <div class="stage-header">
        <span class="stage-glyph">堕</span>
        <span class="stage-title">{{ stageName }}</span>
      </div>
      <div class="stage-desc">道心侵蚀 {{ data.牝奴.堕落度 }}% — {{ stageDescription }}</div>
    </div>

    <!-- 身躯改塑 -->
    <div class="transform-section">
      <div class="transform-header">
        <span class="transform-glyph">造</span>
        <span class="transform-title">身躯改塑</span>
      </div>
      <div class="transform-grid">
        <div v-for="mark in transformMarks" :key="mark.key" :class="['transform-item', { done: mark.done }]">
          <span class="item-icon transform-flower" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <path class="flower-petal flower-petal--top" d="M32 9 C39 18 39 26 32 32 C25 26 25 18 32 9Z" />
              <path class="flower-petal flower-petal--right" d="M55 31 C46 39 38 39 32 32 C38 25 46 24 55 31Z" />
              <path class="flower-petal flower-petal--bottom" d="M32 55 C25 46 25 38 32 32 C39 38 39 46 32 55Z" />
              <path class="flower-petal flower-petal--left" d="M9 31 C18 24 26 25 32 32 C26 39 18 39 9 31Z" />
              <circle class="flower-core" cx="32" cy="32" r="5" />
            </svg>
          </span>
          <span class="item-label">{{ mark.label }}</span>
          <span class="item-trace">{{ mark.done ? mark.doneText : mark.pendingText }}</span>
        </div>
      </div>
    </div>

    <!-- 牝阴决层数 -->
    <div class="yinjue-section">
      <div class="yinjue-header">
        <span class="yinjue-glyph">决</span>
        <span class="yinjue-title">牝阴决</span>
        <span class="yinjue-value">{{ data.牝奴.牝阴决层数 }}/9</span>
      </div>
      <div class="yinjue-bar">
        <div class="yinjue-fill" :style="{ width: (data.牝奴.牝阴决层数 / 9) * 100 + '%' }"></div>
      </div>
    </div>

    <!-- 拘束法器折叠面板 -->
    <div class="item-section">
      <button class="item-toggle" @click="itemOpen = !itemOpen">
        <span class="item-glyph">器</span>
        <span>拘束法器</span>
        <span class="item-count">{{ itemCountText }}</span>
        <span class="item-arrow">{{ itemOpen ? '▴' : '▾' }}</span>
      </button>
      <div :class="['item-list', { open: itemOpen }]">
        <div class="item-inner">
          <div v-if="equippedItems.length === 0" class="item-empty">
            <div class="chain-tray" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="tray-text">虚位以待</span>
          </div>
          <div v-for="item in equippedItems" :key="item" class="item-row">
            <span class="item-row-lock" aria-hidden="true">锁</span>
            <span>{{ getItemDisplayName(item) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from '../store';
import { get堕落度阶段 } from '../guards';
import BrandTagsPanel from '../components/phase2/BrandTagsPanel.vue';
import DailyRoutinePanel from '../components/phase2/DailyRoutinePanel.vue';
import DominatorPanel from '../components/phase2/DominatorPanel.vue';
import StigmaCore from '../components/phase2/StigmaCore.vue';
import WhisperPanel, { type P2WhisperRumor } from '../components/phase2/WhisperPanel.vue';
import { getItemDisplayName } from '../data/itemDisplay';

const store = useDataStore();
const data = store.data;

const itemOpen = ref(false);

const P2_RUMOR_SOURCES = ['牝奴日课', '牝印命令', '调教余波', '宗门闲谈', '公开示众', '支配者传唤'];

const TRANSFORM_MARK_CONFIG = [
  { key: '泌乳', label: '乳泉', glyph: '乳', doneGlyph: '沁', pendingText: '未启', doneText: '已醒' },
  { key: '肛门', label: '后庭', glyph: '门', doneGlyph: '缚', pendingText: '未驯', doneText: '已驯' },
  { key: '憋尿', label: '禁溺', glyph: '禁', doneGlyph: '潮', pendingText: '未锁', doneText: '已锁' },
] as const;

const YINWEN_SEGMENT_KEYS = ['core', 'left', 'right', 'crown', 'root'] as const;

const stageName = computed(() => get堕落度阶段(data.牝奴.堕落度));

const stageDescription = computed(() => {
  const 堕落度 = data.牝奴.堕落度;
  if (堕落度 < 10) return '意识清醒, 内心抵抗身体的异变';
  if (堕落度 < 30) return '身体开始背叛意志, 快感阈值降低';
  if (堕落度 < 50) return '本能逐渐凌驾理智, 渴望被支配';
  if (堕落度 < 70) return '淫纹显现, 情欲如潮无法自控';
  if (堕落度 < 90) return '身心彻底沉溺, 主动索求一切';
  return '雌堕完成, 已然成为欲望的化身';
});

const yinwenCount = computed(() => {
  const d = data.牝奴.堕落度;
  if (d >= 90) return 5;
  if (d >= 70) return 4;
  if (d >= 60) return 3;
  if (d >= 50) return 2;
  return 0;
});

function isYinwenSegmentActive(key: (typeof YINWEN_SEGMENT_KEYS)[number]) {
  return YINWEN_SEGMENT_KEYS.indexOf(key) < yinwenCount.value;
}

const yinwenLabel = computed(() => {
  if (yinwenCount.value >= 5) return '淫纹满绽';
  if (yinwenCount.value >= 4) return '淫纹成阵';
  if (yinwenCount.value >= 3) return '淫纹游身';
  return '淫纹初醒';
});

const transformMarks = computed(() =>
  TRANSFORM_MARK_CONFIG.map(mark => ({
    ...mark,
    done: Boolean(data.牝奴.改造进度?.[mark.key]),
  })),
);

const equippedItems = computed(() => {
  return data.道具.装备['玩家'] || [];
});

const itemCountText = computed(() => (equippedItems.value.length > 0 ? `已佩 ${equippedItems.value.length}` : '未佩'));

const p2Rumors = computed(() =>
  ((data.系统.风声列表 ?? []) as P2WhisperRumor[])
    .filter(rumor => P2_RUMOR_SOURCES.includes(rumor.来源 ?? '') && rumor.状态 !== '已失效')
    .slice(0, 3),
);

function queueShameRumor(rumor: P2WhisperRumor & { 子区域?: string; 故事钩子?: string; 羞名等级?: string }) {
  const sceneContext = data.系统.场景上下文;
  data.系统.待处理交互 ??= [];
  data.系统.当前追查风声ID = rumor.id || '';
  data.系统.待处理交互.push({
    类型: '追查风声',
    目标: '玩家',
    道具: '',
    数量: 1,
    时辰: data.系统.时辰,
    场景: data.系统.当前场景,
    地点: rumor.地点 || sceneContext?.地点 || data.系统.当前场景,
    子区域: rumor.子区域 || sceneContext?.子区域 || '',
    风声ID: rumor.id || '',
    故事钩子: rumor.故事钩子 || rumor.风声文本 || '',
    在场NPC: sceneContext?.在场NPC ?? [],
    道具显示名: '',
    器阶: '',
    作用部位: '',
    丹药分类: '',
    作用线: '',
    剧情线: '牝奴羞名',
    关联NPC: data.牝奴.当前支配者 || data.牝奴.上次支配者 || '',
    秘密主题: rumor.羞名等级 || '微闻',
    入口类型: '特殊事件',
    线索ID: rumor.id || '',
    AI短提示: `P2羞名风声：请把${rumor.羞名等级 || '微闻'}承接为传唤、日课异动、公开凝视或支配事件。`,
  } as any);
}
</script>
<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.phase2-page {
  --p2-skin: #fffdf9;
  --p2-incense: #5a423a;
  --p2-blood: #c84b5b;
  --p2-gold: #a38353;
  --p2-mist: rgba(234, 168, 155, 0.2);
  padding: 0 0 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--p2-incense);
  background:
    linear-gradient(180deg, rgba(255, 253, 249, 0.96) 0%, rgba(255, 253, 249, 0.78) 22%, rgba(255, 253, 249, 0.9) 48%, rgba(255, 253, 249, 0.98) 100%),
    radial-gradient(ellipse at top, rgba(234, 168, 155, 0.2), transparent 55%);
  position: relative;
}

.phase2-page::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% 8%, rgba(90, 66, 58, 0.08) 0 1px, transparent 1.5px),
    radial-gradient(circle at 82% 18%, rgba(200, 75, 91, 0.08) 0 1px, transparent 1.5px),
    linear-gradient(180deg, transparent 0 24%, rgba(200, 75, 91, 0.04) 25%, transparent 26%);
  background-size: 20px 20px, 26px 26px, 100% 100%;
  opacity: 0.7;
}

.phase2-console {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 6px;
  padding: 10px 10px 12px;
  border: 0;
  border-radius: 2px;
  background:
    radial-gradient(ellipse at 50% 0, rgba(234, 168, 155, 0.18), transparent 58%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 253, 249, 0.94));
  box-shadow:
    inset 0 0 0 1px rgba(163, 131, 83, 0.12),
    inset 0 0 24px rgba(200, 75, 91, 0.05);
  position: relative;
  overflow: hidden;
}

.phase2-console::before,
.phase2-console::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(163, 131, 83, 0.38), transparent);
}

.phase2-console::before { top: 0; }
.phase2-console::after { bottom: 0; }

.phase2-console > * {
  position: relative;
  z-index: 1;
}

/* 堕落阶段卡片 */
.stage-card {
  border: none;
  border-radius: 2px;
  padding: 10px 14px 12px;
  background:
    linear-gradient(180deg, rgba(255, 253, 249, 0.64), rgba(255, 253, 249, 0.86)),
    radial-gradient(ellipse at 18% 50%, rgba(200, 75, 91, 0.12), transparent 70%);
  position: relative;
  box-shadow: inset 0 0 0 1px rgba(163, 131, 83, 0.08);
}

.stage-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .stage-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: var(--hh-gold);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(163, 131, 83, 0.28);
    border-radius: 3px;
    background: rgba(255, 253, 249, 0.56);
  }

  .stage-title {
    font-family: $font-铭文;
    font-size: 14px;
    color: var(--p2-blood);
    letter-spacing: 3px;
  }
}

.stage-desc {
  font-size: 12px;
  color: rgba(90, 66, 58, 0.78);
  line-height: 1.6;
}

/* 身躯改塑 */
.transform-section {
  border: none;
  border-radius: 2px;
  padding: 10px 14px 12px;
  background:
    linear-gradient(180deg, rgba(255, 253, 249, 0.56), rgba(255, 253, 249, 0.9));
  box-shadow: inset 0 0 0 1px rgba(163, 131, 83, 0.08);
}

.transform-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  .transform-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: var(--hh-gold);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(163, 131, 83, 0.28);
    border-radius: 3px;
    background: rgba(255, 253, 249, 0.56);
  }

  .transform-title {
    font-family: $font-铭文;
    font-size: 13px;
    color: rgba(90, 66, 58, 0.74);
    letter-spacing: 3px;
  }
}

.transform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: 8px;
}

.transform-item {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  grid-template-areas:
    'icon label'
    'icon trace';
  align-items: center;
  column-gap: 8px;
  row-gap: 2px;
  min-height: 48px;
  padding: 7px 8px;
  border: 1px solid rgba(163, 131, 83, 0.18);
  border-radius: 2px;
  transition: all 0.4s ease;
  background:
    linear-gradient(90deg, rgba(234, 168, 155, 0.1), transparent 72%),
    rgba(255, 253, 249, 0.72);

  .item-icon {
    grid-area: icon;
    width: 23px;
    height: 32px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(163, 131, 83, 0.22);
    border-radius: 999px 999px 82% 82%;
    color: var(--hh-text-muted);
    opacity: 0.82;
    transition: all 0.4s ease;
  }

  .item-icon svg {
    width: 20px;
    height: 20px;
    overflow: visible;
  }

  .flower-petal,
  .flower-core {
    fill: rgba(90, 66, 58, 0.12);
    stroke: rgba(163, 131, 83, 0.48);
    stroke-width: 1.1;
    transition: all 0.42s ease;
  }

  .item-label {
    grid-area: label;
    font-size: 12px;
    color: rgba(90, 66, 58, 0.78);
    letter-spacing: 3px;
    transition: color 0.4s ease;
  }

  .item-trace {
    grid-area: trace;
    font-size: 10px;
    color: rgba(90, 66, 58, 0.52);
    letter-spacing: 2px;
  }

  &.done {
    border-color: rgba(200, 75, 91, 0.34);
    background:
      radial-gradient(ellipse at 0 50%, rgba(200, 75, 91, 0.14), transparent 72%),
      rgba(255, 253, 249, 0.82);

    .item-icon {
      opacity: 1;
      border-color: rgba(200, 75, 91, 0.34);
      box-shadow: inset 0 0 14px rgba(200, 75, 91, 0.12);
      animation: bud-bloom 2.2s ease-in-out infinite;
    }

    .flower-petal {
      fill: rgba(200, 75, 91, 0.26);
      stroke: rgba(200, 75, 91, 0.7);
    }

    .flower-core {
      fill: rgba(200, 75, 91, 0.52);
      stroke: rgba(200, 75, 91, 0.74);
    }

    .item-label {
      color: var(--p2-blood);
    }
  }
}

@keyframes bud-bloom {
  0%, 100% { transform: scale(1); opacity: 0.86; }
  50% { transform: scale(1.03); opacity: 1; }
}

/* 牝阴决 */
.yinjue-section {
  border: none;
  border-radius: 2px;
  padding: 10px 14px 12px;
  background:
    linear-gradient(180deg, rgba(255, 253, 249, 0.62), rgba(255, 253, 249, 0.88));
  box-shadow: inset 0 0 0 1px rgba(163, 131, 83, 0.08);
}

.yinjue-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .yinjue-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: var(--hh-gold);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(163, 131, 83, 0.28);
    border-radius: 3px;
    background: rgba(255, 253, 249, 0.56);
  }

  .yinjue-title {
    font-family: $font-铭文;
    font-size: 13px;
    color: rgba(90, 66, 58, 0.78);
    letter-spacing: 3px;
    flex: 1;
  }

  .yinjue-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--p2-blood);
    text-shadow: 0 0 8px rgba(200, 75, 91, 0.18);
    letter-spacing: 2px;
  }
}

.yinjue-bar {
  height: 10px;
  padding: 2px;
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgba(234, 168, 155, 0.34), rgba(163, 131, 83, 0.18)),
    rgba(255, 253, 249, 0.7);
  box-shadow:
    inset 0 1px 2px rgba(80, 50, 40, 0.22),
    inset 0 -1px 0 rgba(255, 255, 255, 0.72);
  overflow: visible;
  position: relative;

  .yinjue-fill {
    height: 100%;
    border-radius: inherit;
    transition: width 0.6s ease;
    background: linear-gradient(90deg, rgba(90, 66, 58, 0.72), rgba(200, 75, 91, 0.76));
    box-shadow: 0 0 8px rgba(200, 75, 91, 0.14), 0 0 16px rgba(200, 75, 91, 0.08);
    animation: incense-burn 4s ease-in-out infinite;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: -2px;
      top: -2px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--p2-blood);
      box-shadow: 0 0 8px rgba(200, 75, 91, 0.26);
      animation: ember-pulse 1.5s ease-in-out infinite;
    }
  }
}

@keyframes incense-burn {
  0%, 100% { filter: saturate(0.96); }
  50% { filter: saturate(1.18); }
}

@keyframes ember-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

/* 拘束法器 */
.item-section {
  border: none;
  border-radius: 2px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 253, 249, 0.64), rgba(255, 253, 249, 0.9));
  box-shadow: inset 0 0 0 1px rgba(163, 131, 83, 0.08);
}

.item-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: none;
  border: none;
  color: rgba(90, 66, 58, 0.76);
  font-family: $font-铭文;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(90deg, transparent, rgba(234, 168, 155, 0.18), transparent);
  }

  .item-glyph {
    font-size: 14px;
    color: var(--hh-gold);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(163, 131, 83, 0.28);
    border-radius: 3px;
    background: rgba(255, 253, 249, 0.56);
  }

  .item-arrow {
    margin-left: auto;
  }
}

.item-count {
  margin-left: auto;
  color: rgba(90, 66, 58, 0.52);
  font-size: 11px;
  letter-spacing: 2px;
}

.item-toggle .item-count + .item-arrow {
  margin-left: 4px;
}

.item-list {
  @include expand-panel;
}

.item-inner {
  padding: 0 14px 12px;
}

.item-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 0;

  .chain-tray {
    width: min(220px, 82%);
    height: 18px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    align-items: center;
    opacity: 0.58;
  }

  .chain-tray span {
    height: 7px;
    border: 1px solid rgba(163, 131, 83, 0.28);
    transform: skewX(-18deg);
    background:
      linear-gradient(90deg, rgba(163, 131, 83, 0.18), rgba(90, 66, 58, 0.1)),
      rgba(255, 253, 249, 0.52);
  }

  .tray-text {
    font-family: $font-铭文;
    font-size: 11px;
    color: rgba(90, 66, 58, 0.5);
    letter-spacing: 4px;
    opacity: 0.5;
  }
}

.item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  font-size: 12px;
  color: rgba(90, 66, 58, 0.78);
  border-bottom: 1px solid rgba(163, 131, 83, 0.14);

  &:last-child {
    border-bottom: none;
  }
}

.item-row-lock {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(163, 131, 83, 0.28);
  color: var(--hh-gold, #a38353);
  font-family: $font-铭文;
  font-size: 10px;
}

/* 淫纹视觉 — 子宫心印：从内到外的经脉符文生长 */
.yinwen-section {
  border: none;
  border-radius: 2px;
  padding: 14px 14px 12px;
  text-align: center;
  background:
    radial-gradient(ellipse at 50% 42%, rgba(200, 75, 91, 0.2) 0%, transparent 62%),
    linear-gradient(180deg, rgba(255, 253, 249, 0.84), rgba(255, 253, 249, 0.96));
  box-shadow: inset 0 0 0 1px rgba(163, 131, 83, 0.08);
}

.yinwen-sigil {
  width: min(240px, 80%);
  height: auto;
  margin: 0 auto 6px;
  display: block;
  overflow: visible;
}

/* 通用：所有符文层默认为幽灵线条 — 可见全貌但未激活 */
.yinwen-piece {
  fill: none;
  stroke: rgba(90, 66, 58, 0.22);
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: opacity 0.7s ease, stroke 0.7s ease, filter 0.7s ease;
}

.yinwen-piece path,
.yinwen-piece circle {
  vector-effect: non-scaling-stroke;
}

.yinwen-piece circle {
  fill: none;
}

/* 层级粗细：内粗外细，经脉能量从子宫向外消散 */
.yinwen-piece--core  { stroke-width: 2.2; opacity: 0.22; }
.yinwen-piece--left  { stroke-width: 1.7; opacity: 0.18; }
.yinwen-piece--right { stroke-width: 1.7; opacity: 0.18; }
.yinwen-piece--crown { stroke-width: 1.3; opacity: 0.13; }
.yinwen-piece--root  { stroke-width: 1.1; opacity: 0.13; }

/* 激活态：符文点燃，从心印向外依次发光 */
.yinwen-piece.active {
  opacity: 1;
  stroke: color-mix(in srgb, var(--p2-blood) 86%, var(--p2-gold));
  filter: drop-shadow(0 0 6px rgba(200, 75, 91, 0.36));
  animation: yinwen-glow 3s ease-in-out infinite;
}

/* 心印激活：额外脉冲光晕 */
.yinwen-piece--core.active {
  stroke-width: 2.4;
  filter: drop-shadow(0 0 10px rgba(200, 75, 91, 0.46));
}

/* 心印外层爱心获得极淡粉色填充 */
.yinwen-piece--core.active path:first-child {
  fill: rgba(200, 75, 91, 0.12);
}

.yinwen-label {
  font-size: 11px;
  color: rgba(90, 66, 58, 0.58);
  letter-spacing: 4px;
}

@keyframes yinwen-glow {
  0%, 100% { opacity: 0.82; filter: drop-shadow(0 0 5px rgba(200, 75, 91, 0.18)); }
  50% { opacity: 1; filter: drop-shadow(0 0 14px rgba(200, 75, 91, 0.32)); }
}
</style>
