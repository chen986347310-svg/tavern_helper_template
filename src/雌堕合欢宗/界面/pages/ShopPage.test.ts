// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { reactive } from 'vue';
import { readFileSync } from 'node:fs';

const ShopPageSource = readFileSync('src/雌堕合欢宗/界面/pages/ShopPage.vue', 'utf-8');

// Mock the store
const mockData = reactive({
    系统: {
      阶段: '攻略期',
      剩余天数: 30,
      灵石: 10000,
      已使用阵法: false,
      时辰: '午时',
      当前场景: '醉玉小筑',
      待处理交互: [] as any[],
      风声列表: [] as any[],
      场景上下文: { 在场NPC: [] as string[] },
    },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      上次支配者: '',
      支配次数: {},
      当前日课: '',
      改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
    },
    NPC: {
      白芷: { 好感度: 50, 攻略值: 30, 粘滞计数: 1, 状态: '进行中' },
      苏芸: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      纪兰: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      沈月秋: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      柳素衣: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
    },
    道具: {
      拥有: {} as Record<string, number>,
      装备: {
        玩家: [] as string[],
        白芷: [] as string[],
        苏芸: [] as string[],
        纪兰: [] as string[],
        沈月秋: [] as string[],
        柳素衣: [] as string[],
      },
    },
    场景: { 已解锁: [] },
    剧情: { 已解锁: [], 线索状态: {} as Record<string, any> },
  })

vi.mock('../store', () => ({
  useDataStore: () => ({ data: mockData }),
}));


import ShopPage from '../pages/ShopPage.vue';

function mountShop() {
  return mount(ShopPage, { global: { plugins: [createPinia()] } });
}

