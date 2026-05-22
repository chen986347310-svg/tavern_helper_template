<template>
  <div class="shop-page">
    <!-- 囊中灵蕴 -->
    <div class="shop-header">
      <div :class="['balance-display', balanceClass]">
        <span class="balance-glyph">◆</span>
        <div class="balance-info">
          <span class="balance-label">囊中灵蕴</span>
          <span class="balance-value">{{ store.data.系统.灵石 }}</span>
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
          <div v-if="item.好感度门槛 > 0" class="item-threshold">灵犀 {{ item.好感度门槛 }}+</div>
        </div>
        <div class="card-bottom">
          <div class="item-price">
            <span class="price-glyph">◆</span>
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
            <span class="effect-label">法效：</span>{{ '效果' in selectedItem ? selectedItem.效果 : '' }}
          </p>

          <div class="modal-price">
            <span class="price-glyph">◆</span>
            <span class="price-num">{{ selectedItem.价格 }}</span>
          </div>

          <button :class="['buy-btn', { shake: shakeBtn }]" :disabled="!canBuy(selectedItem)" @click="handleBuyClick(selectedItem)">
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
import { 牝奴道具 } from '../data/items';
import { 服装列表 } from '../data/outfits';
import { 牝奴服装列表 } from '../data/outfits';
import { 特殊场景, 特殊剧情 } from '../data/scenes';
import { checkItemThreshold } from '../guards';
import { usePendingAction } from '../composables/usePendingAction';

type ShopItem =
  | (typeof 服装列表)[number]
  | (typeof NSFW道具)[number]
  | (typeof 永久丹药)[number]
  | (typeof 特殊道具)[number]
  | (typeof 特殊场景)[number]
  | (typeof 特殊剧情)[number]
  | (typeof 牝奴道具)[number]
  | (typeof 牝奴服装列表)[number];

const store = useDataStore();
const { 记录购买物品 } = usePendingAction();

function getItemName(item: ShopItem): string {
  return '名称' in item && item.名称 ? item.名称 : 'NPC' in item ? item.NPC : '';
}

const categories = computed(() => {
  const base = [
    { key: 'clothing', glyph: '裳', label: '服装' },
    { key: 'nsfw', glyph: '淫', label: '禁器' },
    { key: 'pill', glyph: '丹', label: '丹药' },
    { key: 'scene', glyph: '景', label: '场景' },
    { key: 'story', glyph: '缘', label: '剧情' },
    { key: 'special', glyph: '异', label: '特殊' },
  ];
  if (store.data.系统.阶段 === '牝奴期') {
    base.push({ key: 'inuninu', glyph: '牝', label: '牝奴' });
  }
  return base;
});

const activeCategory = ref('clothing');
const selectedItem = ref<ShopItem | null>(null);
const shakeBtn = ref(false);

const balanceClass = computed(() => {
  if (!selectedItem.value) return '';
  return store.data.系统.灵石 >= selectedItem.value.价格 ? 'balance-sufficient' : 'balance-depleted';
});

const currentItems = computed(() => {
  switch (activeCategory.value) {
    case 'clothing':
      return 服装列表;
    case 'nsfw':
      return NSFW道具;
    case 'pill':
      return 永久丹药;
    case 'scene':
      return 特殊场景;
    case 'story':
      return 特殊剧情;
    case 'special':
      return 特殊道具;
    case 'inuninu':
      return [...牝奴道具, ...牝奴服装列表];
    default:
      return [];
  }
});

function canBuy(item: ShopItem): boolean {
  // 嘴中膏涩
  if (store.data.系统.灵石 < item.价格) return false;

  const name = getItemName(item);

  // 改变阵法：需要柳素衣攻略值=100
  if (name === '改变阵法') {
    return (store.data.NPC['柳素衣']?.攻略值 ?? 0) >= 100;
  }

  // 牝奴道具不走好感度门槛，但需要在牝奴期
  const isBiNuItem = ['牝印', '牝环', '牝铃', '牝链'].includes(name);
  if (isBiNuItem) {
    return store.data.系统.阶段 === '牝奴期';
  }

  // 装备类道具：检查好感度门槛（至少有一个NPC满足）
  if (item.好感度门槛 > 0 && item.类型 === '装备') {
    const npc列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
    return npc列表.some(npc => checkItemThreshold(store.data.NPC[npc]?.好感度 ?? 0, name));
  }

  return true;
}

