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
        :equipped-items="equippedItems"
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
    <div class="yinwen-section">
      <div
        class="yinwen-tattoo"
        :data-yinwen-progress="yinwenProgress"
        :style="{ '--yinwen-spread': yinwenSpread, '--yinwen-fill': yinwenFill }"
        role="img"
        :aria-label="`淫纹进度 ${yinwenProgress}%`"
      >
        <img class="yinwen-tattoo-img yinwen-tattoo-img--base" :src="yinwenTattooUrl" alt="" aria-hidden="true" />
        <img class="yinwen-tattoo-img yinwen-tattoo-img--fill" :src="yinwenTattooUrl" alt="" aria-hidden="true" />
        <span class="yinwen-flame" aria-hidden="true"></span>
      </div>
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
        <span class="transform-glyph">痕</span>
        <span class="transform-title">身体留痕 · 实时改塑</span>
        <span class="transform-pulse">{{ bodyPulseText }}</span>
      </div>
      <div class="body-signal-list" aria-label="身体实时变化">
        <div v-for="signal in bodySignals" :key="signal.key" class="body-signal" :data-signal-level="signal.level">
          <span class="signal-name">{{ signal.name }}</span>
          <span class="signal-thread" :style="{ '--signal-value': signal.value + '%' }"></span>
          <span class="signal-state">{{ signal.state }}</span>
          <span class="signal-text">{{ signal.text }}</span>
        </div>
      </div>
      <div class="transform-grid">
        <div
          v-for="mark in transformMarks"
          :key="mark.key"
          :class="['transform-item', `transform-item--${mark.stage}`, { done: mark.done }]"
          :style="{ '--mark-value': mark.value + '%' }"
        >
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
          <span class="item-trace">{{ mark.traceText }}</span>
          <span class="item-cause">{{ mark.cause }}</span>
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
import yinwenTattooUrl from '../../../../docs/75427087_p0.png?url';

const store = useDataStore();
const data = store.data;

const itemOpen = ref(false);

const P2_RUMOR_SOURCES = ['牝奴日课', '牝印命令', '调教余波', '宗门闲谈', '公开示众', '支配者传唤'];

const TRANSFORM_MARK_CONFIG = [
  { key: '泌乳', label: '乳泉', base: '灵息回流', active: '泉脉发热', doneText: '花瓣固染' },
  { key: '肛门', label: '后庭', base: '咒纹未驯', active: '暗纹收束', doneText: '咒链固化' },
  { key: '憋尿', label: '禁溺', base: '水脉平静', active: '禁令牵动', doneText: '禁咒成形' },
] as const;

type TransformKey = (typeof TRANSFORM_MARK_CONFIG)[number]['key'];
type TransformStage = 'silent' | 'stirring' | 'forming' | 'sealed';

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

const yinwenProgress = computed(() => clampValue(data.牝奴.堕落度));

const yinwenSpread = computed(() => `${8 + yinwenProgress.value * 0.58}%`);
const yinwenFill = computed(() => String(yinwenProgress.value / 100));

const yinwenLabel = computed(() => {
  if (yinwenProgress.value >= 100) return '淫纹满绽';
  if (yinwenProgress.value >= 75) return '淫纹成阵';
  if (yinwenProgress.value >= 50) return '淫纹游身';
  if (yinwenProgress.value >= 25) return '淫纹燃心';
  return '淫纹初醒';
});

const bodyPressure = computed(() =>
  clampValue(
    Math.round(
      data.牝奴.堕落度 * 0.42
        + (data.牝奴.牝阴决层数 / 9) * 24
        + (data.牝奴.命令强度 || 0) * 0.22
        + Math.min(data.牝奴.今日调教次数 || 0, 5) * 3,
    ),
  ),
);

const bodyPulseText = computed(() => {
  if (bodyPressure.value >= 78) return '血墨急涌';
  if (bodyPressure.value >= 52) return '牝印温燃';
  if (bodyPressure.value >= 24) return '暗纹微动';
  return '脂白未惊';
});

