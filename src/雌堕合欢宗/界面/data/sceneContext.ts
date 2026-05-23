export const 核心NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
export type NpcName = (typeof 核心NPC列表)[number];

export const 核心地点列表 = ['莲灯前苑', '醉玉小筑', '绮梦幽阁', '药庐', '经阁', '演武场', '长老殿', '掌门殿'] as const;
export type CoreLocation = (typeof 核心地点列表)[number];

export function isNpcName(name: string): name is NpcName {
  return (核心NPC列表 as readonly string[]).includes(name);
}

export function normalizePresentNpcs(names: readonly string[] = []): NpcName[] {
  return 核心NPC列表.filter(name => names.includes(name));
}