<template>
  <section class="p2-routine-panel" aria-label="执事名册">
    <div class="panel-kicker"><span aria-hidden="true">朱</span>执事名册</div>
    <div class="routine-main">
      <span class="routine-label">{{ state.hasRequirement ? '今日朱批' : '日课伏侍' }}</span>
      <strong>{{ routine || '候命' }}</strong>
    </div>
    <div class="routine-meta">
      <span class="routine-seal">朱批 {{ safeCount }}</span>
      <span v-if="state.hasRequirement" class="routine-requirement">
        须扣 {{ state.requiredLabel || '无' }}
      </span>
      <span class="routine-settlement">{{ settlement || '尚无结算' }}</span>
      <span v-if="state.hasRequirement" :class="['routine-state', { missing: state.isMissing }]">
        {{ state.isMissing ? `违令 · ${state.shame}` : '受令中' }}
      </span>
      <span v-if="state.isMissing" class="routine-punishment">
        {{ state.punishment }}
      </span>
      <span class="routine-body-note">{{ state.bodyNote }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getPhase2RoutineState } from '../../data/phase2Routine';

const props = withDefaults(defineProps<{
  routine: string;
  count: number;
  settlement: string;
  equippedItems?: readonly string[];
}>(), {
  equippedItems: () => [],
});

const safeCount = computed(() => (Number.isFinite(props.count) ? Math.min(Math.max(Math.round(props.count), 0), 99) : 0));
const state = computed(() => getPhase2RoutineState(props.routine, props.equippedItems));
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;

.p2-routine-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 12px 14px;
  border: 0;
  border-radius: 2px;
  background:
    radial-gradient(ellipse at 90% 28%, rgba(200, 75, 91, 0.12), transparent 52%),
    linear-gradient(90deg, rgba(163, 131, 83, 0.14), transparent 23%, transparent 80%, rgba(234, 168, 155, 0.16)),
    var(--p2-skin);
  color: var(--p2-incense);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 -16px 28px rgba(90, 66, 58, 0.05);
}

.p2-routine-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(96deg, transparent 0 18%, rgba(200, 75, 91, 0.12) 19%, transparent 21%),
    radial-gradient(circle at 44% 30%, rgba(90, 66, 58, 0.1) 0 1px, transparent 1.5px);
  background-size: 100% 100%, 18px 18px;
  opacity: 0.7;
}

.p2-routine-panel::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 12px;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(200, 75, 91, 0.28);
  transform: rotate(-9deg);
  opacity: 0.22;
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
  position: relative;
  z-index: 1;
}

.panel-kicker span {
  width: 17px;
  height: 17px;
  display: grid;
  place-items: center;
  color: var(--hh-accent, #9c2c31);
  border: 1px solid rgba(200, 75, 91, 0.42);
  font-size: 10px;
  transform: rotate(-8deg);
}

.routine-main {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.routine-main strong {
  color: var(--p2-incense);
  font-family: $font-铭文;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  overflow-wrap: anywhere;
  text-shadow: 0 0 10px rgba(200, 75, 91, 0.12);
}

.routine-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: rgba(90, 66, 58, 0.68);
  font-size: 11px;
  line-height: 1.45;
  position: relative;
  z-index: 1;
}

.routine-seal {
  width: fit-content;
  color: var(--p2-blood);
  letter-spacing: 2px;
  padding-bottom: 1px;
  border-bottom: 1px solid rgba(200, 75, 91, 0.22);
}

.routine-settlement {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  mask-image: linear-gradient(to right, black 82%, transparent 100%);
}

.routine-requirement,
.routine-state,
.routine-punishment,
.routine-body-note {
  color: color-mix(in srgb, var(--p2-incense) 76%, transparent);
  letter-spacing: 1px;
}

.routine-state.missing {
  color: var(--p2-blood);
}

.routine-punishment {
  color: color-mix(in srgb, var(--p2-blood) 88%, transparent);
}

.routine-body-note {
  color: color-mix(in srgb, var(--p2-gold) 56%, transparent);
}
</style>