const bodySignals = computed(() => {
  const command = data.牝奴.当前命令 || '';
  const commandValue = clampValue(data.牝奴.命令强度 || 0);
  const yinjueValue = clampValue(Math.round((data.牝奴.牝阴决层数 / 9) * 100));
  const traceValue = clampValue(Math.max(data.牝奴.堕落度, yinjueValue));
  const restraintValue = clampValue(Math.min(100, equippedItems.value.length * 34 + commandValue * 0.35));

  return [
    {
      key: 'stigma',
      name: '牝印余温',
      value: Math.max(traceValue, commandValue),
      level: signalLevel(Math.max(traceValue, commandValue)),
      state: command ? '受令' : '静伏',
      text: command ? `${command}的残响仍压在灵识边缘。` : '印纹伏在脂白肌理下，只余温热暗流。',
    },
    {
      key: 'meridian',
      name: '灵脉牵制',
      value: yinjueValue,
      level: signalLevel(yinjueValue),
      state: data.牝奴.牝阴决层数 >= 6 ? '深染' : '游丝',
      text: data.牝奴.牝阴决层数 > 0 ? `牝阴决第 ${data.牝奴.牝阴决层数} 层沿暗金丝线缓慢运转。` : '灵息尚未成环，暗金丝线只在皮下若隐若现。',
    },
    {
      key: 'flower',
      name: '花谱染色',
      value: bodyPressure.value,
      level: signalLevel(bodyPressure.value),
      state: completedTransformCount.value > 0 ? `${completedTransformCount.value}/3` : '未定',
      text: transformTraceText.value,
    },
    {
      key: 'restraint',
      name: '法器压制',
      value: restraintValue,
      level: signalLevel(restraintValue),
      state: equippedItems.value.length > 0 ? '受缚' : '虚位',
      text: equippedItems.value.length > 0 ? `已有 ${equippedItems.value.length} 件法器留下拓印，行动被暗咒轻轻牵住。` : '拘束法器尚未扣合，花谱仍留出空白。',
    },
  ];
});

const completedTransformCount = computed(() =>
  TRANSFORM_MARK_CONFIG.filter(mark => Boolean(data.牝奴.改造进度?.[mark.key])).length,
);

const transformTraceText = computed(() => {
  if (data.牝奴.最近调教结算) return `${data.牝奴.最近调教结算}的余痕尚未散去。`;
  if (data.牝奴.今日调教次数 > 0) return `今日已留下 ${data.牝奴.今日调教次数} 道调教余痕。`;
  if (data.牝奴.当前日课 && data.牝奴.当前日课 !== '候命') return `${data.牝奴.当前日课}之后，花谱仍在缓慢回温。`;
  return '合欢花谱清透，只有极淡血墨停在瓣尖。';
});

const transformMarks = computed(() =>
  TRANSFORM_MARK_CONFIG.map(mark => {
    const value = getTransformValue(mark.key);
    const stage = getTransformStage(mark.key, value);
    const done = stage === 'sealed';
    return {
      ...mark,
      value,
      stage,
      done,
      traceText: getTransformTrace(mark.key, stage),
      cause: done ? mark.doneText : stage === 'silent' ? mark.base : mark.active,
    };
  }),
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

function clampValue(value: number) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function signalLevel(value: number) {
  if (value >= 72) return 'high';
  if (value >= 38) return 'mid';
  return 'low';
}

function getTransformValue(key: TransformKey) {
  if (data.牝奴.改造进度?.[key]) return 100;
  const command = data.牝奴.当前命令 || '';
  const commandBoost = getCommandBoost(key, command, data.牝奴.命令强度 || 0);
  const base = data.牝奴.堕落度 * 0.36 + (data.牝奴.牝阴决层数 / 9) * 26 + Math.min(data.牝奴.今日调教次数 || 0, 5) * 4;
  return clampValue(base + commandBoost);
}

function getCommandBoost(key: TransformKey, command: string, intensity: number) {
  if (!command) return 0;
  const directMap: Record<TransformKey, RegExp> = {
    泌乳: /乳|泉|哺|胸/,
    肛门: /后庭|肛|门|缚|跪/,
    憋尿: /尿|溺|禁|水|憋/,
  };
  const genericBoost = intensity >= 70 ? 12 : intensity >= 35 ? 7 : 3;
  return directMap[key].test(command) ? intensity * 0.32 : genericBoost;
}

function getTransformStage(key: TransformKey, value: number): TransformStage {
  if (data.牝奴.改造进度?.[key] || value >= 92) return 'sealed';
  if (value >= 62) return 'forming';
  if (value >= 24) return 'stirring';
  return 'silent';
}

function getTransformTrace(key: TransformKey, stage: TransformStage) {
  const traceMap: Record<TransformKey, Record<TransformStage, string>> = {
    泌乳: {
      silent: '清透未启',
      stirring: '乳泉微温',
      forming: '花瓣漫红',
      sealed: '乳泉成印',
    },
    肛门: {
      silent: '纹路未驯',
      stirring: '咒线收紧',
      forming: '暗纹成束',
      sealed: '后庭留咒',
    },
    憋尿: {
      silent: '水脉未锁',
      stirring: '禁意微涨',
      forming: '禁纹成环',
      sealed: '禁溺固印',
    },
  };
  return traceMap[key][stage];
}
</script>
<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.phase2-page {
  padding: 0 0 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--p2-incense);
  background:
    linear-gradient(180deg, rgba(var(--p2-skin-rgb), 0.96) 0%, rgba(var(--p2-skin-rgb), 0.78) 22%, rgba(var(--p2-skin-rgb), 0.9) 48%, rgba(var(--p2-skin-rgb), 0.98) 100%),
    radial-gradient(ellipse at top, var(--p2-mist), transparent 55%);
  position: relative;
}

