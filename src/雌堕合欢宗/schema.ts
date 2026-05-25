import _ from 'lodash';
import { z } from 'zod';

const NPC名Schema = z.enum(['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣']);
const TimeNameSchema = z.enum(['晨时', '午时', '酉时', '亥时']);
const SceneNameSchema = z.string().prefault('莲灯前苑');
const 心声探测态Schema = z.enum(['无波动', '可窥探', '已捕获', '反震', '锁闭']);
const 公开度Schema = z.enum(['公开', '半私密', '私密', '禁地']);
const 欲海警戒等级Schema = z.enum(['平静', '微动', '警觉', '锁定', '已改写']);
const 羞名等级Schema = z.enum(['微闻', '传开', '挂牌', '示众', '烙名']);
const P2支配者Schema = z.union([NPC名Schema, z.literal('')]);

const 场景上下文Schema = z
  .object({
    地点: z.string().prefault('莲灯前苑'),
    子区域: z.string().prefault(''),
    场景来源: z.enum(['核心地点', '世界书扩展', 'AI生成', '临时过渡']).prefault('核心地点'),
    公开度: 公开度Schema.prefault('公开'),
    在场NPC: z.array(NPC名Schema).prefault([]),
    NPC活动: z.partialRecord(NPC名Schema, z.string()).prefault({}),
    氛围: z.array(z.string()).prefault([]),
    故事钩子: z.array(z.string()).prefault([]),
    特殊事件: z.string().prefault(''),
  })
  .prefault({});

const 风声Schema = z.object({
  id: z.string().prefault(''),
  来源: z
    .enum([
      '弟子传闻',
      '灵气异动',
      '器物残痕',
      'NPC行踪',
      '宗门告示',
      '梦兆',
      '剧情钥匙',
      '场景令牌',
      '特殊事件',
      '牝奴日课',
      '牝印命令',
      '调教余波',
      '宗门闲谈',
      '公开示众',
      '支配者传唤',
    ])
    .prefault('弟子传闻'),
  地点: z.string().prefault('莲灯前苑'),
  子区域: z.string().prefault(''),
  相关NPC: z.array(NPC名Schema).prefault([]),
  紧急度: z.enum(['低', '中', '高']).prefault('低'),
  风声文本: z.string().prefault(''),
  故事钩子: z.string().prefault(''),
  状态: z.enum(['未读', '已读', '已追查', '已失效']).prefault('未读'),
  过期回合: z.coerce.number().optional(),
  可信度: z.coerce.number().optional(),
  是否陷阱: z.boolean().optional(),
  反制NPC: NPC名Schema.optional(),
  后续风声ID: z.string().optional(),
  凝视来源: z.string().optional(),
  羞名等级: 羞名等级Schema.optional(),
  羞名标签: z.array(z.string()).max(8).optional(),
  反噬日课: z.string().optional(),
  是否可承接: z.boolean().optional(),
});

const 时间状态Schema = z
  .object({
    当前日: z.coerce.number().transform(value => _.clamp(value, 1, 999)).prefault(1),
    时段进度: z.coerce.number().transform(value => _.clamp(value, 0, 3)).prefault(0),
    最近耗时: z.string().prefault(''),
    最近结算原因: z.string().prefault(''),
    最近事件类型: z.string().prefault(''),
    是否过夜: z.boolean().prefault(false),
  })
  .prefault({});

const 欲海状态Schema = z
  .object({
    搜寻进度: z.coerce.number().transform(value => _.clamp(value, 0, 100)).prefault(0),
    警戒等级: 欲海警戒等级Schema.prefault('平静'),
    遮蔽剩余时段: z.coerce.number().transform(value => _.clamp(value, 0, 99)).prefault(0),
    遮蔽来源: z.string().prefault(''),
    最近暴露原因: z.string().prefault(''),
    已被定位: z.boolean().prefault(false),
  })
  .prefault({});

