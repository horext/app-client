export const SUBJECT_HEADERS = [
  {
    title: 'Código',
    value: 'subject.course.id',
    sortable: true,
  },
  {
    title: 'Nombre de curso',
    align: 'start',
    sortable: true,
    value: 'subject.course.name',
  },
  {
    title: 'Secciones',
    value: 'sections',
    sortable: true,
  },
  {
    title: 'Creditos',
    value: 'subject.credits',
    sortable: true,
  },
  {
    title: 'Acciones',
    value: 'actions',
    sortable: false,
  },
] as const
