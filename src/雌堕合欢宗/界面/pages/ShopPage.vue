<template>
  <div class="shop-page">
    <!-- 灵石余额 -->
    <div class="shop-header">
      <div class="balance-display">
        <span class="balance-glyph">石</span>
        <div class="balance-info">
          <span class="balance-label">灵石余额</span>
          <span class="balance-value">{{ data.系统.灵石 }}</span>
        </div>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.key"
        :class="['tab-btn', { active: activeCategory === cat.key }]"
        @click="activeCategory = cat.key"
      >
        <span class="tab-glyph">{{ cat.glyph }}</span>
        <span class="tab-text">{{ cat.label }}</span>
      </button>
    </div>

    <!-- 物品格子 -->
    <div class="item-grid">
      <div
        v-for="item in currentItems"
        :key="'名称' in item ? item.名称 : item.NPC"
        :class="['item-card', { disabled: !canBuy(item) }]"
        @click="showDetail(item)"
      >
        <div class="card-top">
          <div class="item-name">{{ '名称' in item ? item.名称 : item.NPC }}</div>
          <div v-if="item.好感度门槛 > 0" class="item-threshold">
            好感 {{ item.好感度门槛 }}+
          </div>
        </div>
        <div class="card-bottom">
          <div class="item-price">
            <span class="price-glyph">石</span>
            <span class="price-num">{{ item.价格 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 物品详情弹窗 -->
    <Transition name="modal">
      <div v-if="selectedItem" class="detail-overlay" @click.self="selectedItem = null">
        <div class="detail-modal">
          <!-- 弹窗装饰 -->
          <div class="modal-ornament top-left"></div>
          <div class="modal-ornament top-right"></div>
          <div class="modal-ornament bottom-left"></div>
          <div class="modal-ornament bottom-right"></div>

          <div class="modal-header">
            <div class="header-line"></div>
            <span class="header-glyph">鉴</span>
            <div class="header-line"></div>
          </div>

          <h3 class="modal-title">{{ '名称' in selectedItem ? selectedItem.名称 : selectedItem.NPC }}</h3>
          <p v-if="'描述' in selectedItem" class="modal-desc">{{ selectedItem.描述 }}</p>
          <p v-if="'揭示' in selectedItem" class="modal-desc">{{ selectedItem.NPC }}：{{ selectedItem.揭示 }}</p>
          <p v-if="'效果' in selectedItem" class="modal-effect">
            <span class="effect-label">效：</span>{{ '效果' in selectedItem ? selectedItem.效果 : '' }}
          </p>

          <div class="modal-price">
            <span class="price-glyph">石</span>
            <span class="price-num">{{ selectedItem.价格 }}</span>
          </div>

          <button
            class="buy-btn"
            :disabled="!canBuy(selectedItem)"
            @click="buyItem(selectedItem)"
          >
            {{ getBuyButtonText(selectedItem) }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from '../store';
import { NSFW道具, 永久丹药, 特殊道具 } from '../data/items';
import { 服装列表 } from '../data/outfits';
import { 特殊场景, 特殊剧情 } from '../data/scenes';
import { checkItemThreshold } from '../guards';

type ShopItem =
  | (typeof 服装列表)[number]
  | (typeof NSFW道具)[number]
  | (typeof 永久丹药)[number]
  | (typeof 特殊道具)[number]
  | (typeof 特殊场景)[number]
  | (typeof 特殊剧情)[number];

const store = useDataStore();
const data = store.data;

function getItemName(item: ShopItem): string {
  return '名称' in item && item.名称 ? item.名称 : ('NPC' in item ? item.NPC : '');
}

const categories = [
  { key: 'clothing', glyph: '裳', label: '服装' },
  { key: 'nsfw', glyph: '淫', label: 'NSFW' },
  { key: 'pill', glyph: '丹', label: '丹药' },
  { key: 'scene', glyph: '景', label: '场景' },
  { key: 'story', glyph: '缘', label: '剧情' },
  { key: 'special', glyph: '异', label: '特殊' },
];

const activeCategory = ref('clothing');
const selectedItem = ref<ShopItem | null>(null);

const currentItems = computed(() => {
  switch (activeCategory.value) {
    case 'clothing': return 服装列表;
    case 'nsfw': return NSFW道具;
    case 'pill': return 永久丹药;
    case 'scene': return 特殊场景;
    case 'story': return 特殊剧情;
    case 'special': return 特殊道具;
    default: return [];
  }
});

function canBuy(item: ShopItem): boolean {
  // 灵石不足
  if (data.系统.灵石 < item.价格) return false;

  const name = getItemName(item);

  // 改变阵法：需要柳素衣攻略值=100
  if (name === '改变阵法') {
    return (data.NPC['柳素衣']?.攻略值 ?? 0) >= 100;
  }

  // 装备类道具：检查好感度门槛（至少有一个NPC满足）
  if (item.好感度门槛 > 0 && item.类型 === '装备') {
    const npc列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
    return npc列表.some(npc => checkItemThreshold(data.NPC[npc]?.好感度 ?? 0, name));
  }

  return true;
}

function getBuyButtonText(item: ShopItem): string {
  if (data.系统.灵石 < item.价格) return '灵石不足';
  const name = getItemName(item);
  if (name === '改变阵法' && (data.NPC['柳素衣']?.攻略值 ?? 0) < 100) return '需柳素衣攻略';
  if (item.好感度门槛 > 0 && item.类型 === '装备') {
    const npc列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
    if (!npc列表.some(npc => checkItemThreshold(data.NPC[npc]?.好感度 ?? 0, name))) {
      return '好感度不足';
    }
  }
  return '购入';
}

function showDetail(item: ShopItem) {
  selectedItem.value = item;
}

function buyItem(item: ShopItem) {
  if (!canBuy(item)) return;
  const name = getItemName(item);
  data.系统.灵石 -= item.价格;
  if (!data.道具.拥有[name]) {
    data.道具.拥有[name] = 0;
  }
  data.道具.拥有[name]++;
  selectedItem.value = null;
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

/* ═══════════════════════════════════
   坊市·商城页面 — 金册玉牒
   ═══════════════════════════════════ */

.shop-page {
  padding: 12px 0;
}

/* 灵石余额 — 金库天窗 */
.shop-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 14px;
}

.balance-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  @include gold-foil;
  border-radius: $radius-md;

  .balance-glyph {
    font-family: $font-铭文;
    font-size: 16px;
    color: rgba(212, 160, 23, 0.6);
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(212, 160, 23, 0.2);
    border-radius: $radius-sm;
    background: rgba(212, 160, 23, 0.05);
  }

  .balance-info {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .balance-label {
    font-size: 10px;
    color: rgba(180, 150, 100, 0.4);
    letter-spacing: 0.05em;
  }

  .balance-value {
    font-family: $font-铭文;
    font-size: 18px;
    font-weight: 700;
    color: $铭文赤金;
    @include inscription-engrave;
  }
}

/* 分类标签 — 金箔签条 */
.category-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(212, 160, 23, 0.15);
    border-radius: 2px;
  }
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(42, 31, 20, 0.6);
  border: 1px solid rgba(212, 160, 23, 0.1);
  border-radius: $radius-sm;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;

  .tab-glyph {
    font-family: $font-铭文;
    font-size: 13px;
    color: rgba(180, 150, 100, 0.4);
    transition: all 0.25s ease;
  }

  .tab-text {
    font-size: 12px;
    color: rgba(180, 150, 100, 0.5);
    letter-spacing: 0.05em;
    transition: all 0.25s ease;
  }

  &.active {
    background: rgba(212, 160, 23, 0.1);
    border-color: rgba(212, 160, 23, 0.3);
    box-shadow: $shadow-金色发光;

    .tab-glyph {
      color: $册缘鎏金;
    }

    .tab-text {
      color: rgba(212, 160, 23, 0.8);
    }
  }

  &:hover:not(.active) {
    border-color: rgba(212, 160, 23, 0.2);

    .tab-glyph {
      color: rgba(212, 160, 23, 0.6);
    }

    .tab-text {
      color: rgba(212, 160, 23, 0.6);
    }
  }
}

/* 物品格子 — 金册货架 */
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
}