.phase2-page::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% 8%, rgba(var(--p2-incense-rgb), 0.08) 0 1px, transparent 1.5px),
    radial-gradient(circle at 82% 18%, rgba(var(--p2-blood-rgb), 0.08) 0 1px, transparent 1.5px),
    linear-gradient(180deg, transparent 0 24%, rgba(var(--p2-blood-rgb), 0.04) 25%, transparent 26%);
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
    radial-gradient(ellipse at 50% 0, var(--p2-mist), transparent 58%),
    linear-gradient(180deg, rgba(var(--p2-skin-rgb), 0.82), rgba(var(--p2-skin-rgb), 0.94));
  box-shadow:
    inset 0 0 0 1px rgba(var(--p2-gold-rgb), 0.12),
    inset 0 0 24px rgba(var(--p2-blood-rgb), 0.05);
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
  background: linear-gradient(90deg, transparent, rgba(var(--p2-gold-rgb), 0.38), transparent);
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
  padding: 10px 14px 13px;
  background:
    radial-gradient(ellipse at 50% 16%, color-mix(in srgb, var(--p2-mist) 72%, transparent), transparent 62%),
    linear-gradient(180deg, rgba(var(--p2-skin-rgb), 0.56), rgba(var(--p2-skin-rgb), 0.9));
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--p2-gold) 8%, transparent),
    inset 0 -18px 28px color-mix(in srgb, var(--p2-blood) 4%, transparent);
  position: relative;
  overflow: hidden;
}

.transform-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  .transform-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: var(--p2-gold);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid color-mix(in srgb, var(--p2-gold) 28%, transparent);
    border-radius: 3px;
    background: rgba(var(--p2-skin-rgb), 0.56);
  }

  .transform-title {
    font-family: $font-铭文;
    font-size: 13px;
    color: color-mix(in srgb, var(--p2-incense) 78%, transparent);
    letter-spacing: 3px;
  }

  .transform-pulse {
    margin-left: auto;
    font-family: $font-铭文;
    font-size: 11px;
    color: var(--p2-blood);
    letter-spacing: 2px;
    text-shadow: 0 0 8px color-mix(in srgb, var(--p2-blood) 18%, transparent);
    white-space: nowrap;
  }
}

.body-signal-list {
  display: grid;
  gap: 5px;
  margin-bottom: 10px;
}

.body-signal {
  display: grid;
  grid-template-columns: 62px minmax(56px, 1fr) 38px;
  grid-template-areas:
    'name thread state'
    'text text text';
  gap: 3px 8px;
  align-items: center;
  padding: 6px 8px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--p2-gold) 7%, transparent), transparent 34%, color-mix(in srgb, var(--p2-blood) 6%, transparent)),
    rgba(var(--p2-skin-rgb), 0.46);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--p2-gold) 10%, transparent);
}

.signal-name,
.signal-state {
  font-family: $font-铭文;
  font-size: 10px;
  letter-spacing: 2px;
  white-space: nowrap;
}

.signal-name {
  grid-area: name;
  color: color-mix(in srgb, var(--p2-incense) 76%, transparent);
}

