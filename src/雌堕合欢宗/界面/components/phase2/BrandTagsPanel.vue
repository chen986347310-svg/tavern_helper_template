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
@use '../../styles/variables' as *;

.p2-brand-tags {
  --p2-skin: #fffdf9;
  --p2-incense: #5a423a;
  --p2-blood: #c84b5b;
  --p2-gold: #a38353;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 12px 14px;
  border: 0;
  border-radius: 2px;
  background:
    radial-gradient(ellipse at 78% 10%, rgba(200, 75, 91, 0.14), transparent 58%),
    linear-gradient(90deg, rgba(163, 131, 83, 0.1), transparent 30%, rgba(234, 168, 155, 0.1)),
    var(--p2-skin);
  color: var(--p2-incense);
  position: relative;
  overflow: hidden;
}

.p2-brand-tags::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 24% 52%, rgba(90, 66, 58, 0.08) 0 1px, transparent 1.6px),
    linear-gradient(130deg, transparent 0 45%, rgba(163, 131, 83, 0.12) 46%, transparent 49%);
  background-size: 21px 21px, 100% 100%;
  opacity: 0.7;
}

.p2-brand-tags::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(163, 131, 83, 0.42), transparent);
}

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
  border: 1px solid rgba(200, 75, 91, 0.38);
  color: var(--p2-blood);
  font-size: 10px;
  transform: rotate(-7deg);
}

.brand-empty {
  color: rgba(90, 66, 58, 0.48);
  font-size: 12px;
  letter-spacing: 3px;
  position: relative;
  z-index: 1;
}

.brand-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 10px;
  position: relative;
  z-index: 1;
}

.brand-tag {
  padding: 3px 0 2px;
  border: 0;
  border-bottom: 1px solid rgba(200, 75, 91, 0.28);
  border-radius: 0;
  background:
    linear-gradient(90deg, rgba(200, 75, 91, 0.11), transparent 70%),
    transparent;
  color: var(--p2-blood);
  font-family: $font-铭文;
  font-size: 11px;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(200, 75, 91, 0.18);
  position: relative;
}

.brand-tag::after {
  content: '';
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: -3px;
  height: 5px;
  background: radial-gradient(ellipse, rgba(200, 75, 91, 0.18), transparent 72%);
}
</style>
