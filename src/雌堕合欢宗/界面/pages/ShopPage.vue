<template>
  <div class="shop-page" :data-phase="store.data.系统.阶段">
    <template v-if="isPhase2">
      <section class="p2-dispatch-ledger" aria-label="执事库">
        <div class="p2-ledger-title">
          <span class="p2-ledger-seal">朱</span>
          <div>
            <span class="p2-ledger-kicker">宗门执事库</span>
            <strong>日课发付</strong>
          </div>
        </div>
        <div class="p2-ledger-line">
          <span>今日朱批</span>
          <strong>{{ p2RoutineState.routine }}</strong>
        </div>
        <div class="p2-ledger-line" :data-missing="p2RoutineState.isMissing">
          <span>{{ p2RoutineState.hasRequirement ? '须扣法器' : '候命状态' }}</span>
          <strong>{{ p2RoutineState.requiredLabel || '暂无指定法器' }}</strong>
        </div>
        <p class="p2-ledger-note">
          {{ p2RoutineState.isMissing ? `${p2RoutineState.shame}，${p2RoutineState.punishment}` : p2RoutineState.bodyNote }}
        </p>
      </section>

      <div class="category-tabs p2-tabs">
        <button
          v-for="cat in p2Categories"
          :key="cat.key"
          :class="['tab-btn', { active: p2ActiveCategory === cat.key }]"
          @click="p2ActiveCategory = cat.key"
        >
          <span class="tab-glyph">{{ cat.glyph }}</span>
          <span class="tab-text">{{ cat.label }}</span>
        </button>
      </div>

      <div v-if="p2ActiveCategory !== 'record'" class="item-grid p2-dispatch-grid">
        <div
          v-for="item in p2CurrentItems"
          :key="getItemName(item)"
          :class="['item-card', 'p2-dispatch-card', { disabled: !canReceiveP2Item(item), named: p2RoutineState.requiredItems.includes(getItemName(item)) }]"
          @click="showDetail(item)"
        >
          <div class="card-top">
            <div class="item-name">{{ getItemTitle(item) }}</div>
            <div class="item-threshold">{{ getP2ArtifactFocus(getItemName(item)) }}</div>
          </div>
          <div class="card-bottom">
            <div class="p2-grant-state">{{ getP2GrantState(item) }}</div>
          </div>
        </div>
        <div v-if="p2CurrentItems.length === 0" class="p2-dispatch-empty">今日朱批未点名新器。</div>
      </div>

      <section v-else class="p2-record-panel">
        <div v-if="p2EquippedItems.length === 0" class="p2-dispatch-empty">承命册尚空，身上没有新落锁的法器。</div>
        <div v-for="item in p2EquippedItems" :key="item" class="p2-record-row">
          <span class="p2-record-name">{{ getItemDisplayName(item) }}</span>
          <span class="p2-record-text">{{ getP2ArtifactBodyNote(item) }}</span>
        </div>
      </section>

      <Transition name="modal">
        <div v-if="selectedItem" class="detail-overlay" @click.self="selectedItem = null">
          <div class="detail-modal">
            <div class="modal-header">
              <div class="header-line"></div>
              <span class="header-glyph">授</span>
              <div class="header-line"></div>
            </div>
            <h3 class="modal-title">{{ getItemTitle(selectedItem) }}</h3>
            <div class="modal-meta">
              <span>{{ getP2ArtifactFocus(getItemName(selectedItem)) }}</span>
              <span>{{ getP2GrantState(selectedItem) }}</span>
            </div>
            <p v-if="getItemShortHint(getItemName(selectedItem))" class="modal-hint">{{ getItemShortHint(getItemName(selectedItem)) }}</p>
            <p class="modal-effect">
              <span class="effect-label">身识：</span>{{ getP2ArtifactBodyNote(getItemName(selectedItem)) }}
            </p>
            <button :class="['buy-btn', { shake: shakeBtn }]" :disabled="!canReceiveP2Item(selectedItem)" @click="handleP2ReceiveClick(selectedItem)">
              {{ getP2ReceiveButtonText(selectedItem) }}
            </button>
          </div>
        </div>
      </Transition>
    </template>
    <template v-else>
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

    <!-- 服装楼层 -->
    <div v-if="isFloorGroupedCategory" class="floor-list">
      <section v-for="group in groupedCurrentItems" :key="group.floor" class="floor-section" :data-floor="group.floor">
        <div class="floor-header">
          <div class="floor-line"></div>
          <span class="floor-title">{{ group.floor }}</span>
          <div class="floor-line"></div>
        </div>
        <div class="item-grid">
          <div
            v-for="item in group.items"
            :key="item.名称"
            :class="['item-card', { disabled: !canBuy(item) }]"
            @click="showDetail(item)"
          >
            <div class="card-top">
              <div class="item-name">{{ getItemTitle(item) }}</div>
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
      </section>
    </div>

    <!-- 物品格子 -->
    <div v-else class="item-grid">
      <div
        v-for="item in currentItems"
        :key="'名称' in item ? item.名称 : item.NPC"
        :class="['item-card', { disabled: !canBuy(item) }]"
        @click="showDetail(item)"
      >
        <div class="card-top">
          <div class="item-name">{{ getItemTitle(item) }}</div>
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

          <h3 class="modal-title">{{ getItemTitle(selectedItem) }}</h3>
          <div v-if="getItemMetaPrimary(getItemName(selectedItem))" class="modal-meta">
            <span>{{ getItemMetaPrimary(getItemName(selectedItem)) }}</span>
            <span v-if="'适用对象' in selectedItem">{{ selectedItem.专属NPC ? `${selectedItem.专属NPC}命契专属` : selectedItem.适用对象 }}</span>
            <span v-else-if="getContrabandBodyPart(getItemName(selectedItem))">{{ getContrabandBodyPart(getItemName(selectedItem)) }}</span>
            <span v-else-if="getPillEffectLine(getItemName(selectedItem))">{{ getPillEffectLine(getItemName(selectedItem)) }}</span>
          </div>
          <p v-if="getItemShortHint(getItemName(selectedItem))" class="modal-hint">{{ getItemShortHint(getItemName(selectedItem)) }}</p>
          <p v-if="'描述' in selectedItem" class="modal-desc">{{ selectedItem.描述 }}</p>
          <div v-if="'剧情线' in selectedItem" class="modal-story">
            <p class="modal-desc">{{ selectedItem.NPC }} · {{ selectedItem.秘密主题 }}</p>
            <p class="modal-desc">{{ selectedItem.解锁提示 }}</p>
          </div>
          <p v-if="'效果' in selectedItem" class="modal-effect">
            <span class="effect-label">法效：</span>{{ '效果' in selectedItem ? selectedItem.效果 : '' }}
          </p>
          <p v-if="isPhase2" class="modal-hint">{{ getP2ArtifactBodyNote(getItemName(selectedItem)) }}</p>

          <div v-if="!isPhase2" class="modal-price">
            <span class="price-glyph">◆</span>
            <span class="price-num">{{ selectedItem.价格 }}</span>
          </div>

          <button :class="['buy-btn', { shake: shakeBtn }]" :disabled="isPhase2 ? !canReceiveP2Item(selectedItem) : !canBuy(selectedItem)" @click="isPhase2 ? handleP2ReceiveClick(selectedItem) : handleBuyClick(selectedItem)">
            {{ isPhase2 ? getP2ReceiveButtonText(selectedItem) : getBuyButtonText(selectedItem) }}
          </button>
        </div>
      </div>
    </Transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from '../store';