function getBuyButtonText(item: ShopItem): string {
  if (store.data.系统.灵石 < item.价格) return '囊中羞涩';
  const name = getItemName(item);
  if (name === '改变阵法' && (store.data.NPC['柳素衣']?.攻略值 ?? 0) < 100) return '素衣因果未满';
  if (item.好感度门槛 > 0 && item.类型 === '装备') {
    const npc列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
    if (!npc列表.some(npc => checkItemThreshold(store.data.NPC[npc]?.好感度 ?? 0, name))) {
      return '灵犀未至';
    }
  }
  const t = document.documentElement.getAttribute('data-theme'); return t === 'taohua' ? '结清因果' : '纳为己有';
}

function showDetail(item: ShopItem) {
  selectedItem.value = item;
}

function handleBuyClick(item: ShopItem) {
  if (!canBuy(item)) {
    shakeBtn.value = true;
    setTimeout(() => { shakeBtn.value = false; }, 400);
    return;
  }
  buyItem(item);
}

function addUnique(list: string[], name: string) {
  if (!list.includes(name)) list.push(name);
}

function applyPurchaseResult(name: string) {
  if (activeCategory.value === 'scene') {
    addUnique(store.data.场景.已解锁, name);
    return;
  }
  if (activeCategory.value === 'story') {
    addUnique(store.data.剧情.已解锁, name);
    return;
  }
  if (name === '改变阵法') {
    store.data.系统.已使用阵法 = true;
    return;
  }

  if (!store.data.道具.拥有[name]) {
    store.data.道具.拥有[name] = 0;
  }
  store.data.道具.拥有[name]++;
}

function buyItem(item: ShopItem) {
  if (!canBuy(item)) return;
  const name = getItemName(item);
  store.data.系统.灵石 -= item.价格;
  applyPurchaseResult(name);
  记录购买物品(name);
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

/* 囊中灵蕴 — 金库天窗 */
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
  border: none;
  box-shadow: none;
  background: var(--hh-bg-surface);
  border-radius: $radius-md;

  .balance-glyph {
    font-family: $font-铭文;
    font-size: 16px;
    color: var(--hh-gold);
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--hh-gold-glow);
    border-radius: $radius-sm;
    background: var(--hh-gold-glow);
  }

  .balance-info {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .balance-label {
    font-size: 10px;
    color: var(--hh-text-muted);
    letter-spacing: 4px;
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
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  margin-bottom: 14px;
  overflow: visible;
  padding-bottom: 0;
}

.tab-btn {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 7px 6px;
  background: var(--hh-bg-surface);
  border: 1px solid var(--hh-gold-glow);
  border-radius: $radius-sm;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;

  .tab-glyph {
    font-family: $font-铭文;
    font-size: 13px;
    color: var(--hh-text-muted);
    transition: all 0.25s ease;
  }

  .tab-text {
    font-size: 12px;
    color: var(--hh-text-secondary);
    letter-spacing: 2px;
    transition: all 0.25s ease;
  }

  &.active {
    background: var(--hh-gold-glow);
    border-color: var(--hh-border-accent);
    box-shadow: $shadow-金色发光;

    .tab-glyph {
      color: $册缘鎏金;
    }

    .tab-text {
      color: var(--hh-text-primary);
    }
  }

  &:hover:not(.active) {
    border-color: var(--hh-gold-glow);

    .tab-glyph {
      color: var(--hh-gold);
    }

    .tab-text {
      color: var(--hh-gold);
    }
  }
}

/* 物品格子 — 金册货架 */
.item-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.item-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 10px;
  border: none;
  background: var(--hh-bg-card);
  border-radius: $radius-md;
  cursor: pointer;
  transition: all 0.35s ease;
  min-height: 80px;
  flex: 0 0 calc(50% - 5px);

  &:hover {
    background: var(--hh-bg-hover);
    transform: translateY(-2px);
    box-shadow: 0 0 20px var(--hh-glow-color);
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
      color: var(--hh-text-primary);
      letter-spacing: 4px;
      margin-bottom: 4px;
    }

    .item-threshold {
      font-size: 10px;
      color: var(--hh-text-muted);
      letter-spacing: 4px;
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
        color: var(--hh-gold);
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
  background: rgba(0, 0, 0, 0.75);
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
  border: none;
  background: var(--hh-bg-elevated);
  border-radius: $radius-lg;
  box-shadow: $shadow-弹窗;
}

/* 弹窗角落装饰 */
.modal-ornament {
  display: none;
  position: absolute;
  width: 16px;
  height: 16px;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: var(--hh-gold-glow);
  }

  &.top-left {
    top: 6px;
    left: 6px;
    &::before {
      top: 0;
      left: 0;
      width: 10px;
      height: 1px;
    }
    &::after {
      top: 0;
      left: 0;
      width: 1px;
      height: 10px;
    }
  }

  &.top-right {
    top: 6px;
    right: 6px;
    &::before {
      top: 0;
      right: 0;
      width: 10px;
      height: 1px;
    }
    &::after {
      top: 0;
      right: 0;
      width: 1px;
      height: 10px;
    }
  }

  &.bottom-left {
    bottom: 6px;
    left: 6px;
    &::before {
      bottom: 0;
      left: 0;
      width: 10px;
      height: 1px;
    }
    &::after {
      bottom: 0;
      left: 0;
      width: 1px;
      height: 10px;
    }
  }

  &.bottom-right {
    bottom: 6px;
    right: 6px;
    &::before {
      bottom: 0;
      right: 0;
      width: 10px;
      height: 1px;
    }
    &::after {
      bottom: 0;
      right: 0;
      width: 1px;
      height: 10px;
    }
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
    background: linear-gradient(90deg, transparent, var(--hh-border-accent), transparent);
  }

  .header-glyph {
    font-family: $font-铭文;
    font-size: 12px;
    color: var(--hh-gold);
  }
}