.item-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 10px;
  @include gold-foil;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all 0.25s ease;
  min-height: 80px;

  &:hover {
    border-color: rgba(212, 160, 23, 0.3);
    transform: translateY(-2px);
    box-shadow: $shadow-卡片;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  .card-top {
    .item-name {
      font-family: $font-铭文;
      font-size: 14px;
      color: rgba(212, 160, 23, 0.8);
      letter-spacing: 0.08em;
      margin-bottom: 4px;
    }

    .item-threshold {
      font-size: 10px;
      color: rgba(180, 150, 100, 0.35);
      letter-spacing: 0.05em;
    }
  }

  .card-bottom {
    .item-price {
      display: flex;
      align-items: center;
      gap: 4px;

      .price-glyph {
        font-family: $font-铭文;
        font-size: 11px;
        color: rgba(212, 160, 23, 0.5);
      }

      .price-num {
        font-family: $font-铭文;
        font-size: 15px;
        font-weight: 700;
        color: $册缘鎏金;
      }
    }
  }
}

/* 详情弹窗遮罩 */
.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

/* 详情弹窗 — 展开金函 */
.detail-modal {
  position: relative;
  width: 90%;
  max-width: 300px;
  padding: 24px 20px;
  @include gold-foil;
  border-radius: $radius-lg;
  box-shadow: $shadow-弹窗;
}

