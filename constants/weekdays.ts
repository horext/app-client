import type { WeekdaysISO } from '~/modules/h-calendar/runtime/constants/week'

export const WEEK_DAYS_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
] as const

export const DEFAULT_CALENDAR_WEEK_DAYS: WeekdaysISO[] = [1, 2, 3, 4, 5, 6]