import { NSFW道具, 永久丹药, 特殊道具, 禁器器阶, 丹药分类 } from '../data/items';
import { 牝奴道具 } from '../data/items';
import { 服装列表 } from '../data/outfits';
import { 牝奴服装列表 } from '../data/outfits';
import {
  getContrabandBodyPart,
  getContrabandTier,
  getExclusiveOutfitNpc,
  getItemDisplayName,
  getItemShortHint,
  getOutfitFloor,
  getP2ArtifactBodyNote,
  getP2ArtifactFocus,
  getPillCategory,
  getPillEffectLine,
  isExclusiveOutfitUnlocked,
  isP2ArtifactItem,
} from '../data/itemDisplay';
import { 特殊场景, 特殊剧情 } from '../data/scenes';
import { checkItemThreshold } from '../guards';
import { usePendingAction } from '../composables/usePendingAction';
import { getItemLifecycle } from '../data/itemLifecycle';
import { createNarrativeEntryForPurchase, hasPendingPurchase, insertEntryRumor } from '../data/narrativeEntry';
import { getPhase2RoutineState } from '../data/phase2Routine';

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
const { 记录购买物品, 记录领受法器 } = usePendingAction();
const isPhase2 = computed(() => store.data.系统.阶段 === '牝奴期');
const p2ActiveCategory = ref<'routine' | 'dispatch' | 'record'>('routine');

function getItemName(item: ShopItem): string {
  return '名称' in item && item.名称 ? item.名称 : 'NPC' in item ? item.NPC : '';
}