.modal-title {
  font-family: $font-铭文;
  font-size: 20px;
  font-weight: 700;
  color: $册缘鎏金;
  text-align: center;
  letter-spacing: 4px;
  margin: 0 0 12px;
  @include inscription-engrave;
}

.modal-desc {
  font-size: 13px;
  color: var(--hh-text-secondary);
  line-height: 1.6;
  margin: 0 0 10px;
  text-align: center;
}

.modal-effect {
  font-size: 12px;
  color: var(--hh-gold);
  font-style: italic;
  margin: 0 0 14px;
  text-align: center;

  .effect-label {
    color: var(--hh-gold-glow);
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
    color: var(--hh-gold);
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
  padding: 12px;
  border: none;
  border-radius: $radius-md;
  cursor: pointer;
  font-family: $font-铭文;
  font-size: 15px;
  color: var(--hh-text-primary);
  letter-spacing: 4px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, transparent 0%, var(--hh-accent-glow-strong) 30%, var(--hh-glow-color) 50%, var(--hh-accent-glow-strong) 70%, transparent 100%);
  background-size: 200% 100%;
  animation: flow-glow 4s ease-in-out infinite;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    box-shadow: 0 0 20px var(--hh-glow-color);
    color: var(--hh-text-highlight, var(--hh-accent));
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    animation: none;
    background: var(--hh-bg-card);
    color: var(--hh-text-muted);
  }

  &.shake {
    animation: shake 0.4s ease-in-out !important;
  }
}

/* 灵石余额联动 */
.balance-display {
  transition: all 0.4s ease;

  &.balance-sufficient .balance-glyph {
    animation: glow-breathe 3s ease-in-out infinite;
    filter: drop-shadow(0 0 8px var(--hh-glow-color));
  }

  &.balance-depleted {
    opacity: 0.3;

    .balance-glyph {
      filter: grayscale(0.8);
      opacity: 0.4;
    }

    .balance-value {
      color: var(--hh-text-muted);
    }
  }
}

/* 流光动画 */
@keyframes flow-glow {
  0%, 100% { background-position: 100% 50%; }
  50% { background-position: 0% 50%; }
}

/* 抖动动画 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}

/* 灵石呼吸光效 */
@keyframes glow-breathe {
  0%, 100% { filter: drop-shadow(0 0 6px var(--hh-glow-color)); opacity: 0.8; }
  50% { filter: drop-shadow(0 0 14px var(--hh-glow-color)); opacity: 1; }
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
