<template>
  <div class="backpack-page" :data-phase="data.系统.阶段">
    <!-- 囊中藏珍 -->
    <div class="section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">{{ isPhase2 ? '匣' : '囊' }}</span>
        <span class="header-text">{{ isPhase2 ? '待扣法器' : '囊中藏珍' }}</span>
        <div class="header-line"></div>
      </div>

      <div class="item-list">
        <div
          v-for="(count, name) in ownedItems"
          :key="name"
          :class="['item-row', { selected: selectedItem === String(name), 'is-empty': count === 0 }]"
          @click="selectItem(String(name))"
        >
          <span class="item-name">{{ getItemDisplayName(String(name)) }}</span>
          <span v-if="isPhase2" class="item-focus">{{ getP2ArtifactFocus(String(name)) }}</span>
          <span v-if="isPhase2 && isCurrentRoutineItem(String(name))" class="routine-badge">朱批点名</span>
          <span :class="['item-count', { 'count-up': countAnimating && count > 0 }]">{{ isPhase2 ? `存数 ${count}` : `x${count}` }}</span>
        </div>
        <div v-if="Object.keys(ownedItems).length === 0" class="empty-state">
          <span class="empty-glyph">空</span>
          <span class="empty-text">{{ isPhase2 ? '匣中空寂，咒槽尚待落锁' : '锦囊尚空' }}</span>
        </div>
      </div>
    </div>

    <!-- 装备选择 -->
    <Transition name="slide">
      <div v-if="selectedItem" class="equip-section">
        <div class="section-header">
          <div class="header-line"></div>
          <span class="header-glyph">{{ isPhase2 ? '扣' : '佩' }}</span>
          <span class="header-text">{{ isPhase2 ? '扣合' : '安置' }}「{{ getItemDisplayName(selectedItem) }}」</span>
          <div class="header-line"></div>
        </div>

        <p v-if="isPhase2" class="p2-selected-note">{{ getP2ArtifactBodyNote(selectedItem) }}</p>

        <div v-if="isEquippableItem(selectedItem)" class="equip-targets">
          <button
            v-for="target in availableEquipTargets"
            :key="target"
            :class="['target-btn', { equipped: isEquipped(target), 'cannot-equip': !canEquipTo(target) }]"
            :title="!canEquipTo(target) ? `${target}灵犀未至` : ''"
            @click="toggleEquip(target)"
          >
            <span class="btn-dot"></span>
            {{ getTargetLabel(target) }}
          </button>
        </div>

        <div v-else-if="isTargetConsumableItem(selectedItem)" class="target-use-panel">
          <div v-if="consumableTargets.length > 0" class="equip-targets">
            <button
              v-for="target in consumableTargets"
              :key="target"
              :class="['target-btn', { 'cannot-equip': !canUseOnTarget(target) }]"
              :title="!canUseOnTarget(target) ? `${target}灵犀未至` : ''"
              @click="useItemOnTarget(target)"
            >
              <span class="btn-dot"></span>
              {{ getTargetLabel(target) }}
            </button>
          </div>
          <div v-else class="target-empty">此刻无人可承此丹</div>
        </div>

        <div v-else-if="isSelfConsumableItem(selectedItem)" class="use-panel">
          <button type="button" class="use-btn" @click="useItem">启用法效</button>
        </div>
      </div>
    </Transition>

    <!-- 法器归属 -->
    <div class="section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">{{ isPhase2 ? '锁' : '甲' }}</span>
        <span class="header-text">{{ isPhase2 ? '已落锁' : '法器归属' }}</span>
        <div class="header-line"></div>
      </div>

      <div class="equip-list">
        <div v-for="target in visibleEquipTargets" :key="target" class="equip-row">
          <span class="target-name">{{ getTargetLabel(target) }}</span>
          <span class="target-divider">：</span>
          <span class="equipped-items">
            <template v-if="visibleEquippedForTarget(target).length > 0">
              <button
                v-for="(item, index) in visibleEquippedForTarget(target)"
                :key="`${target}-${item}`"
                type="button"
                class="equipped-item"
                @click="selectItem(item)"
              >
                {{ getItemDisplayName(item) }}{{ index < visibleEquippedForTarget(target).length - 1 ? '、' : '' }}
              </button>
            </template>
            <span v-else>{{ isPhase2 ? '虚槽未扣' : '虚位' }}</span>
          </span>
        </div>
      </div>

      <div v-if="isPhase2" class="p2-body-echo" aria-label="法器身体回响">
        <div v-if="phase2EquippedItems.length === 0" class="p2-echo-empty">身上暂未落锁，朱批还没有真正压进皮肉。</div>
        <div v-for="item in phase2EquippedItems" :key="`echo-${item}`" class="p2-echo-row">
          <span class="p2-echo-name">{{ getItemDisplayName(item) }}</span>
          <span class="p2-echo-text">{{ getP2ArtifactBodyNote(item) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDataStore } from '../store';
import { checkItemThreshold, canEquip牝奴道具, get在场NPC列表 } from '../guards';
import { usePendingAction } from '../composables/usePendingAction';
import { isConsumableLifecycle, isEquippableLifecycle, itemRequiresTarget } from '../data/itemLifecycle';
import {
  getExclusiveOutfitNpc,
  getItemDisplayName,
  getP2ArtifactBodyNote,
  getP2ArtifactFocus,
  isExclusiveOutfitUnlocked,
  isP2ArtifactItem,
  isPlayerOnlyOutfit,
} from '../data/itemDisplay';
import { getPhase2RoutineState } from '../data/phase2Routine';

const store = useDataStore();
const data = store.data;
const { 记录装备道具, 记录卸下道具, 记录使用物品 } = usePendingAction();

const selectedItem = ref<string | null>(null);
const countAnimating = ref(false);
const npcEquipTargets = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'];
const isPhase2 = computed(() => data.系统.阶段 === '牝奴期');
const ownedItems = computed(() => {
  return Object.fromEntries(Object.entries(data.道具.拥有).filter(([name, count]) => count > 0 && (!isPhase2.value || isP2ArtifactItem(name))));
});

const consumableTargets = computed(() => get在场NPC列表(data.系统.场景上下文));
const visibleEquipTargets = computed(() => (isPhase2.value ? ['玩家'] : npcEquipTargets));
const phase2EquippedItems = computed(() => (data.道具.装备.玩家 ?? []).filter(isP2ArtifactItem));
const phase2RoutineState = computed(() => getPhase2RoutineState(data.牝奴?.当前日课 ?? '', phase2EquippedItems.value));

const availableEquipTargets = computed(() => {
  if (isPhase2.value) return ['玩家'];
  if (!selectedItem.value) return npcEquipTargets;
  if (isPlayerOnlyOutfit(selectedItem.value)) return [];
  const exclusiveNpc = getExclusiveOutfitNpc(selectedItem.value);
  if (exclusiveNpc) return [exclusiveNpc];
  return npcEquipTargets;
});

watch(() => data.道具.拥有, () => {
  countAnimating.value = true;
  setTimeout(() => { countAnimating.value = false; }, 300);
}, { deep: true });

function selectItem(name: string) {
  if (isPhase2.value && !isP2ArtifactItem(name)) return;
  selectedItem.value = selectedItem.value === name ? null : name;
}

function isConsumableItem(name: string | null): boolean {
  return !!name && isConsumableLifecycle(name);
}

function isTargetConsumableItem(name: string | null): boolean {
  return !!name && itemRequiresTarget(name);
}

function isSelfConsumableItem(name: string | null): boolean {
  return !!name && isConsumableLifecycle(name) && !itemRequiresTarget(name);
}

function isEquippableItem(name: string | null): boolean {
  return !!name && isEquippableLifecycle(name);
}

function isEquipped(target: string): boolean {
  if (!selectedItem.value) return false;
  return data.道具.装备[target]?.includes(selectedItem.value) ?? false;
}

function canEquipTo(target: string): boolean {
  if (!selectedItem.value) return true;
  if (!isEquippableItem(selectedItem.value)) return false;
  if (isPhase2.value) {
    if (target !== '玩家') return false;
    if (!isP2ArtifactItem(selectedItem.value)) return false;
    if (isEquipped(target)) return true;
    return (data.道具.拥有[selectedItem.value] ?? 0) > 0;
  }
  if (target === '玩家') return false;
  if (isPlayerOnlyOutfit(selectedItem.value) && target !== '玩家') return false;
  const exclusiveNpc = getExclusiveOutfitNpc(selectedItem.value);
  if (exclusiveNpc && target !== exclusiveNpc) return false;
  if (!isExclusiveOutfitUnlocked(selectedItem.value, data.NPC)) return false;
  if (isEquipped(target)) return true;
  if ((data.道具.拥有[selectedItem.value] ?? 0) <= 0) return false;
  if (exclusiveNpc) return true;
  if (!canEquip牝奴道具(data.系统.阶段, selectedItem.value)) {
    return false;
  }
  const npc好感度 = data.NPC[target as keyof typeof data.NPC]?.好感度 ?? 0;
  return checkItemThreshold(npc好感度, selectedItem.value);
}

function consumeOwnedItem(name: string) {
  const count = data.道具.拥有[name] ?? 0;
  const nextOwned = { ...data.道具.拥有 };
  if (count <= 1) {
    delete nextOwned[name];
    data.道具.拥有 = nextOwned;
    return;
  }
  nextOwned[name] = count - 1;
  data.道具.拥有 = nextOwned;
}

function restoreOwnedItem(name: string) {
  data.道具.拥有 = {
    ...data.道具.拥有,
    [name]: (data.道具.拥有[name] ?? 0) + 1,
  };
}

function useItem() {
  if (!selectedItem.value) return;
  if (!isSelfConsumableItem(selectedItem.value)) return;
  if ((data.道具.拥有[selectedItem.value] ?? 0) <= 0) return;

  const itemName = selectedItem.value;
  consumeOwnedItem(itemName);
  记录使用物品(itemName, '玩家');
  selectedItem.value = null;
}

function canUseOnTarget(target: string): boolean {
  if (!selectedItem.value) return false;
  if (!isTargetConsumableItem(selectedItem.value)) return false;
  if ((data.道具.拥有[selectedItem.value] ?? 0) <= 0) return false;
  const npc好感度 = data.NPC[target as keyof typeof data.NPC]?.好感度 ?? 0;
  return checkItemThreshold(npc好感度, selectedItem.value);
}

function useItemOnTarget(target: string) {
  if (!selectedItem.value) return;
  if (!canUseOnTarget(target)) return;

  const itemName = selectedItem.value;
  consumeOwnedItem(itemName);
  记录使用物品(itemName, target);
  selectedItem.value = null;
}

function toggleEquip(target: string) {
  if (!selectedItem.value) return;
  if (!isEquippableItem(selectedItem.value)) return;
  if (!isPhase2.value && target === '玩家') return;
  if (isPhase2.value && target !== '玩家') {
    if (typeof toastr !== 'undefined') toastr.warning('牝奴期法器只准扣在己身');
    return;
  }
  if (isPhase2.value && !isP2ArtifactItem(selectedItem.value)) return;

  if (!data.道具.装备[target]) {
    data.道具.装备 = {
      ...data.道具.装备,
      [target]: [],
    };
  }

  const equippedItems = data.道具.装备[target] ?? [];
  const index = equippedItems.indexOf(selectedItem.value);
  if (index >= 0) {
    const itemName = selectedItem.value;
    data.道具.装备 = {
      ...data.道具.装备,
      [target]: equippedItems.filter((_, itemIndex) => itemIndex !== index),
    };
    restoreOwnedItem(itemName);
    记录卸下道具(itemName, target);
    return;
  }

  if ((data.道具.拥有[selectedItem.value] ?? 0) <= 0) {
    if (typeof toastr !== 'undefined') toastr.warning(`囊中已无「${getItemDisplayName(selectedItem.value)}」，不可再供此器`);
    return;
  }

  if (isPlayerOnlyOutfit(selectedItem.value) && target !== '玩家') {
    if (typeof toastr !== 'undefined') toastr.warning('牝奴衣只认本身气血');
    return;
  }

  const exclusiveNpc = getExclusiveOutfitNpc(selectedItem.value);
  if (exclusiveNpc && target !== exclusiveNpc) {
    if (typeof toastr !== 'undefined') toastr.warning('命契不合，此衣不认其主');
    return;
  }

  if (!isExclusiveOutfitUnlocked(selectedItem.value, data.NPC)) {
    if (typeof toastr !== 'undefined') toastr.warning('命契未成，此衣尚未显化');
    return;
  }

  if (target !== '玩家' && !exclusiveNpc) {
    const npc好感度 = data.NPC[target as keyof typeof data.NPC]?.好感度 ?? 0;
    if (!checkItemThreshold(npc好感度, selectedItem.value)) {
      if (typeof toastr !== 'undefined') toastr.warning(`${target}灵犀未至，禁制未开「${getItemDisplayName(selectedItem.value)}」`);
      return;
    }
  }

  if (['牝印', '牝环', '牝铃', '牝链'].includes(selectedItem.value) && target !== '玩家') {
    if (typeof toastr !== 'undefined') toastr.warning('牝奴禁器只认本身气血');
    return;
  }

  const itemName = selectedItem.value;
  data.道具.装备 = {
    ...data.道具.装备,
    [target]: [...(data.道具.装备[target] ?? []), itemName],
  };
  consumeOwnedItem(itemName);
  记录装备道具(itemName, target);
  selectedItem.value = null;
}

function visibleEquippedForTarget(target: string): string[] {
  const equipped = data.道具.装备[target] ?? [];
  return isPhase2.value ? equipped.filter(isP2ArtifactItem) : equipped;
}

function getTargetLabel(target: string): string {
  if (isPhase2.value && target === '玩家') return '己身';
  return target;
}

function isCurrentRoutineItem(name: string): boolean {
  return phase2RoutineState.value.requiredItems.includes(name);
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

/* ═══════════════════════════════════
   囊·背包页面 — 金册玉牒
   ═══════════════════════════════════ */

.backpack-page {
  padding: 12px 0;
}

/* 区域 */
.section {
  margin-bottom: 20px;
}

/* 区域标题 — 金册装饰线 */
.section-header {
  @include section-header;
}

/* 道具列表 — 囊中金石 */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: none;
  background: var(--hh-bg-card);
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all 0.35s ease;

  &:hover {
    background: var(--hh-bg-hover);
    box-shadow: 0 0 16px var(--hh-glow-color);
  }

  &.selected {
    background: var(--hh-accent-glow);
    box-shadow: 0 0 20px var(--hh-glow-color);

    .item-name {
      color: var(--hh-accent);
    }
  }

  .item-name {
    font-family: $font-铭文;
    font-size: 14px;
    color: var(--hh-text-secondary);
    letter-spacing: 4px;
    transition: color 0.25s ease;
  }

  .item-count {
    font-family: $font-铭文;
    font-size: 13px;
    color: var(--hh-gold);
  }
}

.item-focus,
.routine-badge {
  font-size: 11px;
  color: color-mix(in srgb, var(--p2-incense, var(--hh-text-secondary)) 64%, transparent);
  letter-spacing: 2px;
}

.routine-badge {
  color: var(--p2-blood, var(--hh-accent));
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 24px;

  .empty-glyph {
    font-family: $font-铭文;
    font-size: 24px;
    color: var(--hh-text-muted);
  }

  .empty-text {
    font-size: 12px;
    color: var(--hh-text-muted);
    letter-spacing: 4px;
  }
}

/* 装备区域 — 金印分配 */
.equip-section {
  margin-bottom: 20px;
  padding: 14px;
  border: none;
  background: var(--hh-bg-surface);
  border-radius: $radius-md;
}

.p2-selected-note {
  margin: 0 0 10px;
  color: color-mix(in srgb, var(--p2-incense, var(--hh-text-secondary)) 78%, transparent);
  font-size: 12px;
  line-height: 1.65;
  letter-spacing: 1px;
}

.equip-targets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.target-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border: none;
  background: var(--hh-bg-card);
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all 0.35s ease;
  font-family: $font-铭文;
  font-size: 13px;
  color: var(--hh-text-secondary);
  letter-spacing: 4px;

  .btn-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--hh-text-muted);
    transition: all 0.25s ease;
  }

  &.equipped {
    background: var(--hh-accent-glow);
    color: var(--hh-accent);
    box-shadow: 0 0 16px var(--hh-glow-color);

    .btn-dot {
      background: var(--hh-accent);
      box-shadow: 0 0 6px var(--hh-glow-color);
    }
  }

  &.cannot-equip:not(.equipped) {
    opacity: 0.35;
    cursor: not-allowed;

    &:hover {
      border-color: var(--hh-gold-glow);
      color: var(--hh-text-secondary);
    }
  }

  &:hover:not(.equipped):not(.cannot-equip) {
    background: var(--hh-bg-hover);
    color: var(--hh-text-primary);
    box-shadow: 0 0 12px var(--hh-glow-color);
  }
}