function getItemTitle(item: ShopItem): string {
  return getItemDisplayName(getItemName(item));
}

const p2ArtifactCatalog = computed(() => [...NSFW道具, ...牝奴道具, ...牝奴服装列表].filter(item => isP2ArtifactItem(item.名称)));
const p2EquippedItems = computed(() => (store.data.道具.装备.玩家 ?? []).filter(isP2ArtifactItem));
const p2RoutineState = computed(() => getPhase2RoutineState(store.data.牝奴?.当前日课 ?? '', p2EquippedItems.value));
const p2RoutineItems = computed(() =>
  p2RoutineState.value.requiredItems
    .map(name => p2ArtifactCatalog.value.find(item => item.名称 === name))
    .filter((item): item is (typeof p2ArtifactCatalog.value)[number] => Boolean(item)),
);
const p2DispatchItems = computed(() => p2ArtifactCatalog.value);
const p2CurrentItems = computed(() => {
  if (p2ActiveCategory.value === 'routine') return p2RoutineItems.value;
  if (p2ActiveCategory.value === 'dispatch') return p2DispatchItems.value;
  return [];
});
const p2Categories = [
  { key: 'routine', glyph: '课', label: '日课' },
  { key: 'dispatch', glyph: '发', label: '发付' },
  { key: 'record', glyph: '录', label: '承命' },
] as const;