describe('ShopPage', () => {
  beforeEach(() => {
    mockData.系统.阶段 = '攻略期';
    mockData.系统.灵石 = 10000;
    mockData.NPC.白芷.好感度 = 50;
    mockData.NPC.白芷.攻略值 = 30;
    mockData.NPC.白芷.状态 = '进行中';
    mockData.NPC.柳素衣.攻略值 = 0;
    mockData.道具.拥有 = {};
    mockData.场景.已解锁 = [];
    mockData.剧情.已解锁 = [];
    mockData.剧情.线索状态 = {};
    mockData.系统.风声列表 = [];
    mockData.系统.已使用阵法 = false;
    mockData.系统.待处理交互 = [];
    mockData.牝奴.当前日课 = '';
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

  it('服装商城显示 v3 显示名但购买仍写入逻辑名', async () => {
    mockData.系统.灵石 = 100000;
    mockData.NPC.白芷.好感度 = 100;
    const wrapper = mountShop();
    const card = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '湿雾贴身裙');
    expect(card).toBeTruthy();

    await card!.trigger('click');
    expect(wrapper.find('.modal-title').text()).toBe('湿雾贴身裙');
    expect(wrapper.find('.modal-hint').text()).toContain('雾绡遇热贴身');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.道具.拥有['透视罗裙']).toBe(1);
    expect(mockData.道具.拥有['湿雾贴身裙']).toBeUndefined();
  });

  it('攻略期服装分类不显示牝奴服', () => {
    mockData.系统.阶段 = '攻略期';
    const wrapper = mountShop();
    expect(wrapper.text()).not.toContain('牝印初染衣');
  });

  it('牝奴期发付页显示牝奴服显示名', async () => {
    mockData.系统.阶段 = '牝奴期';
    const wrapper = mountShop();
    const dispatchTab = wrapper.findAll('.tab-btn').find(t => t.find('.tab-text').text() === '发付');
    expect(dispatchTab).toBeTruthy();

    await dispatchTab!.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('牝印初染衣');
  });

  it('命契专属服未完成时不显示，完成后在命契层显示', async () => {
    mockData.系统.灵石 = 100000;
    mockData.NPC.白芷.状态 = '进行中';
    mockData.NPC.白芷.攻略值 = 99;
    const wrapper = mountShop();
    expect(wrapper.text()).not.toContain('晨露缚心仙奴衣');

    mockData.NPC.白芷.状态 = '已完成';
    await flushPromises();

    expect(wrapper.text()).toContain('晨露缚心仙奴衣');
  });

  it('服装分类按楼层分组显示', () => {
    mockData.系统.灵石 = 100000;
    mockData.NPC.白芷.状态 = '已完成';
    mockData.NPC.白芷.攻略值 = 100;
    const wrapper = mountShop();

    const floorTitles = wrapper.findAll('.floor-title').map(title => title.text());
    expect(floorTitles).toEqual(['凡衣层', '微露层', '诱形层', '缚心层', '命契层']);
    expect(wrapper.find('[data-floor="凡衣层"]').text()).toContain('素麻外门衣');
    expect(wrapper.find('[data-floor="命契层"]').text()).toContain('晨露缚心仙奴衣');
  });

  it('禁器分类按器阶分组显示含蓄名但购买仍写逻辑名', async () => {
    mockData.系统.灵石 = 100000;
    mockData.NPC.白芷.好感度 = 100;
    const wrapper = mountShop();

    await wrapper.findAll('.tab-btn')[1].trigger('click');
    await flushPromises();

    const floorTitles = wrapper.findAll('.floor-title').map(title => title.text());
    expect(floorTitles).toEqual(['启羞器阶', '缚身器阶', '化器器阶', '命契器阶']);
    expect(wrapper.find('[data-floor="启羞器阶"]').text()).toContain('听铃颈环');
    expect(wrapper.find('[data-floor="化器器阶"]').text()).toContain('命门欲环');

    const collarCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '听铃颈环');
    expect(collarCard).toBeTruthy();
    await collarCard!.trigger('click');
    expect(wrapper.find('.modal-title').text()).toBe('听铃颈环');
    expect(wrapper.find('.modal-meta').text()).toContain('启羞器阶');
    expect(wrapper.find('.modal-meta').text()).toContain('颈项');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.道具.拥有['铃铛项圈']).toBe(1);
    expect(mockData.道具.拥有['听铃颈环']).toBeUndefined();
  });

  it('丹药分类按临时、永久、仙奴分组显示显示名但购买仍写逻辑名', async () => {
    mockData.系统.灵石 = 100000;
    mockData.NPC.白芷.好感度 = 100;
    mockData.NPC.白芷.状态 = '已完成';
    const wrapper = mountShop();

    await wrapper.findAll('.tab-btn')[2].trigger('click');
    await flushPromises();

    const floorTitles = wrapper.findAll('.floor-title').map(title => title.text());
    expect(floorTitles).toEqual(['临时丹药', '永久丹药', '仙奴丹']);
    expect(wrapper.find('[data-floor="永久丹药"]').text()).toContain('引香丹');
    expect(wrapper.find('[data-floor="仙奴丹"]').text()).toContain('玉户丹');

    const pillCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '引香丹');
    expect(pillCard).toBeTruthy();
    await pillCard!.trigger('click');
    expect(wrapper.find('.modal-title').text()).toBe('引香丹');
    expect(wrapper.find('.modal-meta').text()).toContain('永久丹药');
    expect(wrapper.find('.modal-meta').text()).toContain('体态/社交');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.道具.拥有['体香丹']).toBe(1);
    expect(mockData.道具.拥有['引香丹']).toBeUndefined();
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
    // 切换到禁器分类查看铃铛项圈 (价格500, 门槛0)
    await wrapper.findAll('.tab-btn')[1].trigger('click');
    await flushPromises();
    // 找铃铛项圈显示名
    const cards = wrapper.findAll('.item-card');
    const bellCard = cards.find(c => c.find('.item-name').text() === '听铃颈环');
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

  it('服装详情楼层与AI短提示使用弹窗主题色，不能落回默认黑字', () => {
    expect(ShopPageSource).toMatch(/\.modal-meta\s*\{[\s\S]*?color:\s*var\(--hh-gold\)/);
    expect(ShopPageSource).toMatch(/\.modal-hint\s*\{[\s\S]*?color:\s*var\(--hh-text-secondary\)/);
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
    // 找铃铛项圈显示名
    const cards = wrapper.findAll('.item-card');
    const bellCard = cards.find(c => c.find('.item-name').text() === '听铃颈环');
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

  it('购买成功后写入下一楼层待处理交互', async () => {
    mockData.系统.灵石 = 100000;
    mockData.NPC.白芷.好感度 = 100;
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[1].trigger('click');
    await flushPromises();

    const bellCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '听铃颈环');
    expect(bellCard).toBeTruthy();
    await bellCard!.trigger('click');
    await flushPromises();
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.系统.待处理交互).toHaveLength(1);
    expect(mockData.系统.待处理交互[0]).toMatchObject({
      类型: '购买物品',
      目标: '玩家',
      道具: '铃铛项圈',
      道具显示名: '听铃颈环',
      器阶: '启羞器阶',
      作用部位: '颈项',
      数量: 1,
      时辰: '午时',
      场景: '醉玉小筑',
    });
    expect(mockData.系统.待处理交互[0].AI短提示).toContain('铃声');
  });

  it('灵石不足时不写入待处理交互', async () => {
    mockData.系统.灵石 = 100;
    const wrapper = mountShop();
    const firstCard = wrapper.findAll('.item-card')[0];
    await firstCard.trigger('click');
    await flushPromises();

    expect(wrapper.find('.buy-btn').attributes('disabled')).toBeDefined();
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.系统.待处理交互).toEqual([]);
  });

  it('重复购买增加道具数量', async () => {
    mockData.系统.灵石 = 100000;
    mockData.NPC.白芷.好感度 = 100;
    mockData.道具.拥有 = { 铃铛项圈: 1 };
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[1].trigger('click');
    await flushPromises();
    const cards = wrapper.findAll('.item-card');
    const bellCard = cards.find(c => c.find('.item-name').text() === '听铃颈环');
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
  it('场景商城显示通行令名，购买后解锁真实地点且不进入背包', async () => {
    mockData.系统.灵石 = 100000;
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[3].trigger('click');
    await flushPromises();

    expect(wrapper.findAll('.item-card')).toHaveLength(8);
    const sceneCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '合契浴令');
    expect(sceneCard).toBeTruthy();
    await sceneCard!.trigger('click');
    expect(wrapper.find('.modal-title').text()).toBe('合契浴令');
    expect(wrapper.find('.modal-hint').text()).toContain('水汽');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.场景.已解锁).toContain('阴阳池');
    expect(mockData.场景.已解锁).not.toContain('合契浴令');
    expect(mockData.道具.拥有['阴阳池']).toBeUndefined();
    expect(mockData.剧情.线索状态['阴阳池']).toMatchObject({
      类型: '场景令牌',
      状态: '可追查',
      风声ID: 'scene_yinyang_pool_1',
    });
    expect(mockData.系统.风声列表[0]).toMatchObject({
      id: 'scene_yinyang_pool_1',
      来源: '场景令牌',
      地点: '阴阳池',
      状态: '未读',
    });
  });

  it('牝奴期执事库不显示灵石价格和商城分类', () => {
    mockData.系统.阶段 = '牝奴期';
    mockData.牝奴.当前日课 = '廊前听令';
    const wrapper = mountShop();

    expect(wrapper.text()).toContain('宗门执事库');
    expect(wrapper.text()).toContain('日课发付');
    expect(wrapper.text()).toContain('须扣法器');
    expect(wrapper.text()).toContain('牝铃');
    expect(wrapper.find('.balance-value').exists()).toBe(false);
    expect(wrapper.findAll('.price-num')).toHaveLength(0);
    expect(wrapper.text()).not.toContain('灵石');
    expect(wrapper.text()).not.toContain('购买');
    expect(wrapper.findAll('.tab-btn').map(tab => tab.text())).toEqual(['课日课', '发发付', '录承命']);
  });

  it('牝奴期执事库页签使用 P2 脂白桃花背景，不继承 P1 金箔按钮底色', () => {
    expect(ShopPageSource).toMatch(/\.p2-tabs\s*\{[\s\S]*?\.tab-btn\s*\{[\s\S]*?var\(--p2-skin-rgb\)/);
    expect(ShopPageSource).toMatch(/\.p2-tabs\s*\{[\s\S]*?&\.active\s*\{[\s\S]*?var\(--p2-blood\)/);
  });

  it('牝奴期承领法器不消耗灵石并写入领受法器待处理交互', async () => {
    mockData.系统.阶段 = '牝奴期';
    mockData.系统.灵石 = 0;
    mockData.牝奴.当前日课 = '廊前听令';
    const wrapper = mountShop();

    const bellCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '牝铃');
    expect(bellCard).toBeTruthy();
    await bellCard!.trigger('click');
    await wrapper.find('.detail-overlay .buy-btn').trigger('click');

    expect(mockData.道具.拥有['牝铃']).toBe(1);
    expect(mockData.系统.灵石).toBe(0);
    expect(mockData.系统.待处理交互).toHaveLength(1);
    expect(mockData.系统.待处理交互[0]).toMatchObject({
      类型: '领受法器',
      目标: '玩家',
      道具: '牝铃',
      道具显示名: '牝铃',
      数量: 1,
      时辰: '午时',
      场景: '醉玉小筑',
    });
  });

  it('牝奴期发付页只出现身体法器，不出现特殊事件道具', async () => {
    mockData.系统.阶段 = '牝奴期';
    const wrapper = mountShop();
    const dispatchTab = wrapper.findAll('.tab-btn').find(tab => tab.text().includes('发付'));
    expect(dispatchTab).toBeTruthy();
    await dispatchTab!.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('牝印');
    expect(wrapper.text()).toContain('听铃颈环');
    expect(wrapper.text()).not.toContain('时间延长');
    expect(wrapper.text()).not.toContain('改变阵法');
    expect(wrapper.text()).not.toContain('欲海回声');
    expect(wrapper.text()).not.toContain('投欲钥');
  });

  it('剧情商城显示剧情信物名，购买后解锁剧情线且不进入背包', async () => {
    mockData.系统.灵石 = 100000;
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[4].trigger('click');
    await flushPromises();

    expect(wrapper.findAll('.item-card')).toHaveLength(5);
    const storyCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '断鸢玉扣');
    expect(storyCard).toBeTruthy();
    await storyCard!.trigger('click');
    expect(wrapper.find('.modal-title').text()).toBe('断鸢玉扣');
    expect(wrapper.find('.modal-hint').text()).toContain('旧誓');
    expect(wrapper.text()).toContain('白芷');
    expect(wrapper.text()).toContain('旧誓');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.剧情.已解锁).toContain('白芷旧誓线');
    expect(mockData.剧情.已解锁).not.toContain('白芷');
    expect(mockData.道具.拥有['白芷旧誓线']).toBeUndefined();
    expect(mockData.剧情.线索状态['白芷旧誓线']).toMatchObject({
      类型: '剧情钥匙',
      状态: '可追查',
      风声ID: 'story_baizhi_old_oath_1',
      关联NPC: '白芷',
    });
    expect(mockData.系统.风声列表[0]).toMatchObject({
      id: 'story_baizhi_old_oath_1',
      来源: '剧情钥匙',
      地点: '听风廊',
      相关NPC: ['白芷'],
      状态: '未读',
    });
    expect(mockData.系统.待处理交互[0]).toMatchObject({
      类型: '购买物品',
      目标: '玩家',
      道具: '白芷旧誓线',
      道具显示名: '断鸢玉扣',
      剧情线: '白芷旧誓线',
      关联NPC: '白芷',
      秘密主题: '旧誓/依赖/被保护欲',
      入口类型: '剧情钥匙',
      线索ID: 'story_baizhi_old_oath_1',
    });
  });

  it('已解锁剧情钥匙不可重复购买和重复入队', async () => {
    mockData.系统.灵石 = 100000;
    mockData.剧情.已解锁 = ['白芷旧誓线'];
    mockData.剧情.线索状态 = {
      白芷旧誓线: { 类型: '剧情钥匙', 状态: '可追查', 风声ID: 'story_baizhi_old_oath_1', 关联名称: '白芷旧誓线', 触发次数: 0 },
    };
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[4].trigger('click');
    await flushPromises();

    const storyCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '断鸢玉扣');
    expect(storyCard).toBeTruthy();
    expect(storyCard!.classes()).toContain('disabled');
    await storyCard!.trigger('click');
    await flushPromises();

    expect(wrapper.find('.buy-btn').attributes('disabled')).toBeDefined();
    expect(wrapper.find('.buy-btn').text()).toContain('因果已入簿');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.系统.灵石).toBe(100000);
    expect(mockData.系统.待处理交互).toEqual([]);
  });

  it('已解锁场景令牌不可重复购买和重复入队', async () => {
    mockData.系统.灵石 = 100000;
    mockData.场景.已解锁 = ['阴阳池'];
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[3].trigger('click');
    await flushPromises();

    const sceneCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '合契浴令');
    expect(sceneCard).toBeTruthy();
    expect(sceneCard!.classes()).toContain('disabled');
    await sceneCard!.trigger('click');
    await flushPromises();

    expect(wrapper.find('.buy-btn').attributes('disabled')).toBeDefined();
    expect(wrapper.find('.buy-btn').text()).toContain('场景已开');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.系统.灵石).toBe(100000);
    expect(mockData.系统.待处理交互).toEqual([]);
  });

  it('购买改变阵法后立即标记阵法已使用且不进入背包', async () => {
    mockData.系统.灵石 = 600000;
    mockData.NPC.柳素衣.攻略值 = 100;
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[5].trigger('click');
    await flushPromises();

    const arrayCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '改变阵法');
    expect(arrayCard).toBeTruthy();
    await arrayCard!.trigger('click');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.系统.已使用阵法).toBe(true);
    expect(mockData.道具.拥有['改变阵法']).toBeUndefined();
  });

  it('购买时间延长作为可使用消耗品进入背包', async () => {
    mockData.系统.灵石 = 100000;
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[5].trigger('click');
    await flushPromises();

    const timeCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '时间延长');
    expect(timeCard).toBeTruthy();
    await timeCard!.trigger('click');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.道具.拥有['时间延长']).toBe(1);
    expect(mockData.系统.剩余天数).toBe(30);
  });

  it('购买欲海遮蔽符进入背包作为自用消耗品，并写入事件元数据', async () => {
    mockData.系统.灵石 = 100000;
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[5].trigger('click');
    await flushPromises();

    const card = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '欲海遮蔽符');
    expect(card).toBeTruthy();
    await card!.trigger('click');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.道具.拥有['欲海遮蔽符']).toBe(1);
    expect(mockData.系统.待处理交互[0]).toMatchObject({
      类型: '购买物品',
      目标: '玩家',
      道具: '欲海遮蔽符',
    });
    expect(mockData.系统.待处理交互[0].AI短提示).toContain('气息');
  });

  it('购买欲海回声立即触发事件种子，不进背包', async () => {
    mockData.系统.灵石 = 100000;
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[5].trigger('click');
    await flushPromises();

    const card = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '欲海回声');
    expect(card).toBeTruthy();
    await card!.trigger('click');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.道具.拥有['欲海回声']).toBeUndefined();
    expect(mockData.系统.风声列表).toEqual([]);
    expect(mockData.系统.待处理交互[0]).toMatchObject({
      类型: '购买物品',
      目标: '玩家',
      道具: '欲海回声',
    });
    expect(mockData.系统.待处理交互[0].AI短提示).toContain('青云道人');
  });

  it('购买投欲钥立即触发事件种子，不进背包也不写已使用阵法', async () => {
    mockData.系统.灵石 = 200000;
    const wrapper = mountShop();
    await wrapper.findAll('.tab-btn')[5].trigger('click');
    await flushPromises();

    const card = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '投欲钥');
    expect(card).toBeTruthy();
    await card!.trigger('click');
    await wrapper.find('.buy-btn').trigger('click');

    expect(mockData.道具.拥有['投欲钥']).toBeUndefined();
    expect(mockData.系统.已使用阵法).toBe(false);
    expect(mockData.系统.待处理交互[0]).toMatchObject({
      类型: '购买物品',
      目标: '玩家',
      道具: '投欲钥',
    });
    expect(mockData.系统.待处理交互[0].AI短提示).toContain('欲海核心');
  });

});