.signal-state {
  grid-area: state;
  justify-self: end;
  color: var(--p2-gold);
}

.signal-thread {
  grid-area: thread;
  height: 5px;
  border-radius: 999px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--p2-gold) 16%, transparent), color-mix(in srgb, var(--p2-blood) 12%, transparent)),
    rgba(var(--p2-skin-rgb), 0.6);
  box-shadow: inset 0 1px 2px color-mix(in srgb, var(--p2-incense) 12%, transparent);
  overflow: hidden;
  position: relative;
}

.signal-thread::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--signal-value, 0%);
  background: linear-gradient(90deg, var(--p2-gold), var(--p2-blood));
  box-shadow: 0 0 8px color-mix(in srgb, var(--p2-blood) 22%, transparent);
  animation: body-thread-breathe 3.2s ease-in-out infinite;
}

.signal-text {
  grid-area: text;
  font-size: 11px;
  line-height: 1.45;
  color: color-mix(in srgb, var(--p2-incense) 62%, transparent);
}

.body-signal[data-signal-level='high'] .signal-state {
  color: var(--p2-blood);
}

.body-signal[data-signal-level='high'] .signal-thread::before {
  animation-duration: 1.45s;
}

@keyframes body-thread-breathe {
  0%, 100% { filter: saturate(0.92); opacity: 0.72; }
  50% { filter: saturate(1.24); opacity: 1; }
}

.transform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
  gap: 8px;
}

.transform-item {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  grid-template-areas:
    'icon label'
    'icon trace'
    'icon cause';
  align-items: center;
  column-gap: 8px;
  row-gap: 2px;
  min-height: 58px;
  padding: 7px 8px;
  border: 1px solid color-mix(in srgb, var(--p2-gold) 18%, transparent);
  border-radius: 2px;
  transition: all 0.4s ease;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--p2-mist) 50%, transparent), transparent 72%),
    rgba(var(--p2-skin-rgb), 0.72);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: auto 0 0 0;
    height: 2px;
    width: var(--mark-value, 0%);
    background: linear-gradient(90deg, var(--p2-gold), var(--p2-blood));
    opacity: 0.58;
    transition: width 0.5s ease;
  }

  .item-icon {
    grid-area: icon;
    width: 23px;
    height: 32px;
    display: grid;
    place-items: center;
    border: 1px solid color-mix(in srgb, var(--p2-gold) 22%, transparent);
    border-radius: 999px 999px 82% 82%;
    color: color-mix(in srgb, var(--p2-incense) 38%, transparent);
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
    fill: color-mix(in srgb, var(--p2-incense) 12%, transparent);
    stroke: color-mix(in srgb, var(--p2-gold) 48%, transparent);
    stroke-width: 1.1;
    transition: all 0.42s ease;
  }

  .item-label {
    grid-area: label;
    font-size: 12px;
    color: color-mix(in srgb, var(--p2-incense) 78%, transparent);
    letter-spacing: 3px;
    transition: color 0.4s ease;
  }

  .item-trace {
    grid-area: trace;
    font-size: 10px;
    color: color-mix(in srgb, var(--p2-incense) 58%, transparent);
    letter-spacing: 2px;
  }

  .item-cause {
    grid-area: cause;
    font-size: 10px;
    color: color-mix(in srgb, var(--p2-gold) 74%, var(--p2-incense));
    letter-spacing: 2px;
  }

  &.transform-item--stirring,
  &.transform-item--forming,
  &.done {
    border-color: color-mix(in srgb, var(--p2-blood) 24%, var(--p2-gold));
    background:
      radial-gradient(ellipse at 0 50%, color-mix(in srgb, var(--p2-blood) 14%, transparent), transparent 72%),
      rgba(var(--p2-skin-rgb), 0.82);
  }

  &.transform-item--forming,
  &.done {
    .item-icon {
      opacity: 1;
      border-color: color-mix(in srgb, var(--p2-blood) 34%, transparent);
      box-shadow: inset 0 0 14px color-mix(in srgb, var(--p2-blood) 12%, transparent);
      animation: bud-bloom 2.2s ease-in-out infinite;
    }

    .flower-petal {
      fill: color-mix(in srgb, var(--p2-blood) 26%, transparent);
      stroke: color-mix(in srgb, var(--p2-blood) 70%, transparent);
    }

    .flower-core {
      fill: color-mix(in srgb, var(--p2-blood) 52%, transparent);
      stroke: color-mix(in srgb, var(--p2-blood) 74%, transparent);
    }

    .item-label {
      color: var(--p2-blood);
    }
  }

  &.done::after {
    content: '';
    position: absolute;
    inset: 5px;
    background:
      linear-gradient(120deg, transparent 0 38%, color-mix(in srgb, var(--p2-gold) 15%, transparent) 39% 41%, transparent 42% 100%),
      linear-gradient(60deg, transparent 0 48%, color-mix(in srgb, var(--p2-gold) 12%, transparent) 49% 51%, transparent 52% 100%);
    pointer-events: none;
    opacity: 0.82;
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

/* 淫纹视觉 — 子宫心印：以纹身图为底，从内向外血墨扩散 */
.yinwen-section {
  border: none;
  border-radius: 2px;
  padding: 12px 14px 11px;
  text-align: center;
  background:
    radial-gradient(ellipse at 50% 42%, color-mix(in srgb, var(--p2-blood) 18%, transparent) 0%, transparent 62%),
    linear-gradient(180deg, rgba(var(--p2-skin-rgb), 0.84), rgba(var(--p2-skin-rgb), 0.96));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--p2-gold) 8%, transparent);
  overflow: hidden;
}

