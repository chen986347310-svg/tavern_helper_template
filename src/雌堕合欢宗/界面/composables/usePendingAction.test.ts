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
    场景上下文: { 在场NPC: [] as string[] },
    待处理交互: [] as Array<{
      类型: '装备' | '卸下' | '购买' | '灵识窃取' | '装备道具' | '购买物品' | '使用物品' | '追查风声';
      目标: string;
      道具: string;
      数量: number;
      时辰: '晨时' | '午时' | '酉时' | '亥时';
      场景: '莲灯前苑' | '醉玉小筑' | '绮梦幽阁';
      地点?: string;
      子区域?: string;
      风声ID?: string;
      故事钩子?: string;
      在场NPC?: string[];
      道具显示名?: string;
      器阶?: string;
      作用部位?: string;
      丹药分类?: string;
      作用线?: string;
      AI短提示?: string;
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
    mockData.系统.场景上下文 = { 在场NPC: [] };
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

    expect(mockData.系统.待处理交互[0]).toMatchObject({
      类型: '购买物品',
      目标: '玩家',
      道具: '改变阵法',
      数量: 1,
      时辰: '午时',
      场景: '醉玉小筑',
    });
    expect(mockData.系统.待处理交互[0].AI短提示).toContain('GOOD END');
  });

  it('记录装备与卸下道具保留目标对象', () => {
    const { 记录装备道具, 记录卸下道具 } = usePendingAction();

    记录装备道具('眼罩', '白芷');
    记录卸下道具('眼罩', '白芷');

    expect(mockData.系统.待处理交互.map(action => action.类型)).toEqual(['装备道具', '卸下']);
    expect(mockData.系统.待处理交互.map(action => action.目标)).toEqual(['白芷', '白芷']);
  });

  it('记录禁器装备与卸下时携带显示名、器阶、作用部位和AI短提示', () => {
    const { 记录装备道具, 记录卸下道具 } = usePendingAction();

    记录装备道具('阴蒂环', '白芷');
    记录卸下道具('阴蒂环', '白芷');

    expect(mockData.系统.待处理交互[0]).toMatchObject({
      类型: '装备道具',
      目标: '白芷',
      道具: '阴蒂环',
      道具显示名: '命门欲环',
      器阶: '化器器阶',
      作用部位: '阴蒂',
    });
    expect(mockData.系统.待处理交互[0].AI短提示).toContain('欲环');
    expect(mockData.系统.待处理交互[1]).toMatchObject({
      类型: '卸下',
      目标: '白芷',
      道具: '阴蒂环',
      道具显示名: '命门欲环',
      器阶: '化器器阶',
      作用部位: '阴蒂',
    });
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

    expect(mockData.系统.待处理交互[0]).toMatchObject({
      类型: '使用物品',
      目标: '玩家',
      道具: '时间延长',
      数量: 1,
      时辰: '午时',
      场景: '醉玉小筑',
    });
    expect(mockData.系统.待处理交互[0].AI短提示).toContain('天数');
    expect(generateSpy).not.toHaveBeenCalled();
    delete (globalThis as any).generate;
  });

  it('记录丹药使用时携带显示名、分类、作用线和AI短提示', () => {
    const { 记录使用物品 } = usePendingAction();

    记录使用物品('体香丹', '白芷');

    expect(mockData.系统.待处理交互[0]).toMatchObject({
      类型: '使用物品',
      目标: '白芷',
      道具: '体香丹',
      道具显示名: '引香丹',
      丹药分类: '永久丹药',
      作用线: '体态/社交',
    });
    expect(mockData.系统.待处理交互[0].AI短提示).toContain('体香');
  });


  it('记录追查风声会携带地点、钩子与当前在场NPC等待下一楼层处理', () => {
    mockData.系统.场景上下文 = { 在场NPC: ['白芷'] };
    const { 记录追查风声 } = usePendingAction();

    记录追查风声({
      id: 'r1',
      地点: '药庐',
      子区域: '炼丹房',
      相关NPC: ['白芷'],
      故事钩子: '丹炉彻夜未熄',
    });

    expect(mockData.系统.待处理交互[0]).toEqual({
      类型: '追查风声',
      目标: '白芷',
      道具: '',
      数量: 1,
      时辰: '午时',
      场景: '醉玉小筑',
      地点: '药庐',
      子区域: '炼丹房',
      风声ID: 'r1',
      故事钩子: '丹炉彻夜未熄',
      在场NPC: ['白芷'],
    });
  });

  it('待处理交互类型在schema与世界书中保持一致', () => {
    const expectedTypes = ['装备', '卸下', '购买', '灵识窃取', '装备道具', '购买物品', '使用物品', '追查风声'];
    const root = process.cwd();
    const schema = readFileSync(join(root, 'src/雌堕合欢宗/schema.ts'), 'utf8');
    const variableList = readFileSync(join(root, 'src/雌堕合欢宗/世界书/变量/变量列表.yaml'), 'utf8');
    const updateRules = readFileSync(join(root, 'src/雌堕合欢宗/世界书/变量/变量更新规则.yaml'), 'utf8');
    const outputFormat = readFileSync(join(root, 'src/雌堕合欢宗/世界书/变量/变量输出格式.yaml'), 'utf8');

    expectedTypes.forEach(type => {
      expect(schema).toContain(`'${type}'`);
      expect(variableList).toContain(type);
    });
    ['道具显示名', '器阶', '作用部位', '丹药分类', '作用线', 'AI短提示'].forEach(field => {
      expect(schema).toContain(field);
      expect(variableList).toContain(field);
    });
    expect(updateRules).toContain('使用物品:');
    expect(outputFormat).toContain('使用物品下一楼层闭环样例');
    expect(updateRules).toContain('道具AI承接闭环');
    expect(updateRules).toContain('道具显示名');
    expect(updateRules).toContain('丹药分类');
    expect(updateRules).toContain('作用线');
    expect(updateRules).toContain('道具.已生效效果');
    expect(outputFormat).toContain('丹药使用下一楼层闭环样例');
    expect(outputFormat).toContain('禁器装备下一楼层闭环样例');
    expect(outputFormat).toContain('服装装备下一楼层闭环样例');
  });

  it('变量列表声明道具已生效效果结构', () => {
    const variableList = readFileSync(join(process.cwd(), 'src/雌堕合欢宗/世界书/变量/变量列表.yaml'), 'utf8');

    expect(variableList).toContain('已生效效果');
    expect(variableList).toContain('目标: string');
    expect(variableList).toContain('道具: string');
    expect(variableList).toContain('来源交互ID: string');
    expect(variableList).toContain('生效楼层: number');
    expect(variableList).toContain('效果标签: string[]');
    expect(variableList).toContain('可被AI覆盖: boolean');
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

  it('世界运行核心字段在变量更新规则与输出格式中有强制闭环', () => {
    const root = process.cwd();
    const updateRules = readFileSync(join(root, 'src/雌堕合欢宗/世界书/变量/变量更新规则.yaml'), 'utf8');
    const outputFormat = readFileSync(join(root, 'src/雌堕合欢宗/世界书/变量/变量输出格式.yaml'), 'utf8');

    ['系统.时间状态', '系统.欲海状态', '剧情.事件记录'].forEach(field => {
      expect(updateRules).toContain(field);
      expect(outputFormat).toContain(field);
    });
    ['最近耗时', '最近结算原因', '最近事件类型', '是否过夜'].forEach(field => {
      expect(updateRules).toContain(field);
      expect(outputFormat).toContain(field);
    });
    ['搜寻进度', '警戒等级', '遮蔽剩余时段', '遮蔽来源'].forEach(field => {
      expect(updateRules).toContain(field);
      expect(outputFormat).toContain(field);
    });
    expect(updateRules).toContain('禁止只清空队列不写时间结算');
    expect(outputFormat).toContain('/系统/时间状态');
    expect(outputFormat).toContain('/系统/欲海状态');
    expect(outputFormat).toContain('/剧情/事件记录/-');
  });

  it('世界运行规则资料库按绿灯挂载，避免长规则蓝灯常驻', () => {
    const root = process.cwd();
    const indexYaml = readFileSync(join(root, 'src/雌堕合欢宗/index.yaml'), 'utf8');
    const runtimeRules = readFileSync(join(root, 'src/雌堕合欢宗/世界书/世界运行规则.yaml'), 'utf8');
    const dynamicScene = readFileSync(join(root, 'src/雌堕合欢宗/世界书/动态场景系统.yaml'), 'utf8');

    expect(indexYaml).toContain('名称: 世界运行规则');
    expect(indexYaml).toContain('文件: 世界书/世界运行规则');
    expect(indexYaml).toContain('时间结算');
    expect(indexYaml).toContain('欲海状态');
    expect(indexYaml).toContain('事件记录');
    expect(runtimeRules).toContain('状态: 绿灯');
    expect(runtimeRules).toContain('耗时参考');
    expect(runtimeRules).toContain('NPC日程资料');
    expect(runtimeRules).toContain('事件后果账本');
    expect(dynamicScene).toContain('世界运行规则');
    expect(dynamicScene).toContain('短摘要');
    expect(dynamicScene).not.toContain('完整耗时表');
    expect(dynamicScene).not.toContain('NPC日程资料');
  });
});
