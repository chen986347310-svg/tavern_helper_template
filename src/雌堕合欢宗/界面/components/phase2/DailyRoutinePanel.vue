<template>
  <section class="p2-routine-panel" aria-label="执事名册">
    <div class="panel-kicker"><span aria-hidden="true">朱</span>执事名册</div>
    <div class="routine-main">
      <span class="routine-label">日课</span>
      <strong>{{ routine || '候命' }}</strong>
    </div>
    <div class="routine-meta">
      <span class="routine-seal">朱批 {{ safeCount }}</span>
      <span class="routine-settlement">{{ settlement || '尚无结算' }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  routine: string;
  count: number;
  settlement: string;
}>();

const safeCount = computed(() => (Number.isFinite(props.count) ? Math.min(Math.max(Math.round(props.count), 0), 99) : 0));
</script>

<style lang="scss" scoped>
.p2-routine-panel {
  --p2-blood: var(--hh-accent, #9c2c31);
  --p2-gold: var(--hh-gold, #a38353);
  --p2-jade: var(--hh-text-primary, #e6e1da);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 10px;
  border: 0;
  border-radius: 0;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--hh-gold, #a38353) 8%, transparent), transparent 22%, transparent 78%, color-mix(in srgb, var(--hh-gold, #a38353) 6%, transparent)),
    color-mix(in srgb, var(--hh-bg-surface, #0f0a14) 78%, transparent);
  color: var(--p2-jade);
  position: relative;
  overflow: hidden;
}

.p2-routine-panel::before {
  content: '';
  position: absolute;
  inset: 0 8px auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--hh-divider-alpha, rgba(163, 131, 83, 0.25)), transparent);
}

.p2-routine-panel::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 12px;
  width: 42px;
  height: 42px;
  border: 1px solid color-mix(in srgb, var(--hh-accent, #9c2c31) 28%, transparent);
  transform: rotate(-9deg);
  opacity: 0.18;
}

.panel-kicker,
.routine-label {
  color: var(--p2-gold);
  font-size: 11px;
  letter-spacing: 3px;
}

.panel-kicker {
  display: flex;
  align-items: center;
  gap: 6px;
}

.panel-kicker span {
  width: 17px;
  height: 17px;
  display: grid;
  place-items: center;
  color: var(--hh-accent, #9c2c31);
  border: 1px solid color-mix(in srgb, var(--hh-accent, #9c2c31) 42%, transparent);
  font-size: 10px;
  transform: rotate(-8deg);
}

.routine-main {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.routine-main strong {
  color: var(--p2-jade);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  overflow-wrap: anywhere;
  text-shadow: 0 0 10px var(--hh-glow-color, rgba(156, 44, 49, 0.24));
}

.routine-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--hh-text-secondary, rgba(230, 225, 218, 0.72));
  font-size: 11px;
  line-height: 1.45;
}

.routine-seal {
  width: fit-content;
  color: color-mix(in srgb, var(--hh-accent, #9c2c31) 82%, var(--hh-text-primary, #e6e1da));
  letter-spacing: 2px;
}

.routine-settlement {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  mask-image: linear-gradient(to right, black 82%, transparent 100%);
}
</style>
