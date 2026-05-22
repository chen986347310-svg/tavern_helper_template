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
      时辰: z.enum(['晨时', '午时', '酉时', '亥时']).prefault('晨时'),
      当前场景: z.enum(['莲灯前苑', '醉玉小筑', '绮梦幽阁']).prefault('莲灯前苑'),
      待处理交互: z
        .array(
          z.object({
            类型: z.enum(['装备', '卸下', '购买', '灵识窃取', '装备道具', '购买物品', '使用物品']).prefault('购买'),
            目标: z.string().prefault(''),
            道具: z.string().prefault(''),
            数量: z.coerce
              .number()
              .transform(value => _.clamp(value, 0, 999))
              .prefault(1),
            时辰: z.enum(['晨时', '午时', '酉时', '亥时']).prefault('晨时'),
            场景: z.enum(['莲灯前苑', '醉玉小筑', '绮梦幽阁']).prefault('莲灯前苑'),
          }),
        )
        .prefault([]),
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
      上次支配者: z.string().prefault(''),
      支配次数: z
        .record(
          z.enum(['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣']),
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
      z.enum(['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣']),
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
        当前场景: z.enum(['莲灯前苑', '醉玉小筑', '绮梦幽阁']).prefault('莲灯前苑'),
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
    })
    .prefault({}),
});
export type Schema = z.output<typeof Schema>;
