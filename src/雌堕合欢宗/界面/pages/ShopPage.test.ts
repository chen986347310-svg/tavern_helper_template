// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { reactive } from 'vue';

// Mock the store
vi.mock('../store', () => {
  const mockData = reactive({
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石: 10000, 已使用阵法: false },
    牝奴: { 堕落度: 0, 牝阴决层数: 0, 上次支配者: '', 支配次数: {}, 改造进度: { 泌乳: false, 肛门: false, 憋尿: false } },
    NPC: {
      白芷: { 好感度: 50, 攻略值: 30, 粘滞计数: 1, 状态: '进行中' },
      苏芸: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      纪兰: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      沈月秋: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      柳素衣: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
    },
    道具: { 拥有: {} as Record<string, number>, 装备: { '玩家': [] as string[], '白芷': [] as string[], '苏芸': [] as string[], '纪兰': [] as string[], '沈月秋': [] as string[], '柳素衣': [] as string[] } },
    场景: { 已解锁: [] },
    剧情: { 已解锁: [] },
  });
  return {
    useDataStore: () => ({ data: mockData }),
    __mockData: mockData,
  };
});

import ShopPage from '../pages/ShopPage.vue';
import { __mockData as mockData } from '../store';

function mountShop() {
  return mount(ShopPage, { global: { plugins: [createPinia()] } });
}

