// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { reactive } from 'vue';

const mockData = reactive({
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石: 10000, 已使用阵法: false },
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
    道具: { 拥有: {}, 装备: { 玩家: [], 白芷: [], 苏芸: [], 纪兰: [], 沈月秋: [], 柳素衣: [] } },
    场景: { 已解锁: [] as string[] },
    剧情: { 已解锁: [] as string[] },
  })

vi.mock('../store', () => ({
  useDataStore: () => ({ data: mockData }),
}));


import GalleryPage from '../pages/GalleryPage.vue';

function mountGallery() {
  return mount(GalleryPage, { global: { plugins: [createPinia()] } });
}

describe('GalleryPage', () => {
  beforeEach(() => {
    mockData.NPC.白芷.好感度 = 50;
    mockData.NPC.白芷.攻略值 = 30;
    mockData.NPC.白芷.状态 = '进行中';
    mockData.NPC.苏芸.状态 = '未开始';
    mockData.NPC.纪兰.状态 = '未开始';
    mockData.NPC.沈月秋.状态 = '未开始';
    mockData.NPC.柳素衣.状态 = '未开始';
    mockData.场景.已解锁 = [];
    mockData.剧情.已解锁 = [];
  });

  // --- NPC 档案 ---
  it('渲染5个NPC条目', () => {
    const wrapper = mountGallery();
    const entries = wrapper.findAll('.npc-entry');
    expect(entries).toHaveLength(5);
  });

  it('NPC条目显示名字和状态', () => {
    const wrapper = mountGallery();
    const firstEntry = wrapper.findAll('.npc-entry')[0];
    expect(firstEntry.find('.npc-name').text()).toBe('白芷');
    expect(firstEntry.find('.npc-status').text()).toBe('进行中');
  });

  it('未开始的NPC没有unlocked class', () => {
    const wrapper = mountGallery();
    const entries = wrapper.findAll('.npc-entry');
    expect(entries[1].classes()).not.toContain('unlocked'); // 苏芸未开始
  });

  it('进行中的NPC有unlocked class', () => {
    const wrapper = mountGallery();
    const entries = wrapper.findAll('.npc-entry');
    expect(entries[0].classes()).toContain('unlocked'); // 白芷进行中
  });

  it('已完成的NPC有unlocked class', () => {
    mockData.NPC.苏芸.状态 = '已完成';
    const wrapper = mountGallery();
    const entries = wrapper.findAll('.npc-entry');
    expect(entries[1].classes()).toContain('unlocked');
  });

  // --- NPC 详情面板 ---
  it('点击NPC显示详情面板', async () => {
    const wrapper = mountGallery();
    await wrapper.findAll('.npc-entry')[0].trigger('click');
    expect(wrapper.find('.npc-detail-panel').exists()).toBe(true);
    expect(wrapper.find('.panel-name').text()).toBe('白芷');
  });

  it('详情面板显示好感度、攻略值、状态', async () => {
    const wrapper = mountGallery();
    await wrapper.findAll('.npc-entry')[0].trigger('click');
    const cells = wrapper.findAll('.detail-cell');
    expect(cells).toHaveLength(3);
    expect(cells[0].find('.cell-value').text()).toBe('50'); // 好感度
    expect(cells[1].find('.cell-value').text()).toBe('30'); // 攻略值
    expect(cells[2].find('.cell-value').text()).toContain('进行中'); // 状态
  });

  it('再次点击同一NPC关闭详情', async () => {
    const wrapper = mountGallery();
    await wrapper.findAll('.npc-entry')[0].trigger('click');
    expect(wrapper.find('.npc-detail-panel').exists()).toBe(true);
    await wrapper.findAll('.npc-entry')[0].trigger('click');
    expect(wrapper.find('.npc-detail-panel').exists()).toBe(false);
  });

  it('点击不同NPC切换详情', async () => {
    mockData.NPC.苏芸.好感度 = 20;
    mockData.NPC.苏芸.状态 = '进行中';
    const wrapper = mountGallery();
    await wrapper.findAll('.npc-entry')[0].trigger('click');
    expect(wrapper.find('.panel-name').text()).toBe('白芷');
    await wrapper.findAll('.npc-entry')[1].trigger('click');
    expect(wrapper.find('.panel-name').text()).toBe('苏芸');
  });

  // --- 已解锁场景 ---
  it('无场景时显示空状态', () => {
    const wrapper = mountGallery();
    const sections = wrapper.findAll('.section');
    const sceneSection = sections[1]; // 第二个section是场景
    expect(sceneSection.find('.empty-state').exists()).toBe(true);
  });

  it('有场景时显示场景列表', () => {
    mockData.场景.已解锁 = ['阴阳池', '经阁密室'];
    const wrapper = mountGallery();
    const items = wrapper.findAll('.unlock-item');
    expect(items).toHaveLength(2);
    expect(items[0].find('.item-text').text()).toBe('阴阳池');
    expect(items[1].find('.item-text').text()).toBe('经阁密室');
  });

  // --- 已解锁剧情 ---
  it('无剧情时显示空状态', () => {
    const wrapper = mountGallery();
    const sections = wrapper.findAll('.section');
    const storySection = sections[2]; // 第三个section是剧情
    expect(storySection.find('.empty-state').exists()).toBe(true);
  });

  it('有剧情时显示剧情列表', () => {
    mockData.剧情.已解锁 = ['白芷幼弟的下落'];
    const wrapper = mountGallery();
    const sections = wrapper.findAll('.section');
    const storySection = sections[2];
    const items = storySection.findAll('.unlock-item');
    expect(items).toHaveLength(1);
    expect(items[0].find('.item-text').text()).toBe('白芷幼弟的下落');
  });

  // --- 区域标题 ---
  it('显示3个区域标题', () => {
    const wrapper = mountGallery();
    const headers = wrapper.findAll('.section-header');
    expect(headers).toHaveLength(3);
  });

  it('区域标题文字正确', () => {
    const wrapper = mountGallery();
    const headers = wrapper.findAll('.header-text').map(w => w.text());
    expect(headers).toEqual(['NPC档案', '已解锁场景', '已解锁剧情']);
  });
});
