<template>
  <div class="backpack-page">
    <!-- 已拥有道具 -->
    <div class="section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">囊</span>
        <span class="header-text">已拥有道具</span>
        <div class="header-line"></div>
      </div>

      <div class="item-list">
        <div
          v-for="(count, name) in ownedItems"
          :key="name"
          :class="['item-row', { selected: selectedItem === String(name) }]"
          @click="selectItem(String(name))"
        >
          <span class="item-name">{{ name }}</span>
          <span class="item-count">x{{ count }}</span>
        </div>
        <div v-if="Object.keys(ownedItems).length === 0" class="empty-state">
          <span class="empty-glyph">空</span>
          <span class="empty-text">暂无道具</span>
        </div>
      </div>
    </div>

    <!-- 装备选择 -->
    <Transition name="slide">
      <div v-if="selectedItem" class="equip-section">
        <div class="section-header">
          <div class="header-line"></div>
          <span class="header-glyph">佩</span>
          <span class="header-text">装备「{{ selectedItem }}」</span>
          <div class="header-line"></div>
        </div>

        <div class="equip-targets">
          <button
            v-for="target in equipTargets"
            :key="target"
            :class="['target-btn', { equipped: isEquipped(target), 'cannot-equip': !canEquipTo(target) }]"
            :title="!canEquipTo(target) ? `${target}好感度不足` : ''"
            @click="toggleEquip(target)"
          >
            <span class="btn-dot"></span>
            {{ target }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- 当前装备 -->
    <div class="section">
      <div class="section-header">
        <div class="header-line"></div>
        <span class="header-glyph">甲</span>
        <span class="header-text">当前装备</span>
        <div class="header-line"></div>
      </div>

      <div class="equip-list">
        <div
          v-for="target in equipTargets"
          :key="target"
          class="equip-row"
        >
          <span class="target-name">{{ target }}</span>
          <span class="target-divider">：</span>
          <span class="equipped-items">
            {{ data.道具.装备[target]?.length > 0 ? data.道具.装备[target].join('、') : '无' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from '../store';
import { checkItemThreshold } from '../guards';

const store = useDataStore();
const data = store.data;

const selectedItem = ref<string | null>(null);
const equipTargets = ['玩家', '白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'];

const ownedItems = computed(() => {
  return Object.fromEntries(
    Object.entries(data.道具.拥有).filter(([_, count]) => count > 0)
  );
});

function selectItem(name: string) {
  selectedItem.value = selectedItem.value === name ? null : name;
}

function isEquipped(target: string): boolean {
  if (!selectedItem.value) return false;
  return data.道具.装备[target]?.includes(selectedItem.value) ?? false;
}

function canEquipTo(target: string): boolean {
  if (!selectedItem.value) return true;
  if (target === '玩家') return true;
  const npc好感度 = data.NPC[target as keyof typeof data.NPC]?.好感度 ?? 0;
  return checkItemThreshold(npc好感度, selectedItem.value);
}

function toggleEquip(target: string) {
  if (!selectedItem.value) return;

  if (!data.道具.装备[target]) {
    data.道具.装备[target] = [];
  }

  const index = data.道具.装备[target].indexOf(selectedItem.value);
  if (index >= 0) {
    data.道具.装备[target].splice(index, 1);
  } else {
    // 装备时检查好感度门槛（玩家自身无限制）
    if (target !== '玩家') {
      const npc好感度 = data.NPC[target as keyof typeof data.NPC]?.好感度 ?? 0;
      if (!checkItemThreshold(npc好感度, selectedItem.value)) {
        toastr.warning(`${target}好感度不足，无法装备「${selectedItem.value}」`);
        return;
      }
    }
    data.道具.装备[target].push(selectedItem.value);
  }
}
</script>

<style lang="scss" scoped>
/* ═══════════════════════════════════
   囊·背包页面
   ═══════════════════════════════════ */

.backpack-page {
  padding: 12px 0;
}

/* 区域 */
.section {
  margin-bottom: 20px;
}

/* 区域标题 */
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  .header-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 160, 23, 0.2), transparent);
  }

  .header-glyph {
    font-family: 'Noto Serif SC', serif;
    font-size: 13px;
    color: rgba(212, 160, 23, 0.5);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(212, 160, 23, 0.15);
    border-radius: 3px;
    background: rgba(212, 160, 23, 0.03);
  }

  .header-text {
    font-family: 'Noto Serif SC', serif;
    font-size: 13px;
    color: rgba(180, 150, 100, 0.5);
    letter-spacing: 0.1em;
  }
}

