<template>
  <section class="p2-whisper-panel" aria-label="听风羞名">
    <div class="panel-kicker"><span aria-hidden="true">听</span>听风羞名</div>
    <div v-if="visibleRumors.length === 0" class="whisper-empty">风铃暂歇</div>
    <button
      v-for="rumor in visibleRumors"
      v-else
      :key="rumor.id || rumor.风声文本"
      type="button"
      class="whisper-item"
      data-testid="p2-whisper-action"
      @click="emit('chase-rumor', rumor)"
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
import { computed } from 'vue';
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
</script>

<style lang="scss" scoped>
.p2-whisper-panel {
  --p2-gold: var(--hh-gold, #a38353);
  --p2-jade: var(--hh-text-primary, #e6e1da);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 10px;
  border: 0;
  border-radius: 0;
  background:
    linear-gradient(90deg, transparent, color-mix(in srgb, var(--hh-bg-card, rgba(156, 44, 49, 0.08)) 70%, transparent), transparent),
    color-mix(in srgb, var(--hh-bg-surface, #0f0a14) 72%, transparent);
  color: var(--p2-jade);
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
  background: linear-gradient(90deg, transparent, var(--hh-divider-alpha, rgba(163, 131, 83, 0.25)), transparent);
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
}

.panel-kicker span {
  width: 17px;
  height: 17px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--hh-gold, #a38353) 34%, transparent);
  color: var(--hh-accent, #9c2c31);
  font-size: 10px;
}

.whisper-empty {
  color: var(--hh-text-muted, rgba(230, 225, 218, 0.58));
  font-size: 12px;
  letter-spacing: 3px;
  padding: 8px 0;
}

.whisper-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  min-height: 48px;
  padding: 9px 6px 9px 10px;
  border: 0;
  border-left: 1px solid color-mix(in srgb, var(--hh-accent, #9c2c31) 34%, transparent);
  border-radius: 0;
  background:
    radial-gradient(ellipse at 0 50%, color-mix(in srgb, var(--hh-accent, #9c2c31) 14%, transparent), transparent 72%),
    transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}

.whisper-item:hover,
.whisper-item:focus-visible {
  transform: translateX(2px);
  border-left-color: var(--hh-gold, #a38353);
  background: radial-gradient(ellipse at 0 50%, color-mix(in srgb, var(--hh-accent, #9c2c31) 22%, transparent), transparent 72%);
  outline: none;
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
  color: color-mix(in srgb, var(--hh-accent, #9c2c31) 86%, var(--hh-text-primary, #e6e1da));
  text-shadow: 0 0 8px var(--hh-glow-color, rgba(156, 44, 49, 0.3));
}

.whisper-text {
  font-size: 12px;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  mask-image: linear-gradient(to right, black 84%, transparent 100%);
}

.whisper-hook {
  color: var(--hh-text-secondary, rgba(230, 225, 218, 0.62));
  font-size: 11px;
  overflow-wrap: anywhere;
}
</style>