.yinwen-tattoo {
  --yinwen-spread: 8%;
  --yinwen-fill: 0;
  width: min(292px, 96%);
  aspect-ratio: 1 / 1;
  margin: 0 auto 6px;
  position: relative;
  display: grid;
  place-items: center;
  isolation: isolate;
  transform: translateY(2px);
}

.yinwen-tattoo::before {
  content: '';
  position: absolute;
  inset: 12% 10% 2%;
  background:
    radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--p2-blood) 26%, transparent), transparent var(--yinwen-spread)),
    radial-gradient(ellipse at 50% 58%, color-mix(in srgb, var(--p2-gold) 12%, transparent), transparent 64%);
  filter: blur(8px);
  opacity: calc(var(--yinwen-fill) * 0.9);
  animation: yinwen-fire-pulse 2.8s ease-in-out infinite;
  z-index: 0;
}

.yinwen-tattoo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  grid-area: 1 / 1;
  pointer-events: none;
  user-select: none;
}

.yinwen-tattoo-img--base {
  position: relative;
  z-index: 1;
  opacity: 0.28;
  mix-blend-mode: multiply;
  filter: grayscale(0.55) sepia(0.28) saturate(0.62) hue-rotate(-18deg);
}

.yinwen-tattoo-img--fill {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: var(--yinwen-fill);
  mix-blend-mode: multiply;
  clip-path: circle(var(--yinwen-spread) at 50% 50%);
  filter:
    saturate(1.5)
    hue-rotate(-10deg)
    contrast(1.08)
    drop-shadow(0 0 7px color-mix(in srgb, var(--p2-blood) 34%, transparent));
  transition: clip-path 0.7s ease, opacity 0.7s ease, filter 0.7s ease;
}

.yinwen-flame {
  position: absolute;
  z-index: 3;
  left: 32%;
  right: 32%;
  top: 42%;
  bottom: 20%;
  background:
    radial-gradient(circle at 50% 16%, color-mix(in srgb, var(--p2-blood) 28%, transparent), transparent 38%),
    radial-gradient(ellipse at 50% 62%, color-mix(in srgb, var(--p2-blood) 18%, transparent), transparent 70%);
  filter: blur(7px);
  opacity: calc(var(--yinwen-fill) * 0.84);
  mix-blend-mode: multiply;
  animation: yinwen-fire-rise 2.4s ease-in-out infinite;
}

.yinwen-label {
  font-size: 11px;
  color: color-mix(in srgb, var(--p2-incense) 58%, transparent);
  letter-spacing: 4px;
}

@keyframes yinwen-fire-pulse {
  0%, 100% { transform: scale(0.96); opacity: calc(var(--yinwen-fill) * 0.62); }
  50% { transform: scale(1.05); opacity: calc(var(--yinwen-fill) * 0.96); }
}

@keyframes yinwen-fire-rise {
  0%, 100% { transform: translateY(3px) scaleY(0.95); }
  50% { transform: translateY(-2px) scaleY(1.08); }
}
</style>