const 心音回响Schema = z.object({
  id: z.string().prefault(''),
  npc: NPC名Schema,
  text: z.string().prefault(''),
  stage: z.enum(['警戒', '动摇', '沉沦']).prefault('警戒'),
  result: z.enum(['捕获', '反震', '锁闭']).prefault('捕获'),
  scene: z.string().prefault(''),
  time: TimeNameSchema.prefault('晨时'),
  floor: z.coerce.number().optional(),
  is_new: z.boolean().prefault(true),
});

const 已生效道具效果Schema = z.object({
  目标: z.string().prefault(''),
  道具: z.string().prefault(''),
  来源交互ID: z.string().prefault(''),
  生效楼层: z.coerce.number().prefault(0),
  效果标签: z.array(z.string()).prefault([]),
  可被AI覆盖: z.boolean().prefault(true),
});

const 线索状态Schema = z.object({
  类型: z.enum(['剧情钥匙', '场景令牌', '特殊事件']).prefault('剧情钥匙'),
  状态: z.enum(['可追查', '追查中', '已触发', '已失效']).prefault('可追查'),
  风声ID: z.string().prefault(''),
  关联名称: z.string().prefault(''),
  关联NPC: z.string().prefault(''),
  推荐场景: z.array(z.string()).prefault([]),
  触发次数: z.coerce.number().transform(value => _.clamp(value, 0, 999)).prefault(0),
  最近场景: z.string().prefault(''),
});

const 事件记录Schema = z.object({
  id: z.string().prefault(''),
  类型: z.string().prefault(''),
  摘要: z.string().prefault(''),
  日: z.coerce.number().transform(value => _.clamp(value, 1, 999)).prefault(1),
  时辰: TimeNameSchema.prefault('晨时'),
  地点: z.string().prefault('莲灯前苑'),
  涉及NPC: z.array(NPC名Schema).prefault([]),
  公开度: 公开度Schema.prefault('公开'),
  后果标签: z.array(z.string()).prefault([]),
  已生成风声: z.boolean().prefault(false),
});

const 调教记录Schema = z.object({
  id: z.string().prefault(''),
  时辰: TimeNameSchema.prefault('晨时'),
  支配者: z.string().prefault(''),
  摘要: z.string().prefault(''),
  羞名等级: 羞名等级Schema.prefault('微闻'),
});

