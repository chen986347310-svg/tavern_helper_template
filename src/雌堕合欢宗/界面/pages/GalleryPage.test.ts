// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { reactive } from 'vue';
import { readFileSync } from 'node:fs';

const mockData = reactive({
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石: 10000, 已使用阵法: false, 时辰: '午时', 当前场景: '醉玉小筑', 场景上下文: { 地点: '醉玉小筑', 子区域: '前院', 场景来源: '核心地点', 公开度: '半私密', 在场NPC: [] as string[], NPC活动: {}, 氛围: [], 故事钩子: [], 特殊事件: '' }, 风声列表: [] as any[], 当前追查风声ID: '', 待处理交互: [] as any[], 心音回响: [] as any[], 当前聚焦心声NPC: '' },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      当前日课: '候命',
      当前支配者: '',
      当前命令: '',
      命令强度: 0,
      今日调教次数: 0,
      最近调教结算: '',
      羞名标签: [] as string[],
      调教记录: [] as any[],
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

const GalleryPageSource = readFileSync('src/雌堕合欢宗/界面/pages/GalleryPage.vue', 'utf8');

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
    mockData.系统.阶段 = '攻略期';
    mockData.系统.当前场景 = '醉玉小筑';
    mockData.系统.场景上下文 = { 地点: '醉玉小筑', 子区域: '前院', 场景来源: '核心地点', 公开度: '半私密', 在场NPC: [], NPC活动: {}, 氛围: [], 故事钩子: [], 特殊事件: '' };
    mockData.系统.风声列表 = [];
    mockData.系统.当前追查风声ID = '';
    mockData.系统.待处理交互 = [];
    mockData.系统.心音回响 = [];
    mockData.系统.当前聚焦心声NPC = '';
    mockData.牝奴.当前日课 = '候命';
    mockData.牝奴.当前支配者 = '';
    mockData.牝奴.当前命令 = '';
    mockData.牝奴.命令强度 = 0;
    mockData.牝奴.今日调教次数 = 0;
    mockData.牝奴.最近调教结算 = '';
    mockData.牝奴.羞名标签 = [];
    mockData.牝奴.调教记录 = [];
    mockData.道具.装备.玩家 = [];
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

  it('详情面板显示灵犀与蚀心语义，不暴露裸数字', async () => {
    const wrapper = mountGallery();
    await wrapper.findAll('.npc-entry')[0].trigger('click');
    const cells = wrapper.findAll('.detail-cell');
    expect(cells).toHaveLength(3);
    expect(cells[0].find('.cell-value').text()).toBe('暗生情愫');
    expect(cells[1].find('.cell-value').text()).toBe('心防松动');
    expect(cells[2].find('.cell-value').text()).toContain('进行中');
    expect(wrapper.find('.npc-detail-panel').text()).not.toContain('50');
    expect(wrapper.find('.npc-detail-panel').text()).not.toContain('30');
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


  // --- 心音册 ---
  it('无心音回响时显示沉浸式空状态', () => {
    const wrapper = mountGallery();
    expect(wrapper.find('.soul-archive-empty').exists()).toBe(true);
    expect(wrapper.find('.soul-archive-empty').text()).toContain('心音未落');
  });

  it('心音册显示已捕获心音并可聚焦NPC', async () => {
    mockData.系统.心音回响 = [
      { id: 'echo-1', npc: '白芷', text: '她离场后仍有一缕心绪未散。', stage: '动摇', result: '捕获', scene: '醉玉小筑', time: '午时', is_new: true },
    ];
    const wrapper = mountGallery();

    const echo = wrapper.find('.soul-archive-item');
    expect(echo.exists()).toBe(true);
    expect(echo.text()).toContain('白芷');
    expect(echo.text()).toContain('动摇');
    expect(echo.text()).toContain('醉玉小筑');
    expect(echo.text()).toContain('她离场后仍有一缕心绪未散。');

    await echo.trigger('click');
    expect(mockData.系统.当前聚焦心声NPC).toBe('白芷');
  });


  // --- 风声卷 ---
  it('无风声时显示沉浸式空状态', () => {
    const wrapper = mountGallery();
    expect(wrapper.find('.rumor-archive-empty').exists()).toBe(true);
    expect(wrapper.find('.rumor-archive-empty').text()).toContain('风声未至');
  });

  it('风声卷显示风声地点、状态与故事钩子，并可聚焦风声', async () => {
    mockData.系统.风声列表 = [
      { id: 'r1', 来源: '弟子传闻', 地点: '药庐', 子区域: '炼丹房', 相关NPC: ['白芷'], 紧急度: '中', 风声文本: '药庐丹炉彻夜未熄。', 故事钩子: '白芷屏退杂役', 状态: '未读' },
      { id: 'r2', 来源: '旧闻', 地点: '经阁', 子区域: '残卷室', 相关NPC: ['纪兰'], 紧急度: '低', 风声文本: '残卷室灯影已灭。', 故事钩子: '旧简归位', 状态: '已追查' },
    ];
    const wrapper = mountGallery();

    const rumors = wrapper.findAll('.rumor-archive-item');
    expect(rumors).toHaveLength(2);
    expect(rumors[0].text()).toContain('药庐');
    expect(rumors[0].text()).toContain('未读');
    expect(rumors[0].text()).toContain('药庐丹炉彻夜未熄。');
    expect(rumors[0].text()).toContain('白芷屏退杂役');

    await rumors[0].trigger('click');
    expect(mockData.系统.当前追查风声ID).toBe('r1');
    expect(mockData.系统.待处理交互).toEqual([]);
  });

  // --- 已解锁场景 ---
  it('场景志按当前、已解锁、核心地点分组展示', () => {
    mockData.场景.已解锁 = ['阴阳池', '经阁密室'];
    const wrapper = mountGallery();

    const groups = wrapper.findAll('.scene-archive-group');
    expect(groups).toHaveLength(3);
    expect(groups[0].find('.scene-group-title').text()).toContain('当前所在');
    expect(groups[0].text()).toContain('醉玉小筑');
    expect(groups[0].text()).toContain('前院');
    expect(groups[0].text()).toContain('半私密');
    expect(groups[1].find('.scene-group-title').text()).toContain('已解锁');
    expect(groups[1].text()).toContain('阴阳池');
    expect(groups[1].text()).toContain('经阁密室');
    expect(groups[2].find('.scene-group-title').text()).toContain('核心地点');
    expect(groups[2].text()).toContain('莲灯前苑');
  });

  it('无额外解锁场景时场景志仍显示当前场景与核心地点', () => {
    const wrapper = mountGallery();
    expect(wrapper.find('.scene-archive-empty').exists()).toBe(true);
    expect(wrapper.find('.scene-archive-empty').text()).toContain('尚无额外解锁');
    expect(wrapper.find('.scene-archive-group.is-current').text()).toContain('醉玉小筑');
    expect(wrapper.find('.scene-archive-group.is-core').text()).toContain('莲灯前苑');
  });


  // --- 筛选与折叠 ---
  it('可按NPC筛选心音册与风声卷', async () => {
    mockData.系统.心音回响 = [
      { id: 'echo-1', npc: '白芷', text: '白芷心音。', stage: '动摇', result: '捕获', scene: '醉玉小筑', time: '午时' },
      { id: 'echo-2', npc: '苏芸', text: '苏芸心音。', stage: '警戒', result: '锁闭', scene: '莲灯前苑', time: '晨时' },
    ];
    mockData.系统.风声列表 = [
      { id: 'r1', 来源: '弟子传闻', 地点: '药庐', 子区域: '', 相关NPC: ['白芷'], 风声文本: '白芷相关风声。', 故事钩子: '白芷线索', 状态: '未读' },
      { id: 'r2', 来源: '弟子传闻', 地点: '莲灯前苑', 子区域: '', 相关NPC: ['苏芸'], 风声文本: '苏芸相关风声。', 故事钩子: '苏芸线索', 状态: '未读' },
    ];
    const wrapper = mountGallery();

    await wrapper.find('[data-filter-npc="白芷"]').trigger('click');

    expect(wrapper.findAll('.soul-archive-item')).toHaveLength(1);
    expect(wrapper.find('.soul-archive-item').text()).toContain('白芷心音。');
    expect(wrapper.findAll('.rumor-archive-item')).toHaveLength(1);
    expect(wrapper.find('.rumor-archive-item').text()).toContain('白芷相关风声。');
  });

  it('可按风声状态筛选风声卷', async () => {
    mockData.系统.风声列表 = [
      { id: 'r1', 来源: '弟子传闻', 地点: '药庐', 风声文本: '未读风声。', 故事钩子: '新线索', 状态: '未读' },
      { id: 'r2', 来源: '旧闻', 地点: '经阁', 风声文本: '已追查风声。', 故事钩子: '旧线索', 状态: '已追查' },
    ];
    const wrapper = mountGallery();

    await wrapper.find('[data-filter-rumor-status="已追查"]').trigger('click');

    expect(wrapper.findAll('.rumor-archive-item')).toHaveLength(1);
    expect(wrapper.find('.rumor-archive-item').text()).toContain('已追查风声。');
  });

  it('可折叠与展开心音册', async () => {
    mockData.系统.心音回响 = [
      { id: 'echo-1', npc: '白芷', text: '白芷心音。', stage: '动摇', result: '捕获', scene: '醉玉小筑', time: '午时' },
    ];
    const wrapper = mountGallery();

    expect(wrapper.find('.soul-archive-item').exists()).toBe(true);
    await wrapper.find('[data-collapse-section="soul"]').trigger('click');
    expect(wrapper.find('.soul-archive-item').exists()).toBe(false);
    expect(wrapper.find('.soul-archive-section').classes()).toContain('is-collapsed');

    await wrapper.find('[data-collapse-section="soul"]').trigger('click');
    expect(wrapper.find('.soul-archive-item').exists()).toBe(true);
  });
  it('可点击场景志地点筛选心音册与风声卷，并再次点击取消', async () => {
    mockData.系统.心音回响 = [
      { id: 'echo-1', npc: '白芷', text: '醉玉心音。', stage: '动摇', result: '捕获', scene: '醉玉小筑', time: '午时' },
      { id: 'echo-2', npc: '苏芸', text: '药庐心音。', stage: '警戒', result: '锁闭', scene: '药庐', time: '未时' },
    ];
    mockData.系统.风声列表 = [
      { id: 'r1', 来源: '弟子传闻', 地点: '醉玉小筑', 子区域: '前院', 相关NPC: ['白芷'], 风声文本: '醉玉风声。', 故事钩子: '院中有痕', 状态: '未读' },
      { id: 'r2', 来源: '灵气异动', 地点: '药庐', 子区域: '丹房', 相关NPC: ['苏芸'], 风声文本: '药庐风声。', 故事钩子: '丹火未熄', 状态: '未读' },
    ];
    mockData.场景.已解锁 = ['药庐'];
    const wrapper = mountGallery();

    const currentScene = wrapper.find('[data-filter-scene="醉玉小筑"]');
    expect(currentScene.exists()).toBe(true);
    await currentScene.trigger('click');

    expect(wrapper.findAll('.soul-archive-item')).toHaveLength(1);
    expect(wrapper.find('.soul-archive-item').text()).toContain('醉玉心音。');
    expect(wrapper.findAll('.rumor-archive-item')).toHaveLength(1);
    expect(wrapper.find('.rumor-archive-item').text()).toContain('醉玉风声。');
    expect(mockData.系统.待处理交互).toEqual([]);

    await currentScene.trigger('click');
    expect(wrapper.findAll('.soul-archive-item')).toHaveLength(2);
    expect(wrapper.findAll('.rumor-archive-item')).toHaveLength(2);
  });

  // --- 已解锁剧情 ---
  it('无剧情时显示空状态', () => {
    const wrapper = mountGallery();
    const sections = wrapper.findAll('.section');
    const storySection = sections[4]; // 第五个section是剧情
    expect(storySection.find('.empty-state').exists()).toBe(true);
  });

  it('有剧情时显示剧情列表', () => {
    mockData.剧情.已解锁 = ['白芷幼弟的下落'];
    const wrapper = mountGallery();
    const sections = wrapper.findAll('.section');
    const storySection = sections[4];
    const items = storySection.findAll('.unlock-item');
    expect(items).toHaveLength(1);
    expect(items[0].find('.item-text').text()).toBe('白芷幼弟的下落');
  });

  // --- 区域标题 ---
  it('显示5个区域标题', () => {
    const wrapper = mountGallery();
    const headers = wrapper.findAll('.section-header');
    expect(headers).toHaveLength(5);
  });

  it('区域标题文字正确', () => {
    const wrapper = mountGallery();
    const headers = wrapper.findAll('.header-text').map(w => w.text());
    expect(headers).toEqual(['命魂录', '心音册', '风声卷', '场景志', '缘起簿']);
  });
  it('风声卷与场景志文本拥有显式可读色，避免按钮默认黑字泄漏', () => {
    expect(GalleryPageSource).toMatch(/\.rumor-archive-item\s*\{[\s\S]*?color:\s*(?:#(?:d9b48f|9c2c31|bfa17a);[\s\S]*?)?color:\s*color-mix/);
    expect(GalleryPageSource).toMatch(/\.rumor-text\s*\{[\s\S]*?color:\s*(?:#(?:d9b48f|9c2c31|bfa17a);[\s\S]*?)?color:\s*color-mix/);
    expect(GalleryPageSource).toMatch(/\.rumor-hook\s*\{[\s\S]*?color:\s*(?:#(?:d9b48f|9c2c31|bfa17a);[\s\S]*?)?color:\s*color-mix/);
    expect(GalleryPageSource).toMatch(/\.scene-archive-item\s*\{[\s\S]*?color:\s*(?:#(?:d9b48f|9c2c31|bfa17a);[\s\S]*?)?color:\s*color-mix/);
    expect(GalleryPageSource).toMatch(/\.scene-meta\s*\{[\s\S]*?color:\s*(?:#(?:d9b48f|9c2c31|bfa17a);[\s\S]*?)?color:\s*color-mix/);
  });
  it('筛选玉签、场景志与空状态拥有因果秘录卷宗质感', () => {
    expect(GalleryPageSource).toMatch(/\.archive-filter-bar\s*\{[\s\S]*?position:\s*relative/);
    expect(GalleryPageSource).toMatch(/\.archive-filter-bar::before\s*\{[\s\S]*?radial-gradient/);
    expect(GalleryPageSource).toMatch(/\.filter-chip\s*\{[\s\S]*?box-shadow:\s*inset/);
    expect(GalleryPageSource).toMatch(/&::after\s*\{[\s\S]*?linear-gradient/);
    expect(GalleryPageSource).toMatch(/&::before\s*\{[\s\S]*?radial-gradient/);
    expect(GalleryPageSource).toMatch(/&::before\s*\{[\s\S]*?radial-gradient/);
  });
  it('筛选按钮、心音卷与场景志文本提供不依赖变量链的稳定兜底色', () => {
    expect(GalleryPageSource).not.toContain('--hh-text-highlight');
    expect(GalleryPageSource).toMatch(/\.filter-chip\s*\{[\s\S]*?color:\s*#d9b48f;[\s\S]*?color:\s*var\(--hh-text-primary,\s*#d9b48f\)/);
    expect(GalleryPageSource).toMatch(/&\.active\s*\{[\s\S]*?color:\s*#9c2c31;[\s\S]*?color:\s*var\(--hh-accent,\s*#9c2c31\)/);
    expect(GalleryPageSource).toMatch(/\.soul-archive-item\s*\{[\s\S]*?color:\s*#d9b48f;[\s\S]*?color:\s*var\(--hh-text-primary,\s*#d9b48f\)/);
    expect(GalleryPageSource).toMatch(/\.echo-text\s*\{[\s\S]*?color:\s*#d9b48f;[\s\S]*?color:\s*var\(--hh-text-primary,\s*#d9b48f\)/);
    expect(GalleryPageSource).toMatch(/\.scene-group-title\s*\{[\s\S]*?color:\s*#9c2c31;[\s\S]*?color:\s*var\(--hh-accent,\s*#9c2c31\)/);
    expect(GalleryPageSource).toMatch(/\.scene-name\s*\{[\s\S]*?color:\s*#d9b48f;[\s\S]*?color:\s*var\(--hh-text-primary,\s*#d9b48f\)/);
    expect(GalleryPageSource).toMatch(/\.scene-meta\s*\{[\s\S]*?color:\s*#bfa17a;[\s\S]*?color:\s*var\(--hh-text-secondary,\s*#bfa17a\)/);
  });

  it('心音册与风声卷呈现因果秘录时间线归档感', () => {
    mockData.系统.心音回响 = [
      { id: 'echo-time-1', npc: '白芷', text: '午后残响。', stage: '动摇', result: '捕获', scene: '醉玉小筑', time: '午时' },
    ];
    mockData.系统.风声列表 = [
      { id: 'rumor-time-1', 来源: '弟子传闻', 地点: '莲灯前苑', 子区域: '石阶', 相关NPC: ['白芷'], 风声文本: '石阶留有湿痕。', 故事钩子: '有人刚刚离开', 状态: '未读' },
    ];

    const wrapper = mountGallery();

    expect(wrapper.find('.soul-timeline-mark').text()).toContain('午时');
    expect(wrapper.find('.soul-timeline-scene').text()).toContain('醉玉小筑');
    expect(wrapper.find('.rumor-timeline-mark').text()).toContain('弟子传闻');
    expect(wrapper.find('.rumor-timeline-scene').text()).toContain('莲灯前苑 · 石阶');
    expect(GalleryPageSource).toMatch(/\.soul-archive-list\.timeline-archive/);
    expect(GalleryPageSource).toMatch(/\.timeline-archive::before\s*\{[\s\S]*?linear-gradient/);
    expect(GalleryPageSource).toMatch(/\.timeline-dot\s*\{[\s\S]*?border-radius:\s*50%/);
    expect(GalleryPageSource).toMatch(/\.timeline-meta\s*\{[\s\S]*?color:\s*#bfa17a;[\s\S]*?color:\s*var\(--hh-text-secondary,\s*#bfa17a\)/);
  });

  // --- P2 烙名录 ---
  it('牝奴期将图鉴入口替换为烙名录，不渲染P1命魂录和商城语义', () => {
    mockData.系统.阶段 = '牝奴期';
    mockData.牝奴.当前日课 = '廊前听令';
    mockData.牝奴.当前命令 = '当众应名';
    mockData.牝奴.命令强度 = 66;
    mockData.牝奴.当前支配者 = '柳素衣';
    mockData.牝奴.羞名标签 = ['铃前失仪'];
    const wrapper = mountGallery();

    expect(wrapper.find('.p2-brand-ledger').exists()).toBe(true);
    expect(wrapper.text()).toContain('宗门烙名录');
    expect(wrapper.text()).toContain('羞名册');
    expect(wrapper.text()).toContain('朱批录');
    expect(wrapper.text()).toContain('风声牵丝');
    expect(wrapper.text()).toContain('承命痕');
    expect(wrapper.text()).toContain('铃前失仪');
    expect(wrapper.text()).toContain('当众应名');
    expect(wrapper.text()).not.toContain('命魂录');
    expect(wrapper.text()).not.toContain('商城');
    expect(wrapper.text()).not.toContain('购买');
    expect(wrapper.text()).not.toContain('灵石');
  });

  it('牝奴期烙名录从日课缺装派生羞名与惩戒朱批', () => {
    mockData.系统.阶段 = '牝奴期';
    mockData.牝奴.当前日课 = '廊前听令';
    const wrapper = mountGallery();

    expect(wrapper.text()).toContain('拒铃迟令');
    expect(wrapper.text()).toContain('改派「廊前三巡听铃课」');
    expect(wrapper.text()).toContain('须扣 牝铃 / 听命耳坠');
  });

  it('牝奴期烙名录展示羞名风声并可聚焦承接', async () => {
    mockData.系统.阶段 = '牝奴期';
    mockData.系统.风声列表 = [
      {
        id: 'p2-rumor-1',
        来源: '公开示众',
        地点: '听风廊',
        子区域: '回廊',
        相关NPC: ['柳素衣'],
        风声文本: '听说她今日被记作铃前失仪。',
        故事钩子: '听风复名留下弟子低语',
        状态: '未读',
        羞名等级: '挂牌',
        羞名标签: ['铃前失仪'],
        反噬日课: '听风复名',
        是否可承接: true,
      },
    ];
    const wrapper = mountGallery();

    const rumor = wrapper.find('.p2-rumor-thread');
    expect(rumor.exists()).toBe(true);
    expect(rumor.text()).toContain('挂牌');
    expect(rumor.text()).toContain('听风廊 · 回廊');
    expect(rumor.text()).toContain('听说她今日被记作铃前失仪。');

    await rumor.trigger('click');
    expect(mockData.系统.当前追查风声ID).toBe('p2-rumor-1');
    expect(mockData.系统.待处理交互).toEqual([]);
  });

  it('牝奴期烙名录展示调教记录与已扣法器作为承命痕', () => {
    mockData.系统.阶段 = '牝奴期';
    mockData.牝奴.调教记录 = [
      { id: 'train-1', 时辰: '午时', 支配者: '纪兰', 摘要: '纪兰在听风廊令她复述羞名。', 羞名等级: '传开' },
    ];
    mockData.道具.装备.玩家 = ['牝铃'];
    const wrapper = mountGallery();

    expect(wrapper.findAll('.p2-obedience-traces .p2-brand-entry')).toHaveLength(2);
    expect(wrapper.text()).toContain('纪兰在听风廊令她复述羞名。');
    expect(wrapper.text()).toContain('牝铃');
    expect(wrapper.text()).toContain('己身已扣');
  });
});
