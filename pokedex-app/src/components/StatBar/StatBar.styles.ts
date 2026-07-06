export const statBarStyles = {
  row: 'grid grid-cols-[72px_36px_1fr] items-center gap-3 py-2',
  label: 'text-sm capitalize text-slate-500',
  value: 'text-sm font-semibold text-slate-900',
  track: 'h-2 rounded-full bg-slate-100',
  fill: 'h-2 rounded-full transition-all',
} as const

export const STAT_BAR_MAX_VALUE = 255
