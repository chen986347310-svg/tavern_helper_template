// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { reactive } from 'vue';
import DebugPanel from './DebugPanel.vue';
import { useDebug, __resetDebugState } from '../composables/useDebug';

function createData(灵石 = 0) {
  return reactive({
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石, 已使用阵法: false, 时辰: '晨时', 当前场景: '莲灯前苑', 待处理交互: [], 风声列表: [], 当前追查风声ID: '', 心音回响: [], 当前聚焦心声NPC: '', 场景上下文: { 地点: '莲灯前苑', 子区域: '', 场景来源: '核心地点', 公开度: '公开', 在场NPC: [], NPC活动: {}, 氛围: [], 故事钩子: [], 特殊事件: '' } },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      上次支配者: '',
      支配次数: { 白芷: 0, 苏芸: 0, 纪兰: 0, 沈月秋: 0, 柳素衣: 0 },
      改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
    },
    NPC: {
      白芷: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 心声探测态: '无波动' },
      苏芸: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 心声探测态: '无波动' },
      纪兰: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 心声探测态: '无波动' },
      沈月秋: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 心声探测态: '无波动' },
      柳素衣: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 心声探测态: '无波动' },
    },
    道具: { 拥有: {}, 装备: { 玩家: [], 白芷: [], 苏芸: [], 纪兰: [], 沈月秋: [], 柳素衣: [] }, 已生效效果: [] },
    场景: { 已解锁: [] },
    剧情: { 已解锁: [] },
  });
}

const mockStore = reactive({ data: createData(1000) });

vi.mock('../store', () => ({
  useDataStore: () => mockStore,
}));

