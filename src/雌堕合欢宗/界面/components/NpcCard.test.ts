// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NpcCard from './NpcCard.vue';

function createNpcData(overrides: Partial<{ 好感度: number; 攻略值: number; 粘滞计数: number; 状态: string }> = {}) {
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
    expect(wrapper.find('.npc-name').text()).toBe('白芷');
  });

  it('显示状态文字', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '进行中' }) },
    });
    expect(wrapper.find('.npc-status').text()).toContain('进行中');
  });

  it('显示好感度数值', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 75 }) },
    });
    expect(wrapper.find('.progress-value').text()).toBe('75');
  });

  it('好感度条宽度匹配百分比', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 60 }) },
    });
    const barFill = wrapper.find('.bar-fill');
    expect(barFill.attributes('style')).toContain('width: 60%');
  });

  it('显示攻略值和粘滞计数', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '苏芸', data: createNpcData({ 攻略值: 45, 粘滞计数: 2 }) },
    });
    const statValues = wrapper.findAll('.stat-value');
    expect(statValues[0].text()).toBe('45'); // 攻略
    expect(statValues[1].text()).toBe('2');  // 粘滞
  });

  it('状态=未开始 → locked class', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '未开始' }) },
    });
    expect(wrapper.find('.npc-card').classes()).toContain('locked');
  });

  it('状态=进行中 → active class', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '进行中' }) },
    });
    expect(wrapper.find('.npc-card').classes()).toContain('active');
  });

  it('状态=已完成 → completed class', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '已完成' }) },
    });
    expect(wrapper.find('.npc-card').classes()).toContain('completed');
  });

  it('点击触发 click 事件', async () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData() },
    });
    await wrapper.find('.npc-card').trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('好感度=0时进度条宽度为0%', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 0 }) },
    });
    const barFill = wrapper.find('.bar-fill');
    expect(barFill.attributes('style')).toContain('width: 0%');
  });

  it('好感度=100时进度条宽度为100%', () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 100 }) },
    });
    const barFill = wrapper.find('.bar-fill');
    expect(barFill.attributes('style')).toContain('width: 100%');
  });
});
