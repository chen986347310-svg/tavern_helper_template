import { describe, expect, it } from 'vitest';

import { get灵犀等级, get道心侵蚀 } from './useStatusText';

describe('useStatusText', () => {
  it('将好感度映射为灵犀状态语', () => {
    expect(get灵犀等级(0)).toBe('冷若冰霜');
    expect(get灵犀等级(20)).toBe('冷若冰霜');
    expect(get灵犀等级(21)).toBe('渐生疑窦');
    expect(get灵犀等级(40)).toBe('渐生疑窦');
    expect(get灵犀等级(41)).toBe('暗生情愫');
    expect(get灵犀等级(60)).toBe('暗生情愫');
    expect(get灵犀等级(61)).toBe('灵犀相照');
    expect(get灵犀等级(80)).toBe('灵犀相照');
    expect(get灵犀等级(81)).toBe('生死相随');
  });

  it('将攻略值映射为道心侵蚀状态语', () => {
    expect(get道心侵蚀(0)).toBe('道心稳固');
    expect(get道心侵蚀(20)).toBe('道心稳固');
    expect(get道心侵蚀(21)).toBe('心防松动');
    expect(get道心侵蚀(40)).toBe('心防松动');
    expect(get道心侵蚀(41)).toBe('欲念暗生');
    expect(get道心侵蚀(60)).toBe('欲念暗生');
    expect(get道心侵蚀(61)).toBe('道心破碎');
    expect(get道心侵蚀(80)).toBe('道心破碎');
    expect(get道心侵蚀(81)).toBe('沦为牝奴');
  });
});