.target-use-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.target-empty {
  padding: 10px 14px;
  text-align: center;
  font-family: $font-铭文;
  font-size: 12px;
  color: var(--hh-text-muted);
  letter-spacing: 4px;
  background: radial-gradient(ellipse at 50% 50%, var(--hh-bg-card), transparent 72%);
}
.use-panel {
  display: flex;
  justify-content: center;
  padding: 6px 0;
}

.use-btn {
  padding: 8px 28px;
  border: none;
  background: linear-gradient(to right, transparent, var(--hh-accent-glow), transparent);
  cursor: pointer;
  transition: all 0.35s ease;
  font-family: $font-铭文;
  font-size: 13px;
  color: var(--hh-accent);
  letter-spacing: 4px;

  &:hover {
    color: var(--hh-text-primary);
    text-shadow: 0 0 12px var(--hh-glow-color);
  }
}
/* 装备列表 — 已盖金印 */
.equip-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.equip-row {
  display: flex;
  align-items: baseline;
  padding: 8px 12px;
  background: var(--hh-bg-card);
  border: none;
  border-radius: $radius-sm;

  .target-name {
    font-family: $font-铭文;
    font-size: 13px;
    color: var(--hh-gold);
    min-width: 48px;
  }

  .target-divider {
    color: var(--hh-text-muted);
    margin-right: 4px;
  }

  .equipped-items {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 12px;
    color: var(--hh-text-secondary);
    letter-spacing: 0.03em;
  }

  .equipped-item {
    border: none;
    padding: 0;
    background: transparent;
    cursor: pointer;
    font: inherit;
    color: var(--hh-text-secondary);
    transition: color 0.25s ease, text-shadow 0.25s ease;


    &:hover {
      color: var(--hh-text-primary);
      text-shadow: 0 0 8px var(--hh-glow-color);
    }
  }
}

