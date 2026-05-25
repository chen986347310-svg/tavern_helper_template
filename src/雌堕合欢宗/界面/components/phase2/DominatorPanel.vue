<template>
  <section :class="['p2-dominator-panel', dominator.className]" :data-has-dominator="Boolean(current)" aria-label="牵丝凝视">
    <div class="thread-field" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
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
@use '../../styles/variables' as *;

.p2-dominator-panel {
  --p2-skin: #fffdf9;
  --p2-incense: #5a423a;
  --p2-blood: #c84b5b;
  --p2-gold: #a38353;
  --p2-purple: #3d273c;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 12px 13px;
  border: 0;
  border-radius: 2px;
  background:
    radial-gradient(ellipse at 72% 24%, rgba(61, 39, 60, 0.12), transparent 58%),
    linear-gradient(90deg, transparent, rgba(234, 168, 155, 0.16), transparent),
    var(--p2-skin);
  color: var(--p2-incense);
  position: relative;
  overflow: hidden;
}

.p2-dominator-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 30% 20%, rgba(90, 66, 58, 0.08) 0 1px, transparent 1.5px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.48), transparent 22%, rgba(200, 75, 91, 0.06));
  background-size: 19px 19px, 100% 100%;
  opacity: 0.78;
}

.p2-dominator-panel::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(163, 131, 83, 0.42), transparent);
}

.p2-dominator-panel[data-has-dominator='true'] {
  background:
    radial-gradient(ellipse at 74% 22%, rgba(61, 39, 60, 0.28), transparent 56%),
    radial-gradient(ellipse at 12% 50%, rgba(200, 75, 91, 0.1), transparent 62%),
    var(--p2-skin);
}

.thread-field {
  position: absolute;
  inset: 0 10px 0 auto;
  width: 62px;
  pointer-events: none;
  opacity: 0.5;
}

.thread-field span {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(163, 131, 83, 0.44), transparent);
  transform-origin: top;
  animation: p2-thread-sway 5.2s ease-in-out infinite;
}

.thread-field span:nth-child(1) { left: 7px; animation-delay: -0.8s; }
.thread-field span:nth-child(2) { left: 22px; }
.thread-field span:nth-child(3) { left: 39px; animation-delay: -1.4s; }
.thread-field span:nth-child(4) { left: 55px; animation-delay: -2.1s; }

.dominator--liu .thread-field span {
  background: linear-gradient(180deg, transparent, rgba(200, 75, 91, 0.58), transparent);
}

.p2-dominator-panel[data-has-dominator='true']:hover .thread-field span {
  animation-duration: 1.6s;
  opacity: 0.88;
}

.dominator-main {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.dominator-glyph {
  width: 34px;
  height: 44px;
  display: grid;
  place-items: center;
  color: var(--p2-blood);
  font-family: $font-铭文;
  font-size: 17px;
  background:
    linear-gradient(180deg, rgba(200, 75, 91, 0.1), transparent),
    rgba(255, 253, 249, 0.26);
  box-shadow:
    inset 0 0 0 1px rgba(200, 75, 91, 0.28),
    inset 0 0 22px rgba(163, 131, 83, 0.09);
  clip-path: polygon(50% 0, 100% 14%, 88% 100%, 12% 100%, 0 14%);
}

.dominator-title {
  width: fit-content;
  color: rgba(90, 66, 58, 0.7);
  font-family: $font-行书;
  font-size: 17px;
  letter-spacing: 1px;
  line-height: 1.35;
  position: relative;
}

.dominator-title::after {
  content: '';
  position: absolute;
  left: -3px;
  right: -10px;
  bottom: 1px;
  height: 7px;
  background: linear-gradient(90deg, rgba(200, 75, 91, 0.26), transparent);
  transform: rotate(-1.5deg);
  z-index: -1;
}

.p2-dominator-panel[data-has-dominator='true'] .dominator-title {
  color: var(--p2-gold);
  text-shadow: 0 0 10px rgba(61, 39, 60, 0.22);
}

.dominator--none {
  opacity: 0.72;
}

.dominator-last,
.dominator-counts,
.dominator-empty {
  color: rgba(90, 66, 58, 0.58);
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
  color: rgba(90, 66, 58, 0.7);
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
