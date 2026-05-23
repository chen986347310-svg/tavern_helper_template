// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import NpcCard from './NpcCard.vue';

function requireAttribute(value: string | undefined, name: string): string {
  expect(value, `${name} attribute should exist`).toBeTypeOf('string');
  return value as string;
}
function createNpcData(overrides: Partial<{ 好感度: number; 攻略值: number; 粘滞计数: number; 状态: string; 心声探测态: '无波动' | '可窥探' | '已捕获' | '反震' | '锁闭'; soul_whisper: { text: string; stage: '警戒' | '动摇' | '沉沦'; is_revealed: boolean } }> = {}) {
  return {
    好感度: 0,
    攻略值: 0,
    粘滞计数: 0,
    状态: '未开始' as string,
    心声探测态: '无波动' as const,
    ...overrides,
  };
}

describe('NpcCard', () => {
  it('显示NPC名号', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData() },
    });
    expect(wrapper.find('.strip-name').text()).toBe('白芷');
  });

  it('显示状态文字', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '进行中' }) },
    });
    expect(wrapper.find('.strip-status').text()).toContain('进行中');
  });

  it('进行中折叠态显示灵犀命魂语义', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 75, 状态: '进行中' }) },
    });
    expect(wrapper.find('.npc-disk-collapsed').attributes('aria-label')).toBe('灵犀命魂 灵犀相照');
    expect(wrapper.find('.favor-value').text()).toBe('灵犀相照');
  });

  it('折叠态命魂光晕按好感度挂载视觉契约', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 60, 状态: '进行中' }) },
    });
    const soulDisk = wrapper.find('.npc-disk-collapsed');
    expect(soulDisk.exists()).toBe(true);
    expect(soulDisk.attributes('data-favor-tier')).toBe('flowing');
    expect(wrapper.find('.collapsed-soul-aura').exists()).toBe(true);
    expect(wrapper.find('.mini-ring').exists()).toBe(false);
  });

  it('展开区域显示灵犀和道心状态语', async () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 45, 攻略值: 30, 状态: '进行中' }), expanded: true },
    });
    const expandValues = wrapper.findAll('.expand-value');
    expect(expandValues[0].text()).toBe('暗生情愫');
    expect(expandValues[1].text()).toBe('心防松动');
  });

  it('状态=未开始 → locked class', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '未开始' }) },
    });
    expect(wrapper.find('.npc-strip').classes()).toContain('locked');
  });

  it('状态=进行中 → active class', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '进行中' }) },
    });
    expect(wrapper.find('.npc-strip').classes()).toContain('active');
  });

  it('状态=已完成 → completed class', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '已完成' }) },
    });
    expect(wrapper.find('.npc-strip').classes()).toContain('completed');
  });

  it('进行中卡片点击触发事件', async () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '进行中' }) },
    });
    await wrapper.find('.npc-strip').trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('toggleExpand')).toHaveLength(1);
  });

  it('未开始卡片不响应点击', async () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '未开始' }) },
    });
    await wrapper.find('.npc-strip').trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('好感度=0时折叠命魂进入沉寂态', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 0, 状态: '进行中' }) },
    });
    expect(wrapper.find('.npc-disk-collapsed').attributes('data-favor-tier')).toBe('dormant');
    expect(wrapper.find('.collapsed-soul-aura').exists()).toBe(true);
  });

  it('好感度=100时折叠命魂进入共鸣态', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 100, 状态: '进行中' }) },
    });
    expect(wrapper.find('.npc-disk-collapsed').attributes('data-favor-tier')).toBe('resonant');
    expect(wrapper.find('.collapsed-soul-aura').exists()).toBe(true);
  });

  it('展开区域渲染阴阳命轮：外环灵犀，内环蚀心', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 45, 攻略值: 30, 状态: '进行中' }), expanded: true },
    });
    expect(wrapper.find('.dual-ring').exists()).toBe(true);
    expect(wrapper.find('.dual-ring .ring-value.favor.outer-ring').attributes('stroke-dashoffset')).toBe('89.85');
    expect(wrapper.find('.dual-ring .ring-value.progress.inner-ring').attributes('stroke-dashoffset')).toBe('87.96');
  });

  it('同化态命轮挂载深红流光视觉契约', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '沈月秋', data: createNpcData({ 好感度: 100, 攻略值: 100, 状态: '已完成' }), expanded: true },
    });

    const panel = wrapper.find('.dual-ring-panel');
    expect(panel.classes()).toContain('destiny-assimilated');
    expect(panel.attributes('data-effect')).toBe('destiny-assimilated');
    expect(wrapper.find('.dual-ring .ring-value.favor.outer-ring').exists()).toBe(true);
    expect(wrapper.find('.dual-ring .ring-value.progress.inner-ring').exists()).toBe(true);
  });

  it('攻略值达到100时命轮进入同化态', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '沈月秋', data: createNpcData({ 好感度: 100, 攻略值: 100, 状态: '已完成' }), expanded: true },
    });
    expect(wrapper.find('.dual-ring-panel').classes()).toContain('destiny-assimilated');
  });

  it('expanded=true 时展开区域有 expanded class', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '进行中' }), expanded: true },
    });
    expect(wrapper.find('.card-expand').classes()).toContain('expanded');
  });

  it('变量回流后显示已揭示心音残片', () => {
    const wrapper = mount(NpcCard, {
      props: {
        npc名: '白芷',
        data: createNpcData({
          状态: '进行中',
          soul_whisper: { text: '他方才的目光，竟让我道心微乱。', stage: '动摇', is_revealed: true },
        }),
        expanded: true,
      },
    });
    expect(wrapper.find('.soul-whisper').exists()).toBe(true);
    expect(wrapper.find('.whisper-label').text()).toBe('心音残片');
    expect(wrapper.find('.whisper-text').text()).toBe('他方才的目光，竟让我道心微乱。');
    expect(wrapper.find('.soul-whisper').attributes('data-stage')).toBe('动摇');
  });

  it('未揭示心音不在前端提前显示', () => {
    const wrapper = mount(NpcCard, {
      props: {
        npc名: '白芷',
        data: createNpcData({
          状态: '进行中',
          soul_whisper: { text: '此句必须等待 AI 下一楼层揭示。', stage: '警戒', is_revealed: false },
        }),
        expanded: true,
      },
    });
    expect(wrapper.find('.soul-whisper').exists()).toBe(false);
  });
  it('装备列表正确渲染', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '进行中' }), 装备: ['铃铛项圈', '眼罩'], expanded: true },
    });
    const items = wrapper.findAll('.equip-item');
    expect(items).toHaveLength(2);
    expect(items[0].text()).toBe('铃铛项圈');
  });

  it('无装备时显示暂无装备', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '进行中' }), 装备: [], expanded: true },
    });
    expect(wrapper.find('.equip-empty').text()).toBe('未供法器');
  });

  it('进行中头像src为正道版', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '苏芸', data: createNpcData({ 状态: '进行中' }) },
    });
    const img = wrapper.find('.avatar-img');
    if (img.exists()) {
      expect(decodeURIComponent(requireAttribute(img.attributes('src'), 'src'))).toContain('苏芸.png');
      expect(decodeURIComponent(requireAttribute(img.attributes('src'), 'src'))).not.toContain('fallen');
    }
  });

  it('已完成头像src为仙奴版', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '苏芸', data: createNpcData({ 状态: '已完成' }) },
    });
    const img = wrapper.find('.avatar-img');
    if (img.exists()) {
      expect(decodeURIComponent(requireAttribute(img.attributes('src'), 'src'))).toContain('苏芸_fallen.png');
    }
  });

  it('图片加载失败时回退到首字占位符', async () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '进行中' }) },
    });
    const img = wrapper.find('.avatar-img');
    if (img.exists()) {
      await img.trigger('error');
      expect(wrapper.find('.avatar-fallback').exists()).toBe(true);
      expect(wrapper.find('.avatar-fallback').text()).toBe('白');
    } else {
      // No img means fallback is already shown
      expect(wrapper.find('.avatar-fallback').exists()).toBe(true);
    }
  });

  it('展开时文字区淡出', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '进行中' }), expanded: true },
    });
    expect(wrapper.find('.text-zone').classes()).toContain('text-fade');
  });
  it('展开命轮挂载图腾残片与中心太极高级视觉契约', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 45, 攻略值: 30, 状态: '进行中' }), expanded: true },
    });

    const panel = wrapper.find('.dual-ring-panel');
    expect(panel.attributes('data-ring-style')).toBe('totem');
    expect(panel.attributes('data-favor-percent')).toBe('45');
    expect(panel.attributes('data-conquest-percent')).toBe('30');
    expect(wrapper.find('.ring-totem-shards').exists()).toBe(true);
    expect(wrapper.find('.destiny-taiji-core').exists()).toBe(true);
    expect(wrapper.find('.dual-ring .ring-value.favor.outer-ring').exists()).toBe(true);
    expect(wrapper.find('.dual-ring .ring-value.progress.inner-ring').exists()).toBe(true);
  });

  it('可窥探的进行中命轮呈现灵气潮汐诱导态', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 45, 攻略值: 45, 状态: '进行中', 心声探测态: '可窥探' }), expanded: true },
    });

    const panel = wrapper.find('.dual-ring-panel');
    expect(panel.classes()).toContain('npc-disk-unstable');
    expect(panel.attributes('data-tide')).toBe('unstable');
    expect(wrapper.find('.soul-glyph-fragments').exists()).toBe(true);
  });

  it('无波动命轮不呈现灵气潮汐诱导态', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 45, 攻略值: 45, 状态: '进行中', 心声探测态: '无波动' }), expanded: true },
    });

    const panel = wrapper.find('.dual-ring-panel');
    expect(panel.classes()).not.toContain('npc-disk-unstable');
    expect(panel.attributes('data-tide')).toBeUndefined();
  });

  it('未开始命轮不呈现灵气潮汐诱导态', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 0, 攻略值: 0, 状态: '未开始' }), expanded: true },
    });

    const panel = wrapper.find('.dual-ring-panel');
    expect(panel.classes()).not.toContain('npc-disk-unstable');
    expect(panel.attributes('data-tide')).toBeUndefined();
  });



  it('命盘挂载心声探测态视觉契约', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 45, 攻略值: 35, 状态: '进行中', 心声探测态: '已捕获' } as any), expanded: true },
    });

    const panel = wrapper.find('.dual-ring-panel');
    expect(panel.attributes('data-probe-state')).toBe('已捕获');
    expect(panel.classes()).toContain('probe-已捕获');
  });

  it('灵识锁定时渲染因果红线视觉节点', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 50, 攻略值: 45, 状态: '进行中' }), expanded: true, soulLocked: true },
    });

    expect(wrapper.find('.soul-thread-line').exists()).toBe(true);
    expect(wrapper.find('.soul-thread-line').attributes('aria-hidden')).toBe('true');
  });
  it('灵识锁定时命轮显示红线锁定契约与待处理标识', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 50, 攻略值: 45, 状态: '进行中' }), expanded: true, soulLocked: true },
    });

    const panel = wrapper.find('.dual-ring-panel');
    expect(panel.classes()).toContain('soul-locked');
    expect(panel.attributes('data-pending')).toBe('soul-whisper');
    const mark = wrapper.find('.soul-pending-mark');
    expect(mark.text()).toBe('灵识窥伺');
    expect(mark.classes()).toContain('soul-pending-mark');
  });

  it('高心防目标点击命轮时显示灵识反噬提示并仍记录事件', async () => {
    const wrapper = mount(NpcCard, {
      props: {
        npc名: '白芷',
        data: createNpcData({
          好感度: 35,
          攻略值: 20,
          状态: '进行中',
          soul_whisper: { text: '', stage: '警戒', is_revealed: false },
        }),
        expanded: true,
      },
    });

    await wrapper.find('.dual-ring-panel').trigger('click');

    expect(wrapper.find('.dual-ring-panel').classes()).toContain('soul-backlash');
    const backlashHint = wrapper.find('.backlash-hint');
    expect(backlashHint.text()).toContain('心防反震');
    expect(backlashHint.classes()).toContain('backlash-hint');
    expect(wrapper.emitted('soulWhisper')).toHaveLength(1);
  });

  it('未开始目标点击命轮不显示反噬也不记录灵识事件', async () => {
    const wrapper = mount(NpcCard, {
      props: {
        npc名: '白芷',
        data: createNpcData({
          攻略值: 10,
          状态: '未开始',
          soul_whisper: { text: '', stage: '警戒', is_revealed: false },
        }),
        expanded: true,
      },
    });

    await wrapper.find('.dual-ring-panel').trigger('click');

    expect(wrapper.find('.dual-ring-panel').classes()).not.toContain('soul-backlash');
    expect(wrapper.find('.backlash-hint').exists()).toBe(false);
    expect(wrapper.emitted('soulWhisper')).toBeUndefined();
  });

  it('好感度变更时外环触发墨迹扩散动画class', async () => {
    const wrapper = mount(NpcCard, {
      props: {
        npc名: '白芷',
        data: { 好感度: 30, 攻略值: 0, 粘滞计数: 0, 状态: '进行中', 心声探测态: '无波动', 当前场景: '莲灯前苑', soul_whisper: {} },
      },
    });

    await wrapper.setProps({ npc名: '白芷', data: { 好感度: 50, 攻略值: 0, 粘滞计数: 0, 状态: '进行中', 心声探测态: '无波动', 当前场景: '莲灯前苑', soul_whisper: {} } });
    await flushPromises();

    const outerRing = wrapper.find('.outer-ring');
    expect(outerRing.classes()).toContain('ink-burst');
  });
});