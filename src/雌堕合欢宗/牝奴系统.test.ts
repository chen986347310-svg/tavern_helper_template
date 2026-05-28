import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const prompt = readFileSync(new URL('./世界书/牝奴系统.yaml', import.meta.url), 'utf8');

describe('牝奴系统世界书', () => {
  it('通过 getvar 读取堕落度，避免依赖裸 stat_data 模板上下文', () => {
    expect(prompt).toContain("getvar('stat_data.牝奴.堕落度'");
    expect(prompt).not.toMatch(/<%\s*if\s*\(stat_data\.牝奴\.堕落度/);
  });

  it('所有堕落度阶段条件都使用 getvar 读取后的 corruption 变量', () => {
    expect(prompt.match(/if\s*\(corruption/g)).toHaveLength(6);
    expect(prompt).not.toMatch(/stat_data\.牝奴\.堕落度\s*(?:<|>=|>|<=|===|!==)/);
  });
});
