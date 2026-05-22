// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NpcCard from './NpcCard.vue';

function requireAttribute(value: string | undefined, name: string): string {
  expect(value, `${name} attribute should exist`).toBeTypeOf('string');
  return value as string;
}
function createNpcData(overrides: Partial<{ 好感度: number; 攻略值: number; 粘滞计数: number; 状态: string; soul_whisper: { text: string; stage: '警戒' | '动摇' | '沉沦'; is_revealed: boolean } }> = {}) {
  return {
    好感度: 0,
    攻略值: 0,
    粘滞计数: 0,
    状态: '未开始' as string,
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

  it('进行中状态显示灵犀状态语', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 75, 状态: '进行中' }) },
    });
    expect(wrapper.find('.favor-value').text()).toBe('灵犀相照');
  });

  it('迷你灵犀环弧度匹配好感度', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 60, 状态: '进行中' }) },
    });
    const ringValue = wrapper.find('.mini-ring .ring-value.favor');
    expect(ringValue.attributes('stroke-dashoffset')).toBe('25.13');
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

  it('好感度=0时迷你灵犀环为空', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 0, 状态: '进行中' }) },
    });
    expect(wrapper.find('.mini-ring .ring-value.favor').attributes('stroke-dashoffset')).toBe('62.83');
  });

  it('好感度=100时迷你灵犀环填满', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 100, 状态: '进行中' }) },
    });
    expect(wrapper.find('.mini-ring .ring-value.favor').attributes('stroke-dashoffset')).toBe('0.00');
  });

  it('展开区域渲染双环命轮', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 45, 攻略值: 30, 状态: '进行中' }), expanded: true },
    });
    expect(wrapper.find('.dual-ring').exists()).toBe(true);
    expect(wrapper.find('.dual-ring .ring-value.favor').attributes('stroke-dashoffset')).toBe('69.11');
    expect(wrapper.find('.dual-ring .ring-value.progress').attributes('stroke-dashoffset')).toBe('114.35');
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
    expect(wrapper.find('.backlash-hint').text()).toBe('心防反震');
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
});
