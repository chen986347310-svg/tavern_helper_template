<template>
  <section class="p2-brand-tags" aria-label="烙名痕迹">
    <div class="panel-kicker"><span aria-hidden="true">烙</span>烙名痕迹</div>
    <div v-if="visibleTags.length === 0" class="brand-empty">尚未烙名</div>
    <div v-else class="brand-list">
      <span v-for="tag in visibleTags" :key="tag" class="brand-tag" data-testid="p2-brand-tag">印 · {{ tag }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ tags: string[] }>();
const visibleTags = computed(() => (props.tags ?? []).filter(Boolean).slice(0, 8));
</script>

<style lang="scss" scoped>
.p2-brand-tags {
  --p2-gold: var(--hh-gold, #a38353);
  --p2-jade: var(--hh-text-primary, #e6e1da);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 10px;
  border: 0;
  border-radius: 0;
  background:
    radial-gradient(ellipse at 80% 0, color-mix(in srgb, var(--hh-accent, #9c2c31) 12%, transparent), transparent 60%),
    color-mix(in srgb, var(--hh-bg-surface, #0f0a14) 68%, transparent);
  color: var(--p2-jade);
  position: relative;
}

.p2-brand-tags::before {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--hh-divider-alpha, rgba(163, 131, 83, 0.25)), transparent);
}

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
  border: 1px solid color-mix(in srgb, var(--hh-accent, #9c2c31) 38%, transparent);
  color: var(--hh-accent, #9c2c31);
  font-size: 10px;
  transform: rotate(-7deg);
}

.brand-empty {
  color: var(--hh-text-muted, rgba(230, 225, 218, 0.58));
  font-size: 12px;
  letter-spacing: 3px;
}

.brand-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.brand-tag {
  padding: 2px 0;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--hh-accent, #9c2c31) 28%, transparent);
  border-radius: 0;
  background: transparent;
  color: color-mix(in srgb, var(--hh-accent, #9c2c31) 72%, var(--p2-jade));
  font-size: 11px;
  letter-spacing: 1px;
  text-shadow: 0 0 8px var(--hh-glow-color, rgba(156, 44, 49, 0.28));
}
</style>
