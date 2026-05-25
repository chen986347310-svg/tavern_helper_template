import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';

const card = parse(readFileSync(new URL('./index.yaml', import.meta.url), 'utf8'));
const regexes = card.扩展字段.正则 as Array<Record<string, unknown>>;

function findRegex(name: string) {
  return regexes.find(regex => regex.正则名称 === name);
}

describe('角色卡正则', () => {
  it('状态栏自带旧楼层清理脚本，只保留最新楼层前端', () => {
    const statusRegex = findRegex('[界面]状态栏');
    const cleanupRegex = findRegex('[界面]清理旧状态栏占位符');
    const replacement = String(statusRegex?.替换为);

    expect(statusRegex).toMatchObject({
      启用: true,
      查找表达式: '<StatusPlaceHolderImpl/>',
      来源: { 用户输入: false, AI输出: true },
      作用于: { 仅格式显示: true, 仅格式提示词: false },
    });
    expect(replacement).toContain('data-hehuan-status-frame');
    expect(replacement).toContain('querySelectorAll');
    expect(replacement).toContain('iframe[data-hehuan-status-frame="1"]');
    expect(replacement).toContain('slice(0, -1)');
    expect(replacement).toContain("http://localhost:5500/dist/%E9%9B%8C%E5%A0%95%E5%90%88%E6%AC%A2%E5%AE%97/index.html");

    expect(cleanupRegex).toMatchObject({
      启用: true,
      查找表达式: '<StatusPlaceHolderImpl/>',
      替换为: '',
      来源: { 用户输入: false, AI输出: true },
      作用于: { 仅格式显示: true, 仅格式提示词: false },
    });

    expect(regexes.indexOf(statusRegex!)).toBeLessThan(regexes.indexOf(cleanupRegex!));
  });
});
