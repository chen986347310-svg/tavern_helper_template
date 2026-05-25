<template>
  <section class="p2-stigma-core" :data-stigma-state="commandState.state" :data-command-active="Boolean(command)" aria-label="牝印核心">
    <div class="stigma-seal" aria-hidden="true">
      <span class="seal-thread seal-thread--top"></span>
      <span class="seal-mark">牝</span>
      <span class="seal-thread seal-thread--bottom"></span>
    </div>
    <div class="stigma-copy">
      <div class="stigma-state">
        <span>牝印核心</span>
        <strong>{{ commandState.state }}</strong>
      </div>
      <div :class="['stigma-command', { 'stigma-command--resting': !command }]">
        <span>{{ command || '体内灵气平稳，印记暂歇……' }}</span>
      </div>
      <div class="stigma-metrics">
        <div class="stigma-groove">
          <span class="groove-label">{{ corruptionText.glyph }} 堕落度 · {{ corruptionText.label }}</span>
          <span class="groove-track" aria-hidden="true"><i :style="{ width: corruptionPercent + '%' }"></i></span>
        </div>
        <div class="stigma-groove">
          <span class="groove-label">{{ yinjueText.glyph }} 牝阴决 · {{ yinjueText.label }}</span>
          <span class="groove-track" aria-hidden="true"><i :style="{ width: yinjuePercent + '%' }"></i></span>
        </div>
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
const corruptionPercent = computed(() => Math.max(0, Math.min(100, Number(props.corruption) || 0)));
const yinjuePercent = computed(() => Math.max(0, Math.min(100, ((Number(props.yinjueLayer) || 0) / 9) * 100)));
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;

.p2-stigma-core {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  padding: 14px 12px 14px 10px;
  border: 0;
  border-radius: 2px;
  background:
    radial-gradient(ellipse at 16% 42%, rgba(200, 75, 91, 0.12), transparent 56%),
    linear-gradient(90deg, rgba(234, 168, 155, 0.22), transparent 36%),
    var(--p2-skin);
  color: var(--p2-incense);
  position: relative;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.78),
    inset 0 -18px 34px rgba(150, 96, 88, 0.08);
}

.p2-stigma-core::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 18% 24%, rgba(90, 66, 58, 0.12) 0 1px, transparent 1.5px),
    radial-gradient(circle at 58% 62%, rgba(200, 75, 91, 0.08) 0 1px, transparent 1.6px),
    linear-gradient(115deg, transparent 0 43%, rgba(234, 168, 155, 0.24) 44%, transparent 46%);
  background-size: 17px 17px, 23px 23px, 100% 100%;
  opacity: 0.72;
}

.p2-stigma-core::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(163, 131, 83, 0.48), transparent);
}

.p2-stigma-core[data-stigma-state='发热'] .groove-track i,
.p2-stigma-core[data-stigma-state='强制'] .groove-track i {
  background: linear-gradient(90deg, var(--p2-incense), var(--p2-blood));
  box-shadow: 0 0 10px rgba(200, 75, 91, 0.32);
}

.p2-stigma-core[data-stigma-state='强制'] {
  background:
    radial-gradient(ellipse at 16% 42%, rgba(200, 75, 91, 0.26), transparent 56%),
    radial-gradient(ellipse at 82% 68%, rgba(90, 35, 48, 0.16), transparent 52%),
    linear-gradient(90deg, rgba(234, 168, 155, 0.28), transparent 36%),
    var(--p2-skin);
}

.p2-stigma-core[data-stigma-state='强制'] .stigma-seal,
.p2-stigma-core[data-stigma-state='强制'] .stigma-command span {
  animation: p2-heart-bind 1.16s ease-in-out infinite;
}

.stigma-seal {
  width: 54px;
  min-height: 68px;
  display: grid;
  place-items: center;
  color: var(--p2-blood);
  background:
    radial-gradient(ellipse at 50% 52%, rgba(200, 75, 91, 0.14), transparent 58%),
    linear-gradient(180deg, rgba(255, 253, 249, 0.28), rgba(234, 222, 209, 0.24));
  box-shadow:
    inset 0 0 0 1px rgba(163, 131, 83, 0.34),
    inset 0 0 26px rgba(200, 75, 91, 0.12);
  position: relative;
}

.stigma-seal::before,
.stigma-seal::after {
  content: '';
  position: absolute;
  left: 50%;
  width: 38px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--p2-gold), transparent);
  transform: translateX(-50%);
  opacity: 0.7;
}

.stigma-seal::before { top: 8px; }
.stigma-seal::after { bottom: 8px; }

.seal-thread {
  position: absolute;
  left: 50%;
  width: 1px;
  height: 19px;
  background: linear-gradient(180deg, transparent, rgba(163, 131, 83, 0.68), transparent);
}

.seal-thread--top { top: 10px; }
.seal-thread--bottom { bottom: 10px; }

.seal-mark {
  font-family: $font-铭文;
  font-size: 25px;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 0 12px rgba(200, 75, 91, 0.42);
}

.stigma-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.stigma-state {
  color: var(--p2-ash);
  font-size: 12px;
  letter-spacing: 2px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.stigma-state span {
  color: rgba(90, 66, 58, 0.58);
}

.stigma-state strong {
  color: var(--p2-gold);
  font-weight: 600;
}

.stigma-command {
  color: var(--p2-blood);
  font-size: 14px;
  line-height: 1.55;
  overflow-wrap: anywhere;
  position: relative;
  min-height: 24px;
}

.stigma-command span {
  display: inline;
  font-family: $font-行书;
  letter-spacing: 2px;
  text-shadow: 0 0 9px rgba(200, 75, 91, 0.22);
  background:
    radial-gradient(ellipse at 50% 100%, rgba(200, 75, 91, 0.16), transparent 66%),
    linear-gradient(90deg, transparent, rgba(200, 75, 91, 0.1), transparent);
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 5px;
}

.stigma-command--resting {
  color: rgba(90, 66, 58, 0.68);
  font-size: 12px;
  letter-spacing: 4px;
}

.stigma-command--resting span {
  font-family: $font-铭文;
  background: none;
  text-shadow: none;
}

.stigma-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.stigma-groove {
  min-width: 0;
}

.groove-label {
  display: block;
  color: rgba(90, 66, 58, 0.72);
  font-size: 11px;
  letter-spacing: 1px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.groove-track {
  display: block;
  height: 7px;
  padding: 2px;
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgba(114, 83, 70, 0.24), rgba(255, 255, 255, 0.3)),
    rgba(163, 131, 83, 0.16);
  box-shadow:
    inset 0 1px 2px rgba(80, 50, 40, 0.28),
    inset 0 -1px 0 rgba(255, 255, 255, 0.62);
  overflow: hidden;
}

.groove-track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(90, 66, 58, 0.76), rgba(163, 131, 83, 0.72));
  transition: width 0.5s ease, background 0.35s ease;
}

@keyframes p2-heart-bind {
  0%, 100% { transform: translateY(0) scale(1); filter: saturate(1); }
  45% { transform: translateY(0.5px) scale(1.012); filter: saturate(1.3); }
  58% { transform: translateY(0) scale(0.996); }
}

@media (max-width: 360px) {
  .p2-stigma-core {
    grid-template-columns: 52px minmax(0, 1fr);
    gap: 10px;
  }

  .stigma-seal {
    width: 48px;
    min-height: 62px;
  }

  .stigma-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
