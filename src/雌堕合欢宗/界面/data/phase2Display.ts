export type StigmaState = '沉寂' | '发热' | '强制';
export type ShameLevel = '微闻' | '传开' | '挂牌' | '示众' | '烙名';

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), 100);
}

function clampLayer(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), 9);
}

export function get堕落语义(value: number) {
  const v = clampPercent(value);
  if (v >= 90) return { label: '烙成', tone: 'forced', glyph: '烙' } as const;
  if (v >= 70) return { label: '深缠', tone: 'heated', glyph: '缠' } as const;
  if (v >= 50) return { label: '纹醒', tone: 'heated', glyph: '纹' } as const;
  if (v >= 30) return { label: '初染', tone: 'awake', glyph: '染' } as const;
  return { label: '未刻', tone: 'quiet', glyph: '寂' } as const;
}

export function get牝阴决语义(layer: number) {
  const v = clampLayer(layer);
  if (v >= 8) return { label: '归炉', glyph: '炉' } as const;
  if (v >= 5) return { label: '入髓', glyph: '髓' } as const;
  if (v >= 2) return { label: '绕脉', glyph: '脉' } as const;
  return { label: '未启', glyph: '决' } as const;
}

export function get命令状态(command: string, intensity: number): { state: StigmaState; label: string; glyph: string } {
  const v = clampPercent(intensity);
  if (!command && v === 0) return { state: '沉寂', label: '候命', glyph: '寂' };
  if (v >= 75) return { state: '强制', label: command || '强令压印', glyph: '令' };
  return { state: '发热', label: command || '牝印发热', glyph: '印' };
}

export function get羞名Marker(level: ShameLevel | string | undefined) {
  if (level === '烙名') return { level: '烙名', glyph: '烙', className: 'shame--branded' } as const;
  if (level === '示众') return { level: '示众', glyph: '众', className: 'shame--public' } as const;
  if (level === '挂牌') return { level: '挂牌', glyph: '牌', className: 'shame--posted' } as const;
  if (level === '传开') return { level: '传开', glyph: '传', className: 'shame--spread' } as const;
  return { level: '微闻', glyph: '闻', className: 'shame--whisper' } as const;
}

export function get支配者称谓(name: string) {
  if (!name) return { title: '无人牵丝', glyph: '空', className: 'dominator--none' } as const;
  if (name === '柳素衣') return { title: '柳素衣 · 静默牵丝', glyph: '柳', className: 'dominator--liu' } as const;
  return { title: `${name} · 牵丝在手`, glyph: name.slice(0, 1), className: 'dominator--active' } as const;
}
