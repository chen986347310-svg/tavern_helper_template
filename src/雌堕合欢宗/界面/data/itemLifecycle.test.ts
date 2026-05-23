// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { getItemLifecycle, isConsumableLifecycle, isEquippableLifecycle, itemRequiresTarget } from './itemLifecycle';

describe('itemLifecycle', () => {
  it('服装和禁器属于可装备生命周期', () => {
    expect(getItemLifecycle('透视纱衣')).toBe('可装备');
    expect(getItemLifecycle('铃铛项圈')).toBe('可装备');
    expect(isEquippableLifecycle('透视纱衣')).toBe(true);
  });

  it('永久丹药属于需指定NPC目标的消耗品', () => {
    expect(getItemLifecycle('体香丹')).toBe('目标消耗');
    expect(itemRequiresTarget('体香丹')).toBe(true);
    expect(isConsumableLifecycle('体香丹')).toBe(true);
  });

  it('时间延长属于玩家自用消耗品，不需要选择NPC目标', () => {
    expect(getItemLifecycle('时间延长')).toBe('自用消耗');
    expect(itemRequiresTarget('时间延长')).toBe(false);
    expect(isConsumableLifecycle('时间延长')).toBe(true);
  });

  it('场景、剧情和阵法具有购买即生效或解锁生命周期', () => {
    expect(getItemLifecycle('阴阳池')).toBe('解锁场景');
    expect(getItemLifecycle('白芷')).toBe('解锁剧情');
    expect(getItemLifecycle('改变阵法')).toBe('购买即生效');
  });
});