export const Schema = z.object({
  系统: z
    .object({
      阶段: z.enum(['攻略期', '牝奴期']).prefault('攻略期'),
      剩余天数: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 30))
        .prefault(30),
      灵石: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 9999999))
        .prefault(0),
      已使用阵法: z.boolean().prefault(false),
      时辰: TimeNameSchema.prefault('晨时'),
      当前场景: SceneNameSchema,
      时间状态: 时间状态Schema,
      欲海状态: 欲海状态Schema,
      待处理交互: z
        .array(
          z.object({
            类型: z.enum(['装备', '卸下', '购买', '灵识窃取', '装备道具', '购买物品', '使用物品', '追查风声']).prefault('购买'),
            目标: z.string().prefault(''),
            道具: z.string().prefault(''),
            数量: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 999))
              .prefault(1),
            时辰: TimeNameSchema.prefault('晨时'),
            场景: SceneNameSchema,
            地点: z.string().prefault(''),
            子区域: z.string().prefault(''),
            风声ID: z.string().prefault(''),
            故事钩子: z.string().prefault(''),
            在场NPC: z.array(NPC名Schema).prefault([]),
            道具显示名: z.string().prefault(''),
            器阶: z.string().prefault(''),
            作用部位: z.string().prefault(''),
            丹药分类: z.string().prefault(''),
            作用线: z.string().prefault(''),
            剧情线: z.string().prefault(''),
            关联NPC: z.string().prefault(''),
            秘密主题: z.string().prefault(''),
            入口类型: z.enum(['', '剧情钥匙', '场景令牌', '特殊事件']).prefault(''),
            线索ID: z.string().prefault(''),
            AI短提示: z.string().prefault(''),
          }),
        )
        .prefault([]),
      场景上下文: 场景上下文Schema,
      风声列表: z.array(风声Schema).max(3).prefault([]),
      当前追查风声ID: z.string().prefault(''),
      心音回响: z.array(心音回响Schema).max(12).prefault([]),
      当前聚焦心声NPC: z.string().prefault(''),
    })
    .prefault({}),

  牝奴: z
    .object({
      堕落度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 100))
        .prefault(0),
      牝阴决层数: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 9))
        .prefault(0),
      入场日: z.coerce.number().transform(value => _.clamp(value, 0, 999)).prefault(0),
      当前日课: z.string().prefault('候命'),
      当前支配者: P2支配者Schema.prefault(''),
      当前命令: z.string().prefault(''),
      命令强度: z.coerce.number().transform(value => _.clamp(value, 0, 100)).prefault(0),
      今日调教次数: z.coerce.number().transform(value => _.clamp(value, 0, 99)).prefault(0),
      待执行日课: z.array(z.string()).max(8).prefault([]),
      最近调教结算: z.string().prefault(''),
      羞名标签: z.array(z.string()).max(8).prefault([]),
      调教记录: z.array(调教记录Schema).max(10).prefault([]),
      上次支配者: z.string().prefault(''),
      支配次数: z
        .record(
          NPC名Schema,
          z.coerce.number().transform(value => _.clamp(value, 0, 9999)),
        )
        .prefault({ 白芷: 0, 苏芸: 0, 纪兰: 0, 沈月秋: 0, 柳素衣: 0 }),
      情欲控制阶段: z.coerce
        .number()
        .transform(value => _.clamp(value, 1, 3))
        .prefault(1),
      改造进度: z
        .object({
          泌乳: z.boolean().prefault(false),
          肛门: z.boolean().prefault(false),
          憋尿: z.boolean().prefault(false),
        })
        .prefault({}),
    })
    .prefault({}),

  NPC: z
    .record(
      NPC名Schema,
      z.object({
        好感度: z.coerce
          .number()
          .transform(value => _.clamp(value, 0, 100))
          .prefault(0),
        攻略值: z.coerce
          .number()
          .transform(value => _.clamp(value, 0, 100))
          .prefault(0),
        粘滞计数: z.coerce
          .number()
          .transform(value => _.clamp(value, 0, 99))
          .prefault(0),
        状态: z.enum(['未开始', '进行中', '已完成']).prefault('未开始'),
        心声探测态: 心声探测态Schema.prefault('无波动'),
        当前场景: SceneNameSchema,
        soul_whisper: z
          .object({
            text: z.string().prefault(''),
            stage: z.enum(['警戒', '动摇', '沉沦']).prefault('警戒'),
            is_revealed: z.boolean().prefault(false),
          })
          .prefault({}),
      }),
    )
    .prefault({
      白芷: {},
      苏芸: {},
      纪兰: {},
      沈月秋: {},
      柳素衣: {},
    }),

  道具: z
    .object({
      拥有: z
        .record(
          z.string().describe('道具名'),
          z.coerce.number().transform(value => _.clamp(value, 0, 999)),
        )
        .prefault({}),
      装备: z
        .record(
          z.enum(['玩家', '白芷', '苏芸', '纪兰', '沈月秋', '柳素衣']),
          z.array(z.string().describe('装备道具名')).prefault([]),
        )
        .prefault({ 玩家: [], 白芷: [], 苏芸: [], 纪兰: [], 沈月秋: [], 柳素衣: [] }),
      已生效效果: z.array(已生效道具效果Schema).prefault([]),
    })
    .prefault({}),

  场景: z
    .object({
      已解锁: z.array(z.string()).prefault([]),
    })
    .prefault({}),

  剧情: z
    .object({
      已解锁: z.array(z.string()).prefault([]),
      线索状态: z.record(z.string(), 线索状态Schema).prefault({}),
      事件记录: z.array(事件记录Schema).max(20).prefault([]),
    })
    .prefault({}),
});
export type Schema = z.output<typeof Schema>;
