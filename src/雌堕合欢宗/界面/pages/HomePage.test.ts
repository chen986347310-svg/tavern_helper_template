// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { reactive } from 'vue';
import { readFileSync } from 'node:fs';

const mockData = reactive({
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石: 1000, 已使用阵法: false, 时辰: '午时', 当前场景: '醉玉小筑', 待处理交互: [] as any[], 风声列表: [] as any[], 心音回响: [] as any[], 当前聚焦心声NPC: '', 场景上下文: { 在场NPC: [] as string[] } },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      上次支配者: '',
      支配次数: {},
      改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
    },
    NPC: {
      白芷: { 好感度: 50, 攻略值: 30, 粘滞计数: 1, 状态: '进行中', 当前场景: '醉玉小筑' },
      苏芸: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '醉玉小筑' },
      纪兰: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' },
      沈月秋: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '绮梦幽阁' },
      柳素衣: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' },
    },
    道具: { 拥有: {}, 装备: { 玩家: [], 白芷: [], 苏芸: [], 纪兰: [], 沈月秋: [], 柳素衣: [] } },
    场景: { 已解锁: [] },
    剧情: { 已解锁: [] },
  })

vi.mock('../store', () => ({
  useDataStore: () => ({ data: mockData }),
}));



import HomePage from '../pages/HomePage.vue';

const HomePageSource = readFileSync('src/雌堕合欢宗/界面/pages/HomePage.vue', 'utf8');

