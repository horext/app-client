export const SUBJECT_HEADERS = [
  {
    title: 'Código',
    value: 'course.id',
    sortable: true,
  },
  {
    title: 'Nombre de curso',
    align: 'start',
    sortable: true,
    value: 'course.name',
  },
  {
    title: 'Secciones',
    value: 'sections',
    sortable: true,
  },
  {
    title: 'Creditos',
    value: 'credits',
    sortable: true,
  },
  {
    title: 'Acciones',
    value: 'actions',
    sortable: false,
  },
] as const