/* 道具列表 */
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
  background: linear-gradient(180deg, rgba(42, 31, 20, 0.8) 0%, rgba(30, 21, 13, 0.9) 100%);
  border: 1px solid rgba(212, 160, 23, 0.08);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(212, 160, 23, 0.2);
  }

  &.selected {
    border-color: rgba(212, 160, 23, 0.35);
    background: rgba(212, 160, 23, 0.06);

    .item-name {
      color: #d4a017;
    }
  }

  .item-name {
    font-family: 'Noto Serif SC', serif;
    font-size: 14px;
    color: rgba(180, 150, 100, 0.7);
    letter-spacing: 0.05em;
    transition: color 0.25s ease;
  }

  .item-count {
    font-family: 'Noto Serif SC', serif;
    font-size: 13px;
    color: rgba(212, 160, 23, 0.5);
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
    font-family: 'Noto Serif SC', serif;
    font-size: 24px;
    color: rgba(180, 150, 100, 0.15);
  }

  .empty-text {
    font-size: 12px;
    color: rgba(180, 150, 100, 0.3);
    letter-spacing: 0.1em;
  }
}

/* 装备区域 */
.equip-section {
  margin-bottom: 20px;
  padding: 14px;
  background: rgba(212, 160, 23, 0.03);
  border: 1px solid rgba(212, 160, 23, 0.1);
  border-radius: 6px;
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
  background: rgba(42, 31, 20, 0.7);
  border: 1px solid rgba(212, 160, 23, 0.1);
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Noto Serif SC', serif;
  font-size: 13px;
  color: rgba(180, 150, 100, 0.6);
  letter-spacing: 0.05em;
  transition: all 0.25s ease;

  .btn-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(180, 150, 100, 0.2);
    transition: all 0.25s ease;
  }

  &.equipped {
    background: rgba(212, 160, 23, 0.12);
    border-color: rgba(212, 160, 23, 0.3);
    color: #d4a017;

    .btn-dot {
      background: #d4a017;
      box-shadow: 0 0 4px rgba(212, 160, 23, 0.5);
    }
  }

  &.cannot-equip:not(.equipped) {
    opacity: 0.35;
    cursor: not-allowed;

    &:hover {
      border-color: rgba(212, 160, 23, 0.1);
      color: rgba(180, 150, 100, 0.6);
    }
  }

  &:hover:not(.equipped) {
    border-color: rgba(212, 160, 23, 0.2);
    color: rgba(212, 160, 23, 0.7);
  }
}

/* 装备列表 */
.equip-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.equip-row {
  display: flex;
  align-items: baseline;
  padding: 8px 12px;
  background: linear-gradient(180deg, rgba(42, 31, 20, 0.6) 0%, rgba(30, 21, 13, 0.7) 100%);
  border: 1px solid rgba(212, 160, 23, 0.06);
  border-radius: 4px;

  .target-name {
    font-family: 'Noto Serif SC', serif;
    font-size: 13px;
    color: rgba(212, 160, 23, 0.6);
    min-width: 48px;
  }

  .target-divider {
    color: rgba(180, 150, 100, 0.2);
    margin-right: 4px;
  }

  .equipped-items {
    font-size: 12px;
    color: rgba(180, 150, 100, 0.45);
    letter-spacing: 0.03em;
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
