// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { reactive } from 'vue';
import App from './App.vue';

const mockData = reactive({
  系统: { 阶段: '攻略期', 剩余天数: 30, 灵石: 1000, 已使用阵法: false, 当前场景: '醉玉小筑', 场景上下文: undefined as any, 风声列表: [] as any[] },
  牝奴: {
    堕落度: 0,
    牝阴决层数: 0,
    上次支配者: '',
    支配次数: {},
    改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
      情欲控制阶段: 1,
  },
  NPC: {
    白芷: { 好感度: 50, 攻略值: 30, 粘滞计数: 1, 状态: '进行中', 当前场景: '醉玉小筑' },
    苏芸: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' },
    纪兰: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '绮梦幽阁' },
    沈月秋: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '醉玉小筑' },
    柳素衣: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' },
  },
  道具: { 拥有: {}, 装备: { 玩家: [], 白芷: [], 苏芸: [], 纪兰: [], 沈月秋: [], 柳素衣: [] } },
  场景: { 已解锁: [] },
  剧情: { 已解锁: [] },
});

vi.mock('./界面/store', () => ({
  useDataStore: () => ({ data: mockData }),
}));

vi.mock('./界面/styles/_variables.scss', () => ({}));
vi.mock('./界面/styles/_mixins.scss', () => ({}));
vi.mock('./界面/styles/_global.scss', () => ({}));

describe('App 层 SystemBar 渲染', () => {
  beforeEach(() => {
    mockData.系统.阶段 = '攻略期';
    mockData.系统.剩余天数 = 30;
    mockData.系统.灵石 = 1000;
    mockData.系统.场景上下文 = undefined as any;
    mockData.系统.风声列表 = [];

    mockData.NPC.白芷 = { 好感度: 50, 攻略值: 30, 粘滞计数: 1, 状态: '进行中', 当前场景: '醉玉小筑' };
    mockData.NPC.苏芸 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' };
    mockData.NPC.纪兰 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '绮梦幽阁' };
    mockData.NPC.沈月秋 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '醉玉小筑' };
    mockData.NPC.柳素衣 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' };
  });

  it('攻略期显示 SystemBar', () => {
    const wrapper = mount(App, { global: { plugins: [createPinia()] } });
    expect(wrapper.find('.system-bar').exists()).toBe(true);
  });

  it('SystemBar 包含太极图标', () => {
    const wrapper = mount(App, { global: { plugins: [createPinia()] } });
    expect(wrapper.findAll('.taiji-icon')).toHaveLength(2);
  });


  it('顶栏不再渲染旧三场景入口', () => {
    const wrapper = mount(App, { global: { plugins: [createPinia()] } });

    expect(wrapper.find('.scene-switcher').exists()).toBe(false);
    expect(wrapper.findAll('.scene-btn')).toHaveLength(0);
    expect(wrapper.findAll('.strip-name').map(w => w.text())).toEqual(['白芷', '沈月秋']);
  });


  it('场景上下文为空在场NPC时回退旧场景筛选，避免默认隐藏角色栏', async () => {
    mockData.系统.场景上下文 = { 在场NPC: [] } as any;
    const wrapper = mount(App, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(wrapper.findAll('.taiji-name').map(w => w.text())).toEqual(['白芷', '沈月秋']);
  });

  it('顶栏优先使用场景上下文中的在场NPC', async () => {
    mockData.系统.场景上下文 = { 在场NPC: ['柳素衣', '白芷'] } as any;
    const wrapper = mount(App, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(wrapper.findAll('.taiji-name').map(w => w.text())).toEqual(['白芷', '柳素衣']);
  });
  it('App 将有效风声传入状态栏形成涟漪提示', async () => {
    mockData.系统.风声列表 = [
      { id: 'r-app', 来源: '风声', 地点: '醉玉小筑', 风声文本: '小筑外传来急促足音。', 状态: '未读' },
    ];

    const wrapper = mount(App, { global: { plugins: [createPinia()] } });
    await flushPromises();

    const bar = wrapper.find('.system-bar');
    expect(bar.classes()).toContain('system-bar--rumor');
    expect(bar.attributes('data-rumor-active')).toBe('true');
    expect(wrapper.find('.rumor-orb').exists()).toBe(false);
  });
  it('全部完成时太极图标全粉', async () => {
    const wrapper = mount(App, { global: { plugins: [createPinia()] } });

    for (const npc of ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const) {
      mockData.NPC[npc].状态 = '已完成';
    }

    await flushPromises();

    expect(wrapper.findAll('.taiji--conquered')).toHaveLength(2);
  });
});
