// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const mockData = reactive({
  系统: {
    阶段: '攻略期',
    剩余天数: 30,
    灵石: 1000,
    已使用阵法: false,
    时辰: '午时',
    当前场景: '醉玉小筑',
    待处理交互: [] as Array<{
      类型: '装备' | '卸下' | '购买' | '灵识窃取' | '装备道具' | '购买物品' | '使用物品';
      目标: string;
      道具: string;
      数量: number;
      时辰: '晨时' | '午时' | '酉时' | '亥时';
      场景: '莲灯前苑' | '醉玉小筑' | '绮梦幽阁';
    }>,
  },
});

vi.mock('../store', () => ({
  useDataStore: () => ({ data: mockData }),
}));

import { usePendingAction } from './usePendingAction';

describe('usePendingAction', () => {
  beforeEach(() => {
    mockData.系统.时辰 = '午时';
    mockData.系统.当前场景 = '醉玉小筑';
    mockData.系统.待处理交互.splice(0);
  });

  it('记录通用交互时自动带入当前时辰与场景', () => {
    const { 记录交互 } = usePendingAction();

    记录交互({ 类型: '购买物品', 目标: '玩家', 道具: '束缚绳', 数量: 2 });

    expect(mockData.系统.待处理交互).toEqual([
      { 类型: '购买物品', 目标: '玩家', 道具: '束缚绳', 数量: 2, 时辰: '午时', 场景: '醉玉小筑' },
    ]);
  });

  it('记录购买物品使用玩家作为目标并默认数量为1', () => {
    const { 记录购买物品 } = usePendingAction();

    记录购买物品('改变阵法');

    expect(mockData.系统.待处理交互[0]).toEqual({
      类型: '购买物品',
      目标: '玩家',
      道具: '改变阵法',
      数量: 1,
      时辰: '午时',
      场景: '醉玉小筑',
    });
  });

  it('记录装备与卸下道具保留目标对象', () => {
    const { 记录装备道具, 记录卸下道具 } = usePendingAction();

    记录装备道具('眼罩', '白芷');
    记录卸下道具('眼罩', '白芷');

    expect(mockData.系统.待处理交互.map(action => action.类型)).toEqual(['装备道具', '卸下']);
    expect(mockData.系统.待处理交互.map(action => action.目标)).toEqual(['白芷', '白芷']);
  });

  it('记录灵识窃取只入队等待下一楼层AI处理', () => {
    const generateSpy = vi.fn();
    (globalThis as any).generate = generateSpy;
    const { 记录灵识窃取 } = usePendingAction();

    记录灵识窃取('苏芸');

    expect(mockData.系统.待处理交互[0]).toEqual({
      类型: '灵识窃取',
      目标: '苏芸',
      道具: '',
      数量: 1,
      时辰: '午时',
      场景: '醉玉小筑',
    });
    expect(generateSpy).not.toHaveBeenCalled();
    delete (globalThis as any).generate;
  });

  it('记录使用物品只入队等待下一楼层AI处理', () => {
    const generateSpy = vi.fn();
    (globalThis as any).generate = generateSpy;
    const { 记录使用物品 } = usePendingAction();

    记录使用物品('时间延长');

    expect(mockData.系统.待处理交互[0]).toEqual({
      类型: '使用物品',
      目标: '玩家',
      道具: '时间延长',
      数量: 1,
      时辰: '午时',
      场景: '醉玉小筑',
    });
    expect(generateSpy).not.toHaveBeenCalled();
    delete (globalThis as any).generate;
  });

  it('待处理交互类型在schema与世界书中保持一致', () => {
    const expectedTypes = ['装备', '卸下', '购买', '灵识窃取', '装备道具', '购买物品', '使用物品'];
    const root = process.cwd();
    const schema = readFileSync(join(root, 'src/雌堕合欢宗/schema.ts'), 'utf8');
    const variableList = readFileSync(join(root, 'src/雌堕合欢宗/世界书/变量/变量列表.yaml'), 'utf8');
    const updateRules = readFileSync(join(root, 'src/雌堕合欢宗/世界书/变量/变量更新规则.yaml'), 'utf8');
    const outputFormat = readFileSync(join(root, 'src/雌堕合欢宗/世界书/变量/变量输出格式.yaml'), 'utf8');

    expectedTypes.forEach(type => {
      expect(schema).toContain(`'${type}'`);
      expect(variableList).toContain(type);
    });
    expect(updateRules).toContain('使用物品:');
    expect(outputFormat).toContain('使用物品下一楼层闭环样例');
  });
  it('变量输出格式必须强制使用 UpdateVariable 包裹心音回流补丁', () => {
    const root = process.cwd();
    const outputFormat = readFileSync(join(root, 'src/雌堕合欢宗/世界书/变量/变量输出格式.yaml'), 'utf8');

    expect(outputFormat).toContain('MVU解析硬约束');
    expect(outputFormat).toContain('<UpdateVariable>');
    expect(outputFormat).toContain('<JSONPatch>');
    expect(outputFormat).toContain('/NPC/白芷/soul_whisper/text');
    expect(outputFormat).toContain('/NPC/白芷/soul_whisper/is_revealed');
    expect(outputFormat).toContain('/系统/待处理交互');
    expect(outputFormat).toContain('严禁只输出“变量更新情况”标题、YAML 摘要或裸 JSON Patch 数组');
  });
});