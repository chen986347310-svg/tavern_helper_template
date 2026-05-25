<template>
  <section class="p2-whisper-panel" aria-label="听风羞名">
    <div class="panel-kicker"><span aria-hidden="true">听</span>听风羞名</div>
    <div v-if="visibleRumors.length === 0" class="whisper-empty">风铃暂歇</div>
    <button
      v-for="rumor in visibleRumors"
      v-else
      :key="rumor.id || rumor.风声文本"
      type="button"
      :class="['whisper-item', { 'whisper-item--locked': lockedRumorId === (rumor.id || rumor.风声文本) }]"
      data-testid="p2-whisper-action"
      @click="lockRumor(rumor)"
    >
      <span class="whisper-head">
        <span class="whisper-marker" aria-hidden="true">{{ get羞名Marker(rumor.羞名等级).glyph }}</span>
        <span>{{ rumor.来源 || '低语' }}</span>
        <span>{{ get羞名Marker(rumor.羞名等级).level }}</span>
        <span>{{ rumor.地点 || '莲灯前苑' }}</span>
      </span>
      <span class="whisper-text">{{ rumor.风声文本 }}</span>
      <span v-if="rumor.故事钩子" class="whisper-hook">{{ rumor.故事钩子 }}</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { get羞名Marker } from '../../data/phase2Display';

export type P2WhisperRumor = {
  id?: string;
  来源?: string;
  地点: string;
  风声文本: string;
  状态?: string;
  羞名等级?: string;
  故事钩子?: string;
};

const props = defineProps<{ rumors: P2WhisperRumor[] }>();
const emit = defineEmits<{ 'chase-rumor': [rumor: P2WhisperRumor] }>();

const visibleRumors = computed(() => (props.rumors ?? []).filter(rumor => rumor.状态 !== '已失效').slice(0, 3));
const lockedRumorId = ref('');

function lockRumor(rumor: P2WhisperRumor) {
  lockedRumorId.value = rumor.id || rumor.风声文本;
  emit('chase-rumor', rumor);
}
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;

.p2-whisper-panel {
  --p2-skin: #fffdf9;
  --p2-incense: #5a423a;
  --p2-blood: #c84b5b;
  --p2-gold: #a38353;
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 12px 12px 14px;
  border: 0;
  border-radius: 2px;
  background:
    radial-gradient(ellipse at 45% 20%, rgba(234, 168, 155, 0.12), transparent 58%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.38), rgba(234, 222, 209, 0.12)),
    var(--p2-skin);
  color: var(--p2-incense);
  position: relative;
  overflow: hidden;
}

.p2-whisper-panel::before,
.p2-whisper-panel::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(163, 131, 83, 0.42), transparent);
}

.p2-whisper-panel::before { top: 0; }
.p2-whisper-panel::after { bottom: 0; }

.panel-kicker {
  color: var(--p2-gold);
  font-size: 11px;
  letter-spacing: 3px;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  z-index: 1;
}

.panel-kicker span {
  width: 17px;
  height: 17px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(163, 131, 83, 0.34);
  color: var(--p2-blood);
  font-size: 10px;
}

.whisper-empty {
  color: rgba(90, 66, 58, 0.52);
  font-size: 12px;
  letter-spacing: 3px;
  padding: 14px 0 12px;
  position: relative;
  text-align: center;
}

.whisper-empty::before,
.whisper-empty::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 28%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(163, 131, 83, 0.28), transparent);
}

.whisper-empty::before { left: 0; }
.whisper-empty::after { right: 0; }

.whisper-empty {
  animation: empty-bell-ripple 4s ease-in-out infinite;
}

.whisper-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  min-height: 46px;
  padding: 8px 0 8px;
  border: 0;
  border-radius: 0;
  background:
    linear-gradient(90deg, transparent, rgba(90, 66, 58, 0.1) 12%, transparent 88%),
    transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  position: relative;
  transition: transform 0.25s ease, background 0.25s ease, filter 0.25s ease;
}

.whisper-item::before {
  content: '';
  position: absolute;
  left: -6px;
  right: -6px;
  top: 50%;
  height: 15px;
  background:
    linear-gradient(90deg, transparent, rgba(90, 66, 58, 0.18), transparent),
    radial-gradient(ellipse at 22% 50%, rgba(200, 75, 91, 0.16), transparent 46%);
  transform: translateY(-50%) skewX(-12deg);
  mask-image: linear-gradient(90deg, transparent 0%, black 16%, black 82%, transparent 100%);
  opacity: 0.58;
  pointer-events: none;
}

.whisper-item::after {
  content: '';
  position: absolute;
  left: -2px;
  right: -2px;
  top: 50%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 75, 91, 0.52), rgba(163, 131, 83, 0.38), transparent);
  transform: translateY(-50%) scaleX(0);
  transform-origin: left;
  pointer-events: none;
  opacity: 0;
}

.whisper-item:hover,
.whisper-item:focus-visible {
  transform: translateX(2px);
  background:
    linear-gradient(90deg, rgba(200, 75, 91, 0.08), rgba(90, 66, 58, 0.08), transparent),
    transparent;
  outline: none;
}

.whisper-item--locked::after {
  opacity: 1;
  animation: bind-rumor-thread 0.55s ease forwards;
}

.whisper-item--locked {
  filter: saturate(1.2);
}

.whisper-head {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  color: var(--p2-gold);
  font-size: 10px;
  letter-spacing: 1px;
}

.whisper-marker {
  color: var(--p2-blood);
  text-shadow: 0 0 8px rgba(200, 75, 91, 0.24);
}

.whisper-text {
  position: relative;
  z-index: 1;
  font-family: $font-行书;
  font-size: 12px;
  line-height: 1.55;
  color: rgba(90, 66, 58, 0.88);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  mask-image: linear-gradient(to right, black 84%, transparent 100%);
}

.whisper-hook {
  color: rgba(200, 75, 91, 0.66);
  font-size: 11px;
  overflow-wrap: anywhere;
  position: relative;
  z-index: 1;
}

@keyframes bind-rumor-thread {
  from { transform: translateY(-50%) scaleX(0); }
  to { transform: translateY(-50%) scaleX(1); }
}

@keyframes empty-bell-ripple {
  0%, 100% { opacity: 0.56; letter-spacing: 3px; }
  50% { opacity: 0.82; letter-spacing: 4px; }
}
</style>