describe('DebugPanel', () => {
  beforeEach(() => {
    __resetDebugState();
    mockStore.data = createData(1000) as typeof mockStore.data;
    document.body.innerHTML = '';
  });

  it('MVU轮询替换data后，灵石输入仍写入最新store.data', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    const oldData = mockStore.data;
    mockStore.data = createData(0) as typeof mockStore.data;
    await flushPromises();

    const inputs = document.body.querySelectorAll<HTMLInputElement>('.debug-input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
    inputs[1].value = '7777';
    inputs[1].dispatchEvent(new Event('input'));
    await flushPromises();

    expect(mockStore.data.系统.灵石).toBe(7777);
    expect(oldData.系统.灵石).toBe(1000);
    wrapper.unmount();
  });

  it('以悬浮窗打开，不渲染阻塞前端操作的全屏遮罩', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    expect(document.body.querySelector('.debug-overlay')).toBeNull();
    const panel = document.body.querySelector<HTMLElement>('.debug-panel');
    expect(panel).toBeTruthy();
    expect(panel!.style.position).toBe('fixed');
    expect(panel!.style.left).not.toBe('');
    expect(panel!.style.top).not.toBe('');
    wrapper.unmount();
  });

  it('待处理交互为空时显示可读空状态', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    expect(document.body.querySelector('.debug-pending-empty')?.textContent).toContain('待处理交互为空');
    wrapper.unmount();
  });

  it('以结构化方式显示待处理交互队列', async () => {
    mockStore.data.系统.待处理交互 = [
      {
        类型: '装备道具',
        目标: '白芷',
        道具: '阴蒂环',
        道具显示名: '命门欲环',
        数量: 1,
        时辰: '午时',
        场景: '醉玉小筑',
        地点: '醉玉小筑',
        子区域: '后廊',
        AI短提示: '环扣会让步态与心音一起失衡。',
      },
      {
        类型: '追查风声',
        目标: '苏芸',
        道具: '',
        数量: 1,
        风声ID: 'rumor-1',
        故事钩子: '丹炉彻夜未熄',
        地点: '药庐',
        子区域: '炼丹房',
      },
    ] as any;
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    const queue = document.body.querySelector('.debug-pending-list');
    expect(queue).toBeTruthy();
    expect(queue!.textContent).toContain('#1');
    expect(queue!.textContent).toContain('装备道具');
    expect(queue!.textContent).toContain('白芷');
    expect(queue!.textContent).toContain('命门欲环');
    expect(queue!.textContent).toContain('阴蒂环');
    expect(queue!.textContent).toContain('环扣会让步态与心音一起失衡');
    expect(queue!.textContent).toContain('#2');
    expect(queue!.textContent).toContain('追查风声');
    expect(queue!.textContent).toContain('rumor-1');
    expect(queue!.textContent).toContain('丹炉彻夜未熄');
    wrapper.unmount();
  });

  it('拖动标题栏会更新悬浮窗位置', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    const panel = document.body.querySelector<HTMLElement>('.debug-panel')!;
    const header = document.body.querySelector<HTMLElement>('.debug-header')!;
    const initialLeft = panel.style.left;
    const initialTop = panel.style.top;

    header.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 80, bubbles: true }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 140, clientY: 120, bubbles: true }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await flushPromises();

    expect(panel.style.left).not.toBe(initialLeft);
    expect(panel.style.top).not.toBe(initialTop);
    wrapper.unmount();
  });

  it('提供 v4 场景上下文调试能力并能设置在场 NPC', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    expect(document.body.textContent).toContain('当前场景');
    expect(document.body.textContent).toContain('在场NPC');
    const presentInput = Array.from(document.body.querySelectorAll<HTMLInputElement>('.debug-input')).find(input => input.placeholder === '白芷,苏芸');
    expect(presentInput).toBeTruthy();
    presentInput!.value = '白芷,苏芸';
    presentInput!.dispatchEvent(new Event('input'));
    await flushPromises();

    expect(mockStore.data.系统.场景上下文.在场NPC).toEqual(['白芷', '苏芸']);
    wrapper.unmount();
  });

  it('显示世界运行核心的时间状态、欲海状态和最近事件记录', async () => {
    (mockStore.data.系统 as any).时间状态 = {
      当前日: 3,
      时段进度: 2,
      最近耗时: '一个时辰',
      最近结算原因: '追查风声推进一个时段',
      最近事件类型: '追查风声',
      是否过夜: false,
    };
    (mockStore.data.系统 as any).欲海状态 = {
      搜寻进度: 36,
      警戒等级: '微动',
      遮蔽剩余时段: 2,
      遮蔽来源: '欲海遮蔽符',
      最近暴露原因: '遮蔽生效，本次NSFW只留下极低欲海波纹',
      已被定位: false,
    };
    (mockStore.data.剧情 as any).事件记录 = [
      {
        id: 'event_3_酉时_追查风声',
        类型: '追查风声',
        摘要: '玩家在听风廊追查旧誓风声。',
        日: 3,
        时辰: '酉时',
        地点: '听风廊',
        涉及NPC: ['白芷'],
        公开度: '半私密',
        后果标签: ['风声追查'],
        已生成风声: false,
      },
    ];

    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    expect(document.body.textContent).toContain('时间状态');
    expect(document.body.textContent).toContain('当前日');
    expect(document.body.textContent).toContain('一个时辰');
    expect(document.body.textContent).toContain('追查风声推进一个时段');
    expect(document.body.textContent).toContain('欲海状态');
    expect(document.body.textContent).toContain('搜寻进度');
    expect(document.body.textContent).toContain('36');
    expect(document.body.textContent).toContain('欲海遮蔽符');
    expect(document.body.textContent).toContain('最近事件记录');
    expect(document.body.textContent).toContain('玩家在听风廊追查旧誓风声');
    wrapper.unmount();
  });

  it('显示牝奴期运行字段和最近调教记录', async () => {
    mockStore.data.系统.阶段 = '牝奴期';
    Object.assign(mockStore.data.牝奴 as any, {
      当前日课: '阴阳池验身',
      当前支配者: '沈月秋',
      当前命令: '抬首应名，不准遮住牝印',
      命令强度: 55,
      今日调教次数: 1,
      最近调教结算: '沈月秋在阴阳池执行阴阳池验身。',
      调教记录: [
        {
          id: 'p2_1',
          时辰: '酉时',
          支配者: '沈月秋',
          摘要: '阴阳池验身后牝印发热。',
          羞名等级: '传开',
        },
      ],
    });

    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    expect(document.body.textContent).toContain('牝奴期运行');
    expect(document.body.textContent).toContain('阴阳池验身');
    expect(document.body.textContent).toContain('沈月秋');
    expect(document.body.textContent).toContain('抬首应名，不准遮住牝印');
    expect(document.body.textContent).toContain('55');
    expect(document.body.textContent).toContain('今日调教 1');
    expect(document.body.textContent).toContain('沈月秋在阴阳池执行阴阳池验身');
    expect(document.body.textContent).toContain('最近调教记录');
    expect(document.body.textContent).toContain('阴阳池验身后牝印发热');
    expect(document.body.textContent).toContain('传开');
    wrapper.unmount();
  });

  it('显示牝奴羞名标签与 P2 风声元数据', async () => {
    mockStore.data.系统.阶段 = '牝奴期';
    (mockStore.data.牝奴 as any).羞名标签 = ['听命', '示众'];
    (mockStore.data.系统 as any).风声列表 = [
      {
        id: 'p2_shame_1',
        来源: '公开示众',
        地点: '莲灯前苑',
        风声文本: '廊下有人低声念起新的羞名。',
        状态: '未读',
        凝视来源: '执事记录',
        羞名等级: '挂牌',
        羞名标签: ['听命', '示众'],
        反噬日课: '午后点名',
        是否可承接: true,
      },
      {
        id: 'normal_1',
        来源: '弟子传闻',
        地点: '药庐',
        风声文本: '普通风声。',
        状态: '未读',
      },
    ];

    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    expect(document.body.textContent).toContain('羞名标签');
    expect(document.body.textContent).toContain('听命,示众');
    expect(document.body.textContent).toContain('P2风声 1');
    expect(document.body.textContent).toContain('公开示众');
    expect(document.body.textContent).toContain('挂牌');
    expect(document.body.textContent).toContain('执事记录');
    expect(document.body.textContent).toContain('莲灯前苑');
    expect(document.body.textContent).toContain('p2_shame_1');
    expect(document.body.textContent).not.toContain('normal_1');
    wrapper.unmount();
  });

  it('调试按钮能生成测试场景并追加 NPC 心音回响', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    const buttons = Array.from(document.body.querySelectorAll<HTMLButtonElement>('.debug-mini-btn'));
    buttons.find(button => button.textContent === '生成测试场景')!.click();
    await flushPromises();
    expect(mockStore.data.系统.当前场景).toBe('调试幻境');
    expect(mockStore.data.系统.场景上下文.在场NPC).toEqual(['白芷', '苏芸']);

    buttons.find(button => button.textContent === '追加心音')!.click();
    await flushPromises();
    expect(mockStore.data.NPC.白芷.soul_whisper?.is_revealed).toBe(true);
    expect(mockStore.data.NPC.白芷.心声探测态).toBe('已捕获');
    expect(mockStore.data.系统.当前聚焦心声NPC).toBe('白芷');
    expect(mockStore.data.系统.心音回响).toHaveLength(1);
    expect(mockStore.data.系统.心音回响[0]?.npc).toBe('白芷');
    expect(mockStore.data.NPC.白芷.状态).toBe('进行中');
    wrapper.unmount();
  });


  it('注入反震：设置心声探测态为反震并写入反震心音回响', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    const buttons = Array.from(document.body.querySelectorAll<HTMLButtonElement>('.debug-mini-btn'));
    buttons.find(button => button.textContent === '注入反震')!.click();
    await flushPromises();

    expect(mockStore.data.NPC.白芷.心声探测态).toBe('反震');
    expect(mockStore.data.NPC.白芷.soul_whisper?.is_revealed).toBe(false);
    expect(mockStore.data.系统.心音回响).toHaveLength(1);
    expect(mockStore.data.系统.心音回响[0]?.result).toBe('反震');
    expect(mockStore.data.系统.心音回响[0]?.npc).toBe('白芷');
    wrapper.unmount();
  });

  it('注入锁闭：设置心声探测态为锁闭并写入锁闭心音回响', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    const buttons = Array.from(document.body.querySelectorAll<HTMLButtonElement>('.debug-mini-btn'));
    buttons.find(button => button.textContent === '注入锁闭')!.click();
    await flushPromises();

    expect(mockStore.data.NPC.白芷.心声探测态).toBe('锁闭');
    expect(mockStore.data.NPC.白芷.soul_whisper?.is_revealed).toBe(false);
    expect(mockStore.data.系统.心音回响).toHaveLength(1);
    expect(mockStore.data.系统.心音回响[0]?.result).toBe('锁闭');
    expect(mockStore.data.系统.当前聚焦心声NPC).toBe('白芷');
    wrapper.unmount();
  });
});