/* 弹窗角落装饰 */
.modal-ornament {
  position: absolute;
  width: 16px;
  height: 16px;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(212, 160, 23, 0.4);
  }

  &.top-left {
    top: 6px;
    left: 6px;
    &::before { top: 0; left: 0; width: 10px; height: 1px; }
    &::after { top: 0; left: 0; width: 1px; height: 10px; }
  }

  &.top-right {
    top: 6px;
    right: 6px;
    &::before { top: 0; right: 0; width: 10px; height: 1px; }
    &::after { top: 0; right: 0; width: 1px; height: 10px; }
  }

  &.bottom-left {
    bottom: 6px;
    left: 6px;
    &::before { bottom: 0; left: 0; width: 10px; height: 1px; }
    &::after { bottom: 0; left: 0; width: 1px; height: 10px; }
  }

  &.bottom-right {
    bottom: 6px;
    right: 6px;
    &::before { bottom: 0; right: 0; width: 10px; height: 1px; }
    &::after { bottom: 0; right: 0; width: 1px; height: 10px; }
  }
}

/* 弹窗顶部装饰 */
.modal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;

  .header-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 160, 23, 0.3), transparent);
  }

  .header-glyph {
    font-family: $font-铭文;
    font-size: 12px;
    color: rgba(212, 160, 23, 0.5);
  }
}

.modal-title {
  font-family: $font-铭文;
  font-size: 20px;
  font-weight: 700;
  color: $册缘鎏金;
  text-align: center;
  letter-spacing: 0.15em;
  margin: 0 0 12px;
  @include inscription-engrave;
}

.modal-desc {
  font-size: 13px;
  color: rgba(180, 150, 100, 0.6);
  line-height: 1.6;
  margin: 0 0 10px;
  text-align: center;
}

.modal-effect {
  font-size: 12px;
  color: rgba(212, 160, 23, 0.5);
  font-style: italic;
  margin: 0 0 14px;
  text-align: center;

  .effect-label {
    color: rgba(212, 160, 23, 0.4);
    font-style: normal;
  }
}

.modal-price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 16px;

  .price-glyph {
    font-family: $font-铭文;
    font-size: 14px;
    color: rgba(212, 160, 23, 0.5);
  }

  .price-num {
    font-family: $font-铭文;
    font-size: 22px;
    font-weight: 700;
    color: $铭文赤金;
    @include inscription-engrave;
  }
}

.buy-btn {
  width: 100%;
  padding: 10px;
  @include gold-seal-btn;
  font-family: $font-铭文;
  font-size: 15px;
  color: $册缘鎏金;
  letter-spacing: 0.1em;
}

/* 弹窗动画 — 金函展开 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;

  .detail-modal {
    transition: transform 0.25s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .detail-modal {
    transform: scale(0.95);
  }
}
</style>