.p2-body-echo {
  margin-top: 12px;
  padding: 11px 12px;
  background:
    radial-gradient(ellipse at 12% 18%, color-mix(in srgb, var(--p2-blood, var(--hh-accent)) 12%, transparent), transparent 54%),
    linear-gradient(90deg, rgba(var(--p2-skin-rgb, 255, 253, 249), 0.72), rgba(var(--p2-skin-rgb, 255, 253, 249), 0.92));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--p2-gold, var(--hh-gold)) 14%, transparent);
}

.p2-echo-row,
.p2-echo-empty {
  font-size: 12px;
  line-height: 1.65;
  color: color-mix(in srgb, var(--p2-incense, var(--hh-text-secondary)) 78%, transparent);
}

.p2-echo-row {
  display: grid;
  grid-template-columns: minmax(76px, 0.32fr) 1fr;
  gap: 8px;
  padding: 5px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--p2-gold, var(--hh-gold)) 10%, transparent);

  &:last-child {
    border-bottom: 0;
  }
}

.p2-echo-name {
  color: var(--p2-blood, var(--hh-accent));
  font-family: $font-铭文;
  letter-spacing: 2px;
}

.backpack-page[data-phase='牝奴期'] {
  .section {
    margin-bottom: 16px;
  }

  .item-row,
  .equip-section {
    background:
      linear-gradient(90deg, rgba(var(--p2-skin-rgb, 255, 253, 249), 0.84), rgba(var(--p2-skin-rgb, 255, 253, 249), 0.96)),
      radial-gradient(ellipse at 88% 18%, color-mix(in srgb, var(--p2-blood, var(--hh-accent)) 10%, transparent), transparent 56%);
    box-shadow: inset 0 -10px 18px rgba(90, 66, 58, 0.04);
  }

  .item-row.selected {
    background:
      radial-gradient(ellipse at 20% 50%, color-mix(in srgb, var(--p2-blood, var(--hh-accent)) 16%, transparent), transparent 64%),
      rgba(var(--p2-skin-rgb, 255, 253, 249), 0.94);
  }

  .target-btn {
    background: rgba(var(--p2-skin-rgb, 255, 253, 249), 0.86);
    color: var(--p2-incense, var(--hh-text-secondary));
  }
}

/* 展开动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
