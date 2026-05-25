<template>
  <section :class="['p2-dominator-panel', dominator.className]" aria-label="牵丝凝视">
    <div class="thread-field" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="dominator-main">
      <span class="dominator-glyph" aria-hidden="true">{{ dominator.glyph }}</span>
      <div>
        <div class="dominator-title">{{ dominator.title }}</div>
        <div class="dominator-last">前次 {{ last || '牵丝未落' }}</div>
      </div>
    </div>
    <div v-if="topCounts.length" class="dominator-counts">
      <span v-for="item in topCounts" :key="item.name">{{ item.name }} {{ item.count }}</span>
    </div>
    <div v-else class="dominator-empty">牵丝未落</div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { get支配者称谓 } from '../../data/phase2Display';

const props = defineProps<{
  current: string;
  last: string;
  counts: Record<string, number>;
}>();

const dominator = computed(() => get支配者称谓(props.current));
const topCounts = computed(() =>
  Object.entries(props.counts ?? {})
    .map(([name, value]) => ({ name, count: Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0 }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3),
);
</script>

<style lang="scss" scoped>
.p2-dominator-panel {
  --p2-blood: var(--hh-accent, #9c2c31);
  --p2-gold: var(--hh-gold, #a38353);
  --p2-jade: var(--hh-text-primary, #e6e1da);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 10px 12px 12px;
  border: 0;
  border-radius: 0;
  background:
    radial-gradient(ellipse at 20% 20%, color-mix(in srgb, var(--hh-accent, #9c2c31) 16%, transparent), transparent 60%),
    linear-gradient(90deg, color-mix(in srgb, var(--hh-bg-surface, #0f0a14) 86%, transparent), transparent);
  color: var(--p2-jade);
  position: relative;
  overflow: hidden;
}

.p2-dominator-panel::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--hh-divider-alpha, rgba(163, 131, 83, 0.25)), transparent);
}

.thread-field {
  position: absolute;
  inset: 0 16px 0 auto;
  width: 48px;
  pointer-events: none;
  opacity: 0.55;
}

.thread-field span {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--hh-gold, #a38353) 46%, transparent), transparent);
  transform-origin: top;
  animation: p2-thread-sway 5s ease-in-out infinite;
}

.thread-field span:nth-child(1) { left: 8px; animation-delay: -0.8s; }
.thread-field span:nth-child(2) { left: 24px; }
.thread-field span:nth-child(3) { left: 40px; animation-delay: -1.4s; }

.dominator--liu .thread-field span {
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--hh-accent, #9c2c31) 62%, transparent), transparent);
}

.dominator-main {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.dominator-glyph {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--hh-accent, #d44d54) 42%, transparent);
  border-radius: 50%;
  color: color-mix(in srgb, var(--hh-accent, #d44d54) 80%, var(--hh-text-primary, #e6e1da));
  background: radial-gradient(circle, color-mix(in srgb, var(--hh-accent, #d44d54) 18%, transparent), transparent 64%);
  box-shadow: 0 0 14px var(--hh-glow-color, rgba(212, 77, 84, 0.2));
}

.dominator-title {
  color: var(--p2-jade);
  font-size: 14px;
  letter-spacing: 1px;
  text-shadow: 0 0 10px var(--hh-glow-color, rgba(156, 44, 49, 0.2));
}

.dominator-last,
.dominator-counts,
.dominator-empty {
  color: var(--hh-text-secondary, rgba(230, 225, 218, 0.68));
  font-size: 11px;
}

.dominator-counts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  position: relative;
  z-index: 1;
}

.dominator-counts span {
  padding: 2px 0;
  border: 0;
  color: color-mix(in srgb, var(--hh-text-secondary, #e6e1da) 80%, transparent);
}

.dominator-counts span::before {
  content: '·';
  color: var(--p2-gold);
  margin-right: 5px;
}

@keyframes p2-thread-sway {
  0%, 100% { transform: rotate(-1deg); opacity: 0.42; }
  50% { transform: rotate(1.5deg); opacity: 0.8; }
}
</style>