function getP2GrantState(item: ShopItem): string {
  const name = getItemName(item);
  if ((store.data.道具.装备.玩家 ?? []).includes(name)) return '已落锁';
  if ((store.data.道具.拥有[name] ?? 0) > 0) return '已领受';
  if (p2RoutineState.value.requiredItems.includes(name)) return '朱批点名';
  return '待授';
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
      return 服装列表.filter(item => item.楼层 !== '牝奴层' && isExclusiveOutfitUnlocked(item.名称, store.data.NPC));
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

const 楼层顺序 = ['凡衣层', '微露层', '诱形层', '缚心层', '命契层', '牝奴层'] as const;
const 禁器器阶顺序 = 禁器器阶;
const 丹药分类顺序 = 丹药分类;

const isFloorGroupedCategory = computed(() => activeCategory.value === 'clothing' || activeCategory.value === 'nsfw' || activeCategory.value === 'pill');

function getItemMetaPrimary(name: string): string {
  return getOutfitFloor(name) || getContrabandTier(name) || getPillCategory(name);
}

const groupedCurrentItems = computed(() => {
  if (activeCategory.value === 'pill') {
    return 丹药分类顺序
      .map(floor => ({
        floor,
        items: currentItems.value.filter(item => '分类' in item && item.分类 === floor),
      }))
      .filter(group => group.items.length > 0);
  }

  if (activeCategory.value === 'nsfw') {
    return 禁器器阶顺序
      .map(floor => ({
        floor,
        items: currentItems.value.filter(item => '器阶' in item && item.器阶 === floor),
      }))
      .filter(group => group.items.length > 0);
  }

  return 楼层顺序
    .map(floor => ({
      floor,
      items: currentItems.value.filter(item => '楼层' in item && item.楼层 === floor),
    }))
    .filter(group => group.items.length > 0);
});

function canBuy(item: ShopItem): boolean {
  // 嘴中膏涩
  if (store.data.系统.灵石 < item.价格) return false;

  const name = getItemName(item);
  const lifecycle = getItemLifecycle(name);

  if (hasPendingPurchase(store.data.系统.待处理交互 ?? [], name)) return false;

  if (lifecycle === '解锁剧情') {
    const clue = (store.data.剧情 as any).线索状态?.[name];
    return !store.data.剧情.已解锁.includes(name) && (!clue || clue.状态 === '已失效');
  }

  if (lifecycle === '解锁场景') {
    const clue = (store.data.剧情 as any).线索状态?.[name];
    return !store.data.场景.已解锁.includes(name) && (!clue || clue.状态 === '已失效');
  }

  if (lifecycle === '购买即生效') {
    if (name === '改变阵法' && store.data.系统.已使用阵法) return false;
    const clue = (store.data.剧情 as any).线索状态?.[name];
    if (clue && clue.状态 !== '已失效') return false;
  }

  if (!isExclusiveOutfitUnlocked(name, store.data.NPC)) return false;

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

function canReceiveP2Item(item: ShopItem | null): boolean {
  if (!item) return false;
  const name = getItemName(item);
  if (!isP2ArtifactItem(name)) return false;
  if ((store.data.道具.装备.玩家 ?? []).includes(name)) return false;
  return (store.data.道具.拥有[name] ?? 0) <= 0;
}

function getP2ReceiveButtonText(item: ShopItem | null): string {
  if (!item) return '候令';
  const name = getItemName(item);
  if ((store.data.道具.装备.玩家 ?? []).includes(name)) return '已落锁';
  if ((store.data.道具.拥有[name] ?? 0) > 0) return '已领受';
  return '领受法器';
}

function getBuyButtonText(item: ShopItem): string {
  if (store.data.系统.灵石 < item.价格) return '囊中羞涩';
  const name = getItemName(item);
  const lifecycle = getItemLifecycle(name);
  if (lifecycle === '解锁剧情' && (store.data.剧情.已解锁.includes(name) || (store.data.剧情 as any).线索状态?.[name])) return '因果已入簿';
  if (lifecycle === '解锁场景' && (store.data.场景.已解锁.includes(name) || (store.data.剧情 as any).线索状态?.[name])) return '场景已开';
  if (hasPendingPurchase(store.data.系统.待处理交互 ?? [], name)) return '线索待显';
  if (lifecycle === '购买即生效' && name === '改变阵法' && store.data.系统.已使用阵法) return '事件已触发';
  const exclusiveNpc = getExclusiveOutfitNpc(name);
  if (exclusiveNpc && !isExclusiveOutfitUnlocked(name, store.data.NPC)) return '命契未成';
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

function handleP2ReceiveClick(item: ShopItem | null) {
  if (!item || !canReceiveP2Item(item)) {
    shakeBtn.value = true;
    setTimeout(() => { shakeBtn.value = false; }, 400);
    return;
  }
  const name = getItemName(item);
  store.data.道具.拥有[name] = (store.data.道具.拥有[name] ?? 0) + 1;
  记录领受法器(name);
  selectedItem.value = null;
}

function addUnique(list: string[], name: string) {
  if (!list.includes(name)) list.push(name);
}

function applyNarrativeEntry(name: string) {
  const entry = createNarrativeEntryForPurchase(name);
  if (!entry) return;
  const storyState = store.data.剧情 as any;
  storyState.线索状态 ??= {};
  storyState.线索状态[entry.key] = entry.status;
  store.data.系统.风声列表 = insertEntryRumor(store.data.系统.风声列表 ?? [], entry.rumor) as typeof store.data.系统.风声列表;
}

function applyPurchaseResult(name: string) {
  const lifecycle = getItemLifecycle(name);

  if (lifecycle === '解锁场景') {
    addUnique(store.data.场景.已解锁, name);
    applyNarrativeEntry(name);
    return;
  }
  if (lifecycle === '解锁剧情') {
    addUnique(store.data.剧情.已解锁, name);
    applyNarrativeEntry(name);
    return;
  }
  if (lifecycle === '购买即生效') {
    if (name === '改变阵法') {
      store.data.系统.已使用阵法 = true;
    }
    const storyState = store.data.剧情 as any;
    storyState.线索状态 ??= {};
    if (['改变阵法', '欲海回声', '投欲钥'].includes(name)) {
      storyState.线索状态[name] = {
        类型: '特殊事件',
        状态: '已触发',
        风声ID: '',
        关联名称: name,
        推荐场景: [],
        触发次数: 1,
        最近场景: store.data.系统.当前场景 ?? '',
      };
    }
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

.p2-dispatch-ledger {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 14px;
  padding: 13px 14px;
  background:
    radial-gradient(ellipse at 86% 18%, color-mix(in srgb, var(--p2-blood) 14%, transparent), transparent 58%),
    linear-gradient(90deg, rgba(var(--p2-skin-rgb), 0.86), rgba(var(--p2-skin-rgb), 0.97));
  color: var(--p2-incense);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--p2-gold) 12%, transparent);
}

.p2-ledger-title {
  display: flex;
  align-items: center;
  gap: 10px;

  strong {
    display: block;
    color: var(--p2-incense);
    font-family: $font-铭文;
    font-size: 17px;
    letter-spacing: 3px;
  }
}

.p2-ledger-seal {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  color: var(--p2-blood);
  border: 1px solid color-mix(in srgb, var(--p2-blood) 46%, transparent);
  font-family: $font-铭文;
  transform: rotate(-8deg);
}

.p2-ledger-kicker,
.p2-ledger-line span {
  color: var(--p2-gold);
  font-size: 11px;
  letter-spacing: 3px;
}

.p2-ledger-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;

  strong {
    color: var(--p2-incense);
    font-weight: 500;
    text-align: right;
  }

  &[data-missing='true'] strong {
    color: var(--p2-blood);
  }
}

.p2-ledger-note,
.p2-dispatch-empty {
  margin: 0;
  color: color-mix(in srgb, var(--p2-incense) 72%, transparent);
  font-size: 12px;
  line-height: 1.65;
}

.p2-tabs {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;

  .tab-btn {
    min-height: 34px;
    border: none;
    border-radius: 0;
    background:
      linear-gradient(90deg, transparent, rgba(var(--p2-skin-rgb), 0.72), transparent),
      radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--p2-blood) 8%, transparent), transparent 72%);
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--p2-gold) 14%, transparent),
      inset 0 -8px 14px color-mix(in srgb, var(--p2-incense) 4%, transparent);

    .tab-glyph {
      color: color-mix(in srgb, var(--p2-blood) 78%, var(--p2-incense));
      text-shadow: 0 0 8px color-mix(in srgb, var(--p2-blood) 18%, transparent);
    }

    .tab-text {
      color: color-mix(in srgb, var(--p2-incense) 82%, #1e1512);
    }

    &.active {
      background:
        linear-gradient(90deg, transparent, rgba(var(--p2-skin-rgb), 0.82), transparent),
        radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--p2-blood) 18%, transparent), transparent 70%),
        color-mix(in srgb, var(--p2-mist) 46%, transparent);
      box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--p2-blood) 24%, transparent),
        inset 0 -10px 18px color-mix(in srgb, var(--p2-blood) 8%, transparent),
        0 0 12px color-mix(in srgb, var(--p2-blood) 10%, transparent);

      .tab-glyph,
      .tab-text {
        color: var(--p2-blood);
      }
    }

    &:hover:not(.active) {
      border-color: transparent;
      background:
        linear-gradient(90deg, transparent, rgba(var(--p2-skin-rgb), 0.78), transparent),
        radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--p2-gold) 15%, transparent), transparent 70%);

      .tab-glyph,
      .tab-text {
        color: var(--p2-gold);
      }
    }
  }
}