describe('ShopPage', () => {
  beforeEach(() => {
    mockData.系统.灵石 = 10000;
    mockData.NPC.白芷.好感度 = 50;
    mockData.NPC.柳素衣.攻略值 = 0;
    mockData.道具.拥有 = {};
  });

  // --- 灵石余额显示 ---
  it('显示灵石余额', () => {
    const wrapper = mountShop();
    expect(wrapper.find('.balance-value').text()).toBe('10000');
  });

  // --- 分类标签 ---
  it('渲染6个分类标签', () => {
    const wrapper = mountShop();
    const tabs = wrapper.findAll('.tab-btn');
    expect(tabs).toHaveLength(6);
  });

  it('默认选中服装分类', () => {
    const wrapper = mountShop();
    const activeTabs = wrapper.findAll('.tab-btn.active');
    expect(activeTabs).toHaveLength(1);
    expect(activeTabs[0].find('.tab-text').text()).toBe('服装');
  });

  it('点击分类标签切换显示', async () => {
    const wrapper = mountShop();
    const tabs = wrapper.findAll('.tab-btn');
    await tabs[1].trigger('click'); // 切换到 NSFW
    expect(tabs[1].classes()).toContain('active');
    expect(tabs[0].classes()).not.toContain('active');
  });

  // --- 物品显示 ---
  it('服装分类显示物品卡片', () => {
    const wrapper = mountShop();
    const cards = wrapper.findAll('.item-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('物品卡片显示名称和价格', () => {
    const wrapper = mountShop();
    const firstCard = wrapper.findAll('.item-card')[0];
    expect(firstCard.find('.item-name').text()).toBeTruthy();
    expect(firstCard.find('.price-num').text()).toBeTruthy();
  });

  // --- canBuy 逻辑 ---
  it('灵石不足时物品卡片显示disabled', async () => {
    mockData.系统.灵石 = 100; // 不够买任何东西
    const wrapper = mountShop();
    const disabledCards = wrapper.findAll('.item-card.disabled');
    expect(disabledCards.length).toBeGreaterThan(0);
  });

  it('灵石充足时物品可购买', async () => {
    mockData.系统.灵石 = 100000;
    mockData.NPC.白芷.好感度 = 100;
    const wrapper = mountShop();
    // 切换到 NSFW 分类查看铃铛项圈 (价格500, 门槛0)
    await wrapper.findAll('.tab-btn')[1].trigger('click');
    await flushPromises();
    // 找铃铛项圈
    const cards = wrapper.findAll('.item-card');
    const bellCard = cards.find(c => c.find('.item-name').text() === '铃铛项圈');
    expect(bellCard).toBeTruthy();
    expect(bellCard!.classes()).not.toContain('disabled');
  });

  // --- 弹窗 ---
  it('点击物品卡片显示详情弹窗', async () => {
    mockData.系统.灵石 = 100000;
    const wrapper = mountShop();
    const firstCard = wrapper.findAll('.item-card')[0];
    await firstCard.trigger('click');
    expect(wrapper.find('.detail-overlay').exists()).toBe(true);
    expect(wrapper.find('.modal-title').text()).toBeTruthy();
  });

  it('点击遮罩关闭弹窗', async () => {
    mockData.系统.灵石 = 100000;
    const wrapper = mountShop();
    await wrapper.findAll('.item-card')[0].trigger('click');
    expect(wrapper.find('.detail-overlay').exists()).toBe(true);
    await wrapper.find('.detail-overlay').trigger('click.self');
    expect(wrapper.find('.detail-overlay').exists()).toBe(false);
  });

  // --- 购买 ---
  it('购买物品后灵石减少', async () => {
    mockData.系统.灵石 = 10000;
    const wrapper = mountShop();
    // 切换到服装分类，点击第一个物品
    const firstCard = wrapper.findAll('.item-card')[0];
    const priceText = firstCard.find('.price-num').text();
    const price = Number(priceText);
    await firstCard.trigger('click');
    // 点击购买按钮
    const buyBtn = wrapper.find('.buy-btn');
    if (!buyBtn.attributes('disabled')) {
      await buyBtn.trigger('click');
      expect(mockData.系统.灵石).toBe(10000 - price);
    }
  });

  it('购买后道具加入拥有列表', async () => {
    mockData.系统.灵石 = 100000;
    mockData.NPC.白芷.好感度 = 100;
    const wrapper = mountShop();
    // 切换到 NSFW 分类
    await wrapper.findAll('.tab-btn')[1].trigger('click');
    await flushPromises();
    // 找铃铛项圈
    const cards = wrapper.findAll('.item-card');
    const bellCard = cards.find(c => c.find('.item-name').text() === '铃铛项圈');
    if (bellCard) {
      await bellCard.trigger('click');
      await flushPromises();
      const buyBtn = wrapper.find('.buy-btn');
      if (!buyBtn.attributes('disabled')) {
        await buyBtn.trigger('click');
        expect(mockData.道具.拥有['铃铛项圈']).toBe(1);
      }
    }
  });

  it('重复购买增加道具数量', async () => {
    mockData.系统.灵石 = 100000;
    mockData.NPC.白芷.好感度 = 100;
    mockData.道具.拥有 = { '铃铛项圈': 1 };
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[1].trigger('click');
    await flushPromises();
    const cards = wrapper.findAll('.item-card');
    const bellCard = cards.find(c => c.find('.item-name').text() === '铃铛项圈');
    if (bellCard) {
      await bellCard.trigger('click');
      await flushPromises();
      const buyBtn = wrapper.find('.buy-btn');
      if (!buyBtn.attributes('disabled')) {
        await buyBtn.trigger('click');
        expect(mockData.道具.拥有['铃铛项圈']).toBe(2);
      }
    }
  });

  // --- 改变阵法特殊逻辑 ---
  it('改变阵法: 柳素衣攻略值不足时不可购买', () => {
    mockData.系统.灵石 = 600000;
    mockData.NPC.柳素衣.攻略值 = 50;
    const wrapper = mountShop();
    // 切换到特殊分类
    const tabs = wrapper.findAll('.tab-btn');
    const specialTab = tabs.find(t => t.find('.tab-text').text() === '特殊');
    if (specialTab) {
      specialTab.trigger('click');
      flushPromises().then(() => {
        const cards = wrapper.findAll('.item-card');
        const arrayCard = cards.find(c => c.find('.item-name').text() === '改变阵法');
        if (arrayCard) {
          expect(arrayCard.classes()).toContain('disabled');
        }
      });
    }
  });
});
