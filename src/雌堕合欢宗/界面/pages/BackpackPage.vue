<template>
  <div class="backpack-page">
    <!-- 囊中藏珍 -->
    <div class="section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">囊</span>
        <span class="header-text">囊中藏珍</span>
        <div class="header-line"></div>
      </div>

      <div class="item-list">
        <div
          v-for="(count, name) in ownedItems"
          :key="name"
          :class="['item-row', { selected: selectedItem === String(name), 'is-empty': count === 0 }]"
          @click="selectItem(String(name))"
        >
          <span class="item-name">{{ name }}</span>
          <span :class="['item-count', { 'count-up': countAnimating && count > 0 }]">x{{ count }}</span>
        </div>
        <div v-if="Object.keys(ownedItems).length === 0" class="empty-state">
          <span class="empty-glyph">空</span>
          <span class="empty-text">锦囊尚空</span>
        </div>
      </div>
    </div>

    <!-- 装备选择 -->
    <Transition name="slide">
      <div v-if="selectedItem" class="equip-section">
        <div class="section-header">
          <div class="header-line"></div>
          <span class="header-glyph">佩</span>
          <span class="header-text">安置「{{ selectedItem }}」</span>
          <div class="header-line"></div>
        </div>

        <div v-if="isEquippableItem(selectedItem)" class="equip-targets">
          <button
            v-for="target in equipTargets"
            :key="target"
            :class="['target-btn', { equipped: isEquipped(target), 'cannot-equip': !canEquipTo(target) }]"
            :title="!canEquipTo(target) ? `${target}灵犀未至` : ''"
            @click="toggleEquip(target)"
          >
            <span class="btn-dot"></span>
            {{ target }}
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
              {{ target }}
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
        <span class="header-glyph">甲</span>
        <span class="header-text">法器归属</span>
        <div class="header-line"></div>
      </div>

      <div class="equip-list">
        <div v-for="target in equipTargets" :key="target" class="equip-row">
          <span class="target-name">{{ target }}</span>
          <span class="target-divider">：</span>
          <span class="equipped-items">
            <template v-if="data.道具.装备[target]?.length > 0">
              <button
                v-for="(item, index) in data.道具.装备[target]"
                :key="`${target}-${item}`"
                type="button"
                class="equipped-item"
                @click="selectItem(item)"
              >
                {{ item }}{{ index < data.道具.装备[target].length - 1 ? '、' : '' }}
              </button>
            </template>
            <span v-else>虚位</span>
          </span>
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

const store = useDataStore();
const data = store.data;
const { 记录装备道具, 记录卸下道具, 记录使用物品 } = usePendingAction();

const selectedItem = ref<string | null>(null);
const countAnimating = ref(false);
const equipTargets = ['玩家', '白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'];
const ownedItems = computed(() => {
  return Object.fromEntries(Object.entries(data.道具.拥有).filter(([, count]) => count > 0));
});

const consumableTargets = computed(() => get在场NPC列表(data.系统.场景上下文));

watch(() => data.道具.拥有, () => {
  countAnimating.value = true;
  setTimeout(() => { countAnimating.value = false; }, 300);
}, { deep: true });

function selectItem(name: string) {
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
  if (isEquipped(target)) return true;
  if ((data.道具.拥有[selectedItem.value] ?? 0) <= 0) return false;
  if (target === '玩家') return true;
  if (!canEquip牝奴道具(data.系统.阶段, selectedItem.value)) {
    return false;
  }
  const npc好感度 = data.NPC[target as keyof typeof data.NPC]?.好感度 ?? 0;
  return checkItemThreshold(npc好感度, selectedItem.value);
}

function consumeOwnedItem(name: string) {
  const count = data.道具.拥有[name] ?? 0;
  if (count <= 1) {
    delete data.道具.拥有[name];
    return;
  }
  data.道具.拥有[name] = count - 1;
}

function restoreOwnedItem(name: string) {
  data.道具.拥有[name] = (data.道具.拥有[name] ?? 0) + 1;
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

  if (!data.道具.装备[target]) {
    data.道具.装备[target] = [];
  }

  const index = data.道具.装备[target].indexOf(selectedItem.value);
  if (index >= 0) {
    data.道具.装备[target].splice(index, 1);
    restoreOwnedItem(selectedItem.value);
    记录卸下道具(selectedItem.value, target);
    return;
  }

  if ((data.道具.拥有[selectedItem.value] ?? 0) <= 0) {
    if (typeof toastr !== 'undefined') toastr.warning(`囊中已无「${selectedItem.value}」，不可再供此器`);
    return;
  }

  if (target !== '玩家') {
    const npc好感度 = data.NPC[target as keyof typeof data.NPC]?.好感度 ?? 0;
    if (!checkItemThreshold(npc好感度, selectedItem.value)) {
      if (typeof toastr !== 'undefined') toastr.warning(`${target}灵犀未至，禁制未开「${selectedItem.value}」`);
      return;
    }
  }

  if (['牝印', '牝环', '牝铃', '牝链'].includes(selectedItem.value) && target !== '玩家') {
    if (typeof toastr !== 'undefined') toastr.warning('牝奴禁器只认本身气血');
    return;
  }

  data.道具.装备[target].push(selectedItem.value);
  consumeOwnedItem(selectedItem.value);
  记录装备道具(selectedItem.value, target);
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