.p2-dispatch-grid {
  margin-top: 2px;
}

.p2-dispatch-card {
  background:
    linear-gradient(180deg, rgba(var(--p2-skin-rgb), 0.86), rgba(var(--p2-skin-rgb), 0.98)),
    radial-gradient(ellipse at 80% 12%, color-mix(in srgb, var(--p2-blood) 12%, transparent), transparent 56%);
  box-shadow: inset 0 -10px 18px rgba(90, 66, 58, 0.04);

  &.named {
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--p2-blood) 28%, transparent),
      inset 0 -10px 18px rgba(90, 66, 58, 0.04);
  }
}

.p2-grant-state {
  color: var(--p2-blood);
  font-family: $font-铭文;
  font-size: 12px;
  letter-spacing: 3px;
}

.p2-record-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.p2-record-row {
  display: grid;
  grid-template-columns: minmax(86px, 0.34fr) 1fr;
  gap: 9px;
  padding: 10px 12px;
  background: rgba(var(--p2-skin-rgb), 0.9);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--p2-gold) 12%, transparent);
}

.p2-record-name {
  color: var(--p2-blood);
  font-family: $font-铭文;
  letter-spacing: 2px;
}

.p2-record-text {
  color: color-mix(in srgb, var(--p2-incense) 76%, transparent);
  font-size: 12px;
  line-height: 1.55;
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

/* 服装楼层 — 金册分卷 */
.floor-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.floor-section {
  min-width: 0;
}

.floor-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 2px 0 8px;
}

.floor-line {
  flex: 1;
  min-width: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--hh-border-accent), transparent);
}

.floor-title {
  flex-shrink: 0;
  font-family: $font-铭文;
  font-size: 12px;
  color: var(--hh-gold);
  letter-spacing: 3px;
  text-shadow: 0 0 8px var(--hh-gold-glow);
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
      letter-spacing: 2px;
      line-height: 1.45;
      margin-bottom: 4px;
      overflow-wrap: anywhere;
      word-break: keep-all;
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

.modal-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: var(--hh-gold);
  font-family: $font-铭文;
  font-size: 11px;
  letter-spacing: 2px;
  margin: -4px 0 10px;
  text-shadow: 0 0 8px var(--hh-gold-glow);

  span {
    padding: 2px 6px;
    background: var(--hh-gold-glow);
    border-radius: $radius-sm;
  }
}

.modal-hint {
  font-size: 13px;
  color: var(--hh-text-secondary);
  line-height: 1.7;
  margin: 0 0 12px;
  text-align: center;
  text-shadow: 0 0 8px var(--hh-glow-color);
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
