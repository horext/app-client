const DEFAULT_COLOR = '#1976d2'

export const DEFAULT_ACTIVITY_COLOR = DEFAULT_COLOR
export const DEFAULT_SUBJECT_COLOR = DEFAULT_COLOR

export const EVENT_COLORS = [
  '#3F51B5',
  '#673AB7',
  '#283593',
  '#4527A0',
  '#00838F',
  '#00BCD4',
  '#4CAF50',
  '#FF9800',
  '#2196F3',
  '#7986CB',
  '#9575CD',
  '#4DD0E1',
  '#2E7D32',
  '#EF6C00',
  '#1565C0',
  '#81C784',
  '#FFB74D',
  '#64B5F6',
]

export function getEventColorByIndex(index: number): string {
  return EVENT_COLORS[index] ?? DEFAULT_SUBJECT_COLOR
}

export function getNextAvailableEventColor(
  usedColors: Iterable<string | undefined>,
): string {
  const used = new Set(
    [...usedColors].filter(Boolean).map((color) => color!.toLowerCase()),
  )
  return (
    EVENT_COLORS.find((color) => !used.has(color.toLowerCase())) ??
    DEFAULT_SUBJECT_COLOR
  )
}

export const EVENT_HEADERS = [
  { title: 'Color', value: 'color' },
  { title: 'titulo', align: 'start', sortable: false, value: 'title' },
  { title: 'Horario', value: 'schedule' },
  { title: 'Acciones', value: 'actions', sortable: false },
] as const
