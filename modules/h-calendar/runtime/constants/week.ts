export const WEEKDAY_NAMES = [
  'Dom',
  'Lun',
  'Mar',
  'Mié',
  'Jue',
  'Vie',
  'Sáb',
] as const

export type WeekdaysISO = 1 | 2 | 3 | 4 | 5 | 6 | 7

export const WEEKDAYS: WeekdaysISO[] = [1, 2, 3, 4, 5, 6, 7] as const
