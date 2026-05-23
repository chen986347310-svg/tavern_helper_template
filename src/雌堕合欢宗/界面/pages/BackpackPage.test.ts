// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { reactive } from 'vue';

const mockData = reactive({
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石: 10000, 已使用阵法: false, 时辰: '午时', 当前场景: '醉玉小筑', 待处理交互: [] as any[], 场景上下文: { 在场NPC: [] as string[] } },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      上次支配者: '',
      支配次数: {},
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
    剧情: { 已解锁: [] },
  })

vi.mock('../store', () => ({
  useDataStore: () => ({ data: mockData }),
}));


import BackpackPage from '../pages/BackpackPage.vue';

function mountBackpack() {
  return mount(BackpackPage, { global: { plugins: [createPinia()] } });
}

describe('BackpackPage', () => {
  beforeEach(() => {
    mockData.道具.拥有 = {};
    mockData.道具.装备 = {
      玩家: [],
      白芷: [],
      苏芸: [],
      纪兰: [],
      沈月秋: [],
      柳素衣: [],
    };
    mockData.NPC.白芷.好感度 = 50;
    mockData.NPC.苏芸.好感度 = 0;
    mockData.系统.时辰 = '午时';
    mockData.系统.当前场景 = '醉玉小筑';
    mockData.系统.待处理交互 = [];
    mockData.系统.场景上下文 = { 在场NPC: [] };
  });

  // --- 空状态 ---
  it('无道具时显示空状态', () => {
    const wrapper = mountBackpack();
    expect(wrapper.find('.empty-state').exists()).toBe(true);
    expect(wrapper.find('.empty-text').text()).toBe('锦囊尚空');
  });

  // --- 道具列表 ---
  it('有道具时显示道具列表', () => {
    mockData.道具.拥有 = { 铃铛项圈: 2, 眼罩: 1 };
    const wrapper = mountBackpack();
    const rows = wrapper.findAll('.item-row');
    expect(rows).toHaveLength(2);
  });

  it('道具显示名称和数量', () => {
    mockData.道具.拥有 = { 铃铛项圈: 3 };
    const wrapper = mountBackpack();
    const row = wrapper.find('.item-row');
    expect(row.find('.item-name').text()).toBe('铃铛项圈');
    expect(row.find('.item-count').text()).toBe('x3');
  });

  it('数量为0的道具不再显示在背包列表', () => {
    mockData.道具.拥有 = { 铃铛项圈: 2, 眼罩: 0 };
    const wrapper = mountBackpack();
    const rows = wrapper.findAll('.item-row');
    expect(rows).toHaveLength(1);
    expect(rows[0].find('.item-name').text()).toBe('铃铛项圈');
    expect(wrapper.text()).not.toContain('眼罩');
  });

  // --- 选择道具 ---
  it('点击道具高亮并显示装备区域', async () => {
    mockData.道具.拥有 = { 铃铛项圈: 1 };
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    expect(wrapper.find('.item-row').classes()).toContain('selected');
    expect(wrapper.find('.equip-section').exists()).toBe(true);
  });

  it('再次点击同一道具取消选择', async () => {
    mockData.道具.拥有 = { 铃铛项圈: 1 };
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    expect(wrapper.find('.equip-section').exists()).toBe(true);
    await wrapper.find('.item-row').trigger('click');
    expect(wrapper.find('.equip-section').exists()).toBe(false);
  });

  // --- 装备目标 ---
  it('装备区域显示6个目标', async () => {
    mockData.道具.拥有 = { 铃铛项圈: 1 };
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    const targets = wrapper.findAll('.target-btn');
    expect(targets).toHaveLength(6);
  });

  // --- 装备操作 ---
  it('点击目标按钮装备道具', async () => {
    mockData.道具.拥有 = { 铃铛项圈: 1 };
    mockData.NPC.白芷.好感度 = 0; // 铃铛项圈门槛0
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    const targetBtns = wrapper.findAll('.target-btn');
    // 点击白芷 (index 1)
    await targetBtns[1].trigger('click');
    expect(mockData.道具.装备['白芷']).toContain('铃铛项圈');
  });

  it('玩家目标无好感度限制', async () => {
    mockData.道具.拥有 = { 淫纹: 1 };
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    const targetBtns = wrapper.findAll('.target-btn');
    // 点击玩家 (index 0)
    await targetBtns[0].trigger('click');
    expect(mockData.道具.装备['玩家']).toContain('淫纹');
  });

  // --- canEquipTo ---
  it('好感度不足时目标按钮显示cannot-equip', async () => {
    mockData.道具.拥有 = { 口塞: 1 }; // 门槛30
    mockData.NPC.苏芸.好感度 = 0;
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    const targetBtns = wrapper.findAll('.target-btn');
    // 苏芸 (index 2) 好感度0 < 门槛30
    expect(targetBtns[2].classes()).toContain('cannot-equip');
  });

  it('好感度足够时目标按钮可点击', async () => {
    mockData.道具.拥有 = { 口塞: 1 }; // 门槛30
    mockData.NPC.白芷.好感度 = 50;
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    const targetBtns = wrapper.findAll('.target-btn');
    // 白芷 (index 1) 好感度50 >= 门槛30
    expect(targetBtns[1].classes()).not.toContain('cannot-equip');
  });


  it('装备会占用一件库存，库存归零后从背包消失', async () => {
    mockData.道具.拥有 = { 铃铛项圈: 1 };
    mockData.NPC.白芷.好感度 = 0;
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    await wrapper.findAll('.target-btn')[1].trigger('click');

    expect(mockData.道具.装备['白芷']).toContain('铃铛项圈');
    expect(mockData.道具.拥有['铃铛项圈']).toBeUndefined();
    expect(wrapper.findAll('.item-row')).toHaveLength(0);
  });

  it('没有库存时不能给第二个目标重复装备', async () => {
    mockData.道具.拥有 = { 铃铛项圈: 1 };
    mockData.NPC.白芷.好感度 = 0;
    mockData.NPC.苏芸.好感度 = 0;
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    const targetBtns = wrapper.findAll('.target-btn');
    await targetBtns[1].trigger('click');
    await targetBtns[2].trigger('click');

    expect(mockData.道具.装备['白芷']).toEqual(['铃铛项圈']);
    expect(mockData.道具.装备['苏芸']).toEqual([]);
  });

  it('从已装备栏卸下道具后归还背包库存', async () => {
    mockData.道具.拥有 = {};
    mockData.道具.装备['白芷'] = ['铃铛项圈'];
    const wrapper = mountBackpack();
    const equippedItem = wrapper.find('.equipped-item');
    expect(equippedItem.exists()).toBe(true);
    await equippedItem.trigger('click');
    await wrapper.findAll('.target-btn')[1].trigger('click');

    expect(mockData.道具.装备['白芷']).toEqual([]);
    expect(mockData.道具.拥有['铃铛项圈']).toBe(1);
  });

  // --- 取消装备 ---
  it('已装备的目标按钮显示equipped class', async () => {
    mockData.道具.拥有 = { 铃铛项圈: 1 };
    mockData.道具.装备['白芷'] = ['铃铛项圈'];
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    const targetBtns = wrapper.findAll('.target-btn');
    expect(targetBtns[1].classes()).toContain('equipped');
  });

  it('点击已装备的目标取消装备', async () => {
    mockData.道具.拥有 = { 铃铛项圈: 1 };
    mockData.道具.装备['白芷'] = ['铃铛项圈'];
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    const targetBtns = wrapper.findAll('.target-btn');
    await targetBtns[1].trigger('click');
    expect(mockData.道具.装备['白芷']).not.toContain('铃铛项圈');
  });

  // --- 当前装备显示 ---
  it('当前装备区域显示所有目标', () => {
    const wrapper = mountBackpack();
    const equipRows = wrapper.findAll('.equip-row');
    expect(equipRows).toHaveLength(6);
  });

  it('无装备时显示虚位', () => {
    const wrapper = mountBackpack();
    const firstRow = wrapper.findAll('.equip-row')[0];
    expect(firstRow.find('.equipped-items').text()).toBe('虚位');
  });

  it('有装备时显示道具名', () => {
    mockData.道具.装备['白芷'] = ['口塞', '束缚绳'];
    const wrapper = mountBackpack();
    const baiRow = wrapper.findAll('.equip-row')[1]; // 白芷是第二个
    expect(baiRow.find('.equipped-items').text()).toBe('口塞、束缚绳');
  });


  // --- 消耗品使用 ---
  it('消耗品显示启用法效按钮而不显示装备目标', async () => {
    mockData.道具.拥有 = { 时间延长: 1 };
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');

    expect(wrapper.find('.use-btn').exists()).toBe(true);
    expect(wrapper.find('.use-btn').text()).toBe('启用法效');
    expect(wrapper.find('.equip-targets').exists()).toBe(false);
  });

  it('使用消耗品后扣除库存并从背包消失', async () => {
    mockData.道具.拥有 = { 时间延长: 1 };
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    await wrapper.find('.use-btn').trigger('click');

    expect(mockData.道具.拥有['时间延长']).toBeUndefined();
    expect(wrapper.text()).not.toContain('时间延长');
  });

  it('使用消耗品写入待处理交互等待下一楼层AI处理', async () => {
    mockData.道具.拥有 = { 时间延长: 1 };
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    await wrapper.find('.use-btn').trigger('click');

    expect(mockData.系统.待处理交互).toContainEqual({
      类型: '使用物品',
      目标: '玩家',
      道具: '时间延长',
      数量: 1,
      时辰: '午时',
      场景: '醉玉小筑',
    });
  });


  it('永久丹药显示在场NPC目标而不是直接启用法效', async () => {
    mockData.道具.拥有 = { 体香丹: 1 };
    mockData.系统.场景上下文 = { 在场NPC: ['白芷', '纪兰'] };
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');

    expect(wrapper.find('.use-btn').exists()).toBe(false);
    expect(wrapper.findAll('.target-btn').map(btn => btn.text())).toEqual(['白芷', '纪兰']);
  });

  it('永久丹药选择目标后扣库存并写入目标待处理交互', async () => {
    mockData.道具.拥有 = { 体香丹: 1 };
    mockData.系统.场景上下文 = { 在场NPC: ['白芷'] };
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');
    await wrapper.find('.target-btn').trigger('click');

    expect(mockData.道具.拥有['体香丹']).toBeUndefined();
    expect(mockData.系统.待处理交互).toContainEqual({
      类型: '使用物品',
      目标: '白芷',
      道具: '体香丹',
      数量: 1,
      时辰: '午时',
      场景: '醉玉小筑',
    });
  });

  it('永久丹药无在场NPC时不显示目标按钮也不扣库存', async () => {
    mockData.道具.拥有 = { 体香丹: 1 };
    mockData.系统.场景上下文 = { 在场NPC: [] };
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');

    expect(wrapper.findAll('.target-btn')).toHaveLength(0);
    expect(wrapper.find('.target-empty').text()).toContain('此刻无人可承此丹');
    expect(mockData.道具.拥有['体香丹']).toBe(1);
  });
  it('消耗品不能被装备到NPC', async () => {
    mockData.道具.拥有 = { 时间延长: 1 };
    const wrapper = mountBackpack();
    await wrapper.find('.item-row').trigger('click');

    expect(wrapper.findAll('.target-btn')).toHaveLength(0);
    expect(mockData.道具.装备['白芷']).toEqual([]);
  });

});