describe('HomePage', () => {
  beforeEach(() => {
    mockData.系统.阶段 = '攻略期';
    mockData.系统.剩余天数 = 30;
    mockData.系统.灵石 = 1000;
    mockData.系统.时辰 = '午时';
    mockData.系统.当前场景 = '醉玉小筑';
    mockData.系统.待处理交互 = [];
    mockData.系统.风声列表 = [];
    mockData.系统.心音回响 = [];
    mockData.系统.当前聚焦心声NPC = '';
    mockData.系统.场景上下文 = { 在场NPC: [] };
    // 重置 NPC 状态
    mockData.NPC.白芷 = { 好感度: 50, 攻略值: 30, 粘滞计数: 1, 状态: '进行中', 当前场景: '醉玉小筑' };
    mockData.NPC.苏芸 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '醉玉小筑' };
    mockData.NPC.纪兰 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' };
    mockData.NPC.沈月秋 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '绮梦幽阁' };
    mockData.NPC.柳素衣 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' };
  });

  // SystemBar 相关断言已迁移至 App.test.ts（当前 SystemBar 由 App.vue 渲染）

  it('默认只渲染当前场景NPC卡片', () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const npcCards = wrapper.findAll('.npc-strip');
    expect(npcCards).toHaveLength(2);
  });

  it('NPC卡片显示正确名字', () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const names = wrapper.findAll('.strip-name').map(w => w.text());
    expect(names).toEqual(['白芷', '苏芸']);
  });

  it('点击进行中卡片展开', async () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll('.npc-strip');
    await cards[0].trigger('click');
    await flushPromises();
    expect(wrapper.findAll('.npc-strip')[0].classes()).toContain('expanded');
  });

  it('再次点击同一卡片收起', async () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll('.npc-strip');
    await cards[0].trigger('click');
    await flushPromises();
    await cards[0].trigger('click');
    await flushPromises();
    expect(wrapper.findAll('.npc-strip')[0].classes()).not.toContain('expanded');
  });

  it('点击不同卡片切换展开', async () => {
    // 设两个进行中卡片以测试切换
    mockData.NPC.苏芸.状态 = '进行中';
    mockData.NPC.苏芸.当前场景 = '醉玉小筑';
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll('.npc-strip');
    await cards[0].trigger('click');
    await flushPromises();
    expect(wrapper.findAll('.npc-strip')[0].classes()).toContain('expanded');
    await cards[1].trigger('click');
    await flushPromises();
    expect(wrapper.findAll('.npc-strip')[0].classes()).not.toContain('expanded');
    expect(wrapper.findAll('.npc-strip')[1].classes()).toContain('expanded');
  });

  it('同时只有一个卡片展开', async () => {
    mockData.NPC.苏芸.状态 = '进行中';
    mockData.NPC.苏芸.当前场景 = '醉玉小筑';
    mockData.NPC.纪兰.状态 = '已完成';
    mockData.NPC.纪兰.当前场景 = '醉玉小筑';
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll('.npc-strip');
    await cards[0].trigger('click');
    await flushPromises();
    await cards[1].trigger('click');
    await flushPromises();
    await cards[2].trigger('click');
    await flushPromises();
    const expandedCount = wrapper.findAll('.npc-strip.expanded').length;
    expect(expandedCount).toBeLessThanOrEqual(1);
  });

  // 全部完成时太极图标全粉 已迁移至 App.test.ts（断言依赖 App 层 SystemBar）

  it('未开始卡片有 locked class', () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll('.npc-strip');
    // 苏芸是未开始
    expect(cards[1].classes()).toContain('locked');
  });

  it('currentScene 属性切换NPC列表且不写入待处理交互', async () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    expect(wrapper.findAll('.strip-name').map(w => w.text())).toEqual(['白芷', '苏芸']);

    await wrapper.setProps({ currentScene: '莲灯前苑' });
    await flushPromises();

    expect(wrapper.findAll('.strip-name').map(w => w.text())).toEqual(['纪兰', '柳素衣']);
    expect(mockData.系统.待处理交互).toEqual([]);
  });

  it('当前场景无NPC时显示氛围留白文案', async () => {
    mockData.NPC.沈月秋.当前场景 = '莲灯前苑';
    const wrapper = mount(HomePage, { props: { currentScene: '绮梦幽阁' }, global: { plugins: [createPinia()] } });

    expect(wrapper.findAll('.npc-strip')).toHaveLength(0);
    expect(wrapper.find('.scene-empty').text()).toContain('幽阁灯火低垂');
  });

  it('主页最多显示三条未失效风声', () => {
    mockData.系统.风声列表 = [
      { id: 'r1', 来源: '弟子传闻', 地点: '药庐', 子区域: '炼丹房', 相关NPC: ['白芷'], 风声文本: '药庐丹炉彻夜未熄', 故事钩子: '白芷屏退杂役', 状态: '未读' },
      { id: 'r2', 来源: '执事低语', 地点: '经阁', 子区域: '残卷室', 相关NPC: ['纪兰'], 风声文本: '残卷室有灯影晃动', 故事钩子: '纪兰翻找旧简', 状态: '未读' },
      { id: 'r3', 来源: '风铃回响', 地点: '醉玉小筑', 子区域: '后廊', 相关NPC: ['苏芸'], 风声文本: '后廊酒盏无人自鸣', 故事钩子: '苏芸留下半盏酒', 状态: '未读' },
      { id: 'r4', 来源: '旧闻', 地点: '绮梦幽阁', 子区域: '内室', 相关NPC: ['柳素衣'], 风声文本: '旧闻不该出现', 故事钩子: '', 状态: '已失效' },
    ];
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });

    expect(wrapper.findAll('.rumor-card')).toHaveLength(3);
    expect(wrapper.text()).toContain('药庐丹炉彻夜未熄');
    expect(wrapper.text()).not.toContain('旧闻不该出现');
  });

  it('点击风声只记录追查风声，等待下一楼层AI回应', async () => {
    const generateSpy = vi.fn();
    (globalThis as any).generate = generateSpy;
    mockData.系统.场景上下文 = { 在场NPC: ['白芷'] };
    mockData.系统.风声列表 = [
      { id: 'r1', 来源: '弟子传闻', 地点: '药庐', 子区域: '炼丹房', 相关NPC: ['白芷'], 风声文本: '药庐丹炉彻夜未熄', 故事钩子: '白芷屏退杂役', 状态: '未读' },
    ];
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });

    await wrapper.find('.rumor-card').trigger('click');
    await flushPromises();

    expect(mockData.系统.待处理交互[0]).toMatchObject({
      类型: '追查风声',
      目标: '白芷',
      地点: '药庐',
      子区域: '炼丹房',
      风声ID: 'r1',
      故事钩子: '白芷屏退杂役',
      在场NPC: ['白芷'],
    });
    expect(generateSpy).not.toHaveBeenCalled();
    delete (globalThis as any).generate;
  });


  it('场景上下文驱动氛围滤镜与故事钩子留白', () => {
    mockData.系统.场景上下文 = {
      地点: '经阁',
      子区域: '密室',
      公开度: '私密',
      在场NPC: [],
      氛围: ['烛火摇曳', '药香微苦'],
      故事钩子: ['禁书被人急促翻动，残页仍在微微发颤。'],
    } as any;
    mockData.NPC.白芷.当前场景 = '莲灯前苑';
    mockData.NPC.苏芸.当前场景 = '莲灯前苑';
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });

    expect(wrapper.find('.home-page').attributes('data-exposure')).toBe('私密');
    expect(wrapper.find('.label-text').text()).toBe('经阁·密室');
    expect(wrapper.find('.scene-empty').text()).toContain('禁书被人急促翻动');
    expect(wrapper.find('.scene-empty').text()).toContain('[烛火摇曳]');
  });

  it('风声锁定后呈现待追查状态，再次点击可取消暂存', async () => {
    mockData.系统.风声列表 = [
      { id: 'r1', 来源: '弟子传闻', 地点: '药庐', 子区域: '炼丹房', 相关NPC: ['白芷'], 风声文本: '药庐丹炉彻夜未熄', 故事钩子: '白芷屏退杂役', 状态: '未读' },
    ];
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });

    await wrapper.find('.rumor-card').trigger('click');
    await flushPromises();
    expect(wrapper.find('.rumor-card').classes()).toContain('is-pending');
    expect(wrapper.find('.rumor-pending-note').text()).toContain('灵识已锁定');
    expect(mockData.系统.待处理交互).toHaveLength(1);

    await wrapper.find('.rumor-card').trigger('click');
    await flushPromises();
    expect(wrapper.find('.rumor-card').classes()).not.toContain('is-pending');
    expect(mockData.系统.待处理交互).toEqual([]);
  });
  it('点击命轮区只聚焦心音，不写入灵识窃取待处理交互', async () => {
    const generateSpy = vi.fn();
    (globalThis as any).generate = generateSpy;
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });

    await wrapper.find('.dual-ring-panel').trigger('click');
    await flushPromises();

    expect(mockData.系统.当前聚焦心声NPC).toBe('白芷');
    expect(mockData.系统.待处理交互).toEqual([]);
    expect(wrapper.find('.dual-ring-panel').classes()).toContain('soul-locked');
    expect(wrapper.find('.soul-pending-mark').text()).toBe('灵识窥伺');
    expect(generateSpy).not.toHaveBeenCalled();
    delete (globalThis as any).generate;
  });

  it('再次点击同一命轮会取消心音聚焦且不影响待处理交互', async () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });

    await wrapper.find('.dual-ring-panel').trigger('click');
    await flushPromises();
    expect(mockData.系统.当前聚焦心声NPC).toBe('白芷');
    expect(wrapper.find('.dual-ring-panel').classes()).toContain('soul-locked');

    await wrapper.find('.dual-ring-panel').trigger('click');
    await flushPromises();

    expect(mockData.系统.当前聚焦心声NPC).toBe('');
    expect(mockData.系统.待处理交互).toEqual([]);
    expect(wrapper.find('.dual-ring-panel').classes()).not.toContain('soul-locked');
    expect(wrapper.find('.soul-pending-mark').exists()).toBe(false);
  });

  it('NPC离场后仍显示心音回响记录', () => {
    mockData.系统.场景上下文 = { 在场NPC: [] };
    mockData.NPC.白芷.当前场景 = '莲灯前苑';
    mockData.NPC.苏芸.当前场景 = '莲灯前苑';
    mockData.系统.心音回响 = [
      { id: 'echo-1', npc: '白芷', text: '调试心音：她离场后仍有余响。', stage: '动摇', result: '捕获', scene: '醉玉小筑', time: '午时', is_new: true },
    ];
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });

    expect(wrapper.findAll('.npc-strip')).toHaveLength(0);
    expect(wrapper.find('.soul-echo-stream').exists()).toBe(true);
    expect(wrapper.find('.soul-echo-card').text()).toContain('调试心音：她离场后仍有余响。');
  });
  it('心音聚焦提示提供稳定可读色，不依赖失效高亮变量', () => {
    expect(HomePageSource).not.toContain('--hh-text-highlight');
    expect(HomePageSource).toMatch(/\.soul-echo-note\s*\{[\s\S]*?color:\s*#9c2c31;[\s\S]*?color:\s*var\(--hh-accent,\s*#9c2c31\)/);
    expect(HomePageSource).toMatch(/\.soul-echo-card\s*\{[\s\S]*?color:\s*#d9b48f;[\s\S]*?color:\s*var\(--hh-text-primary,\s*#d9b48f\)/);
    expect(HomePageSource).toMatch(/\.soul-echo-text\s*\{[\s\S]*?color:\s*#d9b48f;[\s\S]*?color:\s*var\(--hh-text-primary,\s*#d9b48f\)/);
  });
});