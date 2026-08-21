export const SUBJECT_HEADERS = [
  {
    title: 'Color',
    value: 'color',
    sortable: false,
  },
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
    title: 'Especialidad',
    value: 'subject.studyPlan.organizationUnit.name',
    sortable: true,
  },
  {
    title: 'Plan de estudios',
    value: 'subject.studyPlan.name',
    sortable: true,
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
