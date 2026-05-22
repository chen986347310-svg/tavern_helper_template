export function get灵犀等级(value: number): string {
  if (value <= 20) return '冷若冰霜';
  if (value <= 40) return '渐生疑窦';
  if (value <= 60) return '暗生情愫';
  if (value <= 80) return '灵犀相照';
  return '生死相随';
}

export function get道心侵蚀(value: number): string {
  if (value <= 20) return '道心稳固';
  if (value <= 40) return '心防松动';
  if (value <= 60) return '欲念暗生';
  if (value <= 80) return '道心破碎';
  return '沦为牝奴';
}
