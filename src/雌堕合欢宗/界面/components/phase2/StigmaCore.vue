<template>
  <section class="p2-stigma-core" :data-stigma-state="commandState.state" aria-label="牝印核心">
    <div class="stigma-seal" aria-hidden="true">
      <span class="seal-mark">牝</span>
      <span class="seal-heat">{{ commandState.glyph }}</span>
    </div>
    <div class="stigma-copy">
      <div class="stigma-state"><span>牝印</span>{{ commandState.state }}</div>
      <div class="stigma-command"><span class="command-ribbon">{{ commandState.label }}</span></div>
      <div class="stigma-vein" aria-hidden="true"><span :style="{ width: commandIntensityPercent + '%' }"></span></div>
      <div class="stigma-metrics">
        <span>{{ corruptionText.glyph }} {{ corruptionText.label }}</span>
        <span>{{ yinjueText.glyph }} {{ yinjueText.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { get命令状态, get堕落语义, get牝阴决语义 } from '../../data/phase2Display';

const props = defineProps<{
  corruption: number;
  yinjueLayer: number;
  command: string;
  intensity: number;
}>();

const corruptionText = computed(() => get堕落语义(props.corruption));
const yinjueText = computed(() => get牝阴决语义(props.yinjueLayer));
const commandState = computed(() => get命令状态(props.command, props.intensity));
const commandIntensityPercent = computed(() => Math.max(0, Math.min(100, Number(props.intensity) || 0)));
</script>

<style lang="scss" scoped>
.p2-stigma-core {
  --p2-void: var(--hh-bg-main, #0f0a14);
  --p2-blood: var(--hh-accent, #9c2c31);
  --p2-red: color-mix(in srgb, var(--hh-accent, #d44d54) 78%, #fff0eb);
  --p2-gold: var(--hh-gold, #a38353);
  --p2-jade: var(--hh-text-primary, #e6e1da);
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 12px 10px 12px 8px;
  border: 0;
  border-radius: 0;
  background:
    radial-gradient(circle at 30px 50%, color-mix(in srgb, var(--hh-accent, #d44d54) 22%, transparent), transparent 58px),
    linear-gradient(90deg, color-mix(in srgb, var(--hh-accent, #9c2c31) 22%, transparent), color-mix(in srgb, var(--hh-bg-main, #0f0a14) 18%, transparent) 58%, transparent);
  color: var(--p2-jade);
  position: relative;
  overflow: hidden;
}

.p2-stigma-core::before,
.p2-stigma-core::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--hh-gold, #a38353) 45%, transparent), transparent);
}

.p2-stigma-core::before { top: 0; }
.p2-stigma-core::after { bottom: 0; }

.p2-stigma-core[data-stigma-state='发热'] .stigma-seal {
  box-shadow: inset 0 0 20px color-mix(in srgb, var(--hh-accent, #d44d54) 24%, transparent), 0 0 18px var(--hh-glow-color, rgba(212, 77, 84, 0.26));
}

.p2-stigma-core[data-stigma-state='强制'] {
  background:
    radial-gradient(circle at 32px 50%, color-mix(in srgb, var(--hh-accent, #d44d54) 36%, transparent), transparent 62px),
    linear-gradient(90deg, color-mix(in srgb, var(--hh-accent, #9c2c31) 38%, transparent), color-mix(in srgb, var(--hh-bg-main, #0f0a14) 22%, transparent) 65%, transparent);
}

.p2-stigma-core[data-stigma-state='强制'] .stigma-seal {
  animation: p2-stigma-jolt 1.2s steps(2, end) infinite;
}

.stigma-seal {
  width: 48px;
  min-height: 58px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--hh-gold, #a38353) 42%, transparent);
  border-radius: 3px;
  color: var(--p2-red);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--hh-accent, #d44d54) 18%, transparent), transparent 58%),
    color-mix(in srgb, var(--hh-bg-main, #0f0a14) 42%, transparent);
  box-shadow: inset 0 0 18px color-mix(in srgb, var(--hh-accent, #d44d54) 14%, transparent), 0 0 14px var(--hh-glow-color, rgba(156, 44, 49, 0.2));
  position: relative;
}

.stigma-seal::before,
.stigma-seal::after {
  content: '';
  position: absolute;
  left: 8px;
  right: 8px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--hh-gold, #a38353), transparent);
  opacity: 0.62;
}

.stigma-seal::before { top: 7px; }
.stigma-seal::after { bottom: 7px; }

.seal-mark {
  font-size: 23px;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 0 10px var(--hh-glow-color, rgba(212, 77, 84, 0.65));
}

.seal-heat {
  position: absolute;
  right: -5px;
  bottom: 9px;
  min-width: 15px;
  height: 15px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--hh-accent, #d44d54) 56%, transparent);
  background: var(--hh-bg-surface, #170d10);
  color: var(--hh-gold, #a38353);
  font-size: 10px;
}

.stigma-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stigma-state {
  color: var(--p2-gold);
  font-size: 12px;
  letter-spacing: 3px;
  display: flex;
  gap: 8px;
}

.stigma-state span {
  color: var(--hh-text-secondary, rgba(230, 225, 218, 0.54));
}

.stigma-command {
  color: var(--p2-jade);
  font-size: 14px;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.stigma-vein {
  width: min(220px, 100%);
  height: 2px;
  background: color-mix(in srgb, var(--hh-bg-main, #0f0a14) 70%, #000);
  overflow: hidden;
}

.stigma-vein span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--hh-accent, #9c2c31), var(--hh-gold, #a38353));
  box-shadow: 0 0 10px var(--hh-glow-color, rgba(212, 77, 84, 0.35));
  transition: width 0.45s ease;
}

.command-ribbon {
  display: inline;
  padding: 1px 6px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--hh-accent, #9c2c31) 28%, transparent) 12%, color-mix(in srgb, var(--hh-accent, #9c2c31) 2%, transparent) 88%, transparent);
  color: var(--p2-jade);
  text-shadow: 0 0 8px var(--hh-glow-color, rgba(212, 77, 84, 0.26));
}

.stigma-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--hh-text-secondary, rgba(230, 225, 218, 0.72));
  font-size: 11px;
  letter-spacing: 2px;
}

.stigma-metrics span {
  position: relative;
  padding-left: 10px;
}

.stigma-metrics span::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--p2-gold);
  transform: translateY(-50%);
  box-shadow: 0 0 8px var(--hh-gold-glow, rgba(163, 131, 83, 0.6));
}

@keyframes p2-stigma-jolt {
  0%, 100% { transform: translateX(0); filter: brightness(1); }
  50% { transform: translateX(1px); filter: brightness(1.25); }
}
</style>
