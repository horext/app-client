import type { Weekdays } from '~/interfaces/event'

export const WEEK_DAYS_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
] as const

export const DEFAULT_CALENDAR_WEEK_DAYS: Weekdays[] = [1, 2, 3, 4, 5, 6]
