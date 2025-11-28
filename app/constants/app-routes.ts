import {
  mdiCalendar,
  mdiCalendarStar,
  mdiBook,
  mdiCalendarPlus,
  mdiCog,
} from '@mdi/js'

export const HOME_ROUTE = { title: 'Inicio', icon: mdiCalendar, to: '/' }

export const GENERATOR_ROUTE = {
  title: 'Generador de Horarios',
  shortTitle: 'Generador',
  denseTitle: 'Generador',
  icon: mdiCalendar,
  to: '/generator',
}

export const FAVORITES_ROUTE = {
  title: 'Horarios Favoritos',
  shortTitle: 'Favoritos',
  denseTitle: 'Favoritos',
  icon: mdiCalendarStar,
  to: '/generator/favorites',
}

export const SUBJECTS_ROUTE = {
  title: 'Mis cursos y secciones',
  shortTitle: 'Mis cursos',
  denseTitle: 'Cursos',
  icon: mdiBook,
  to: '/generator/subjects',
}

export const EVENTS_ROUTE = {
  title: 'Mis actividades',
  shortTitle: 'Actividades',
  denseTitle: 'Actividades',
  icon: mdiCalendarPlus,
  to: '/generator/events',
}

export const SETTINGS_ROUTE = {
  title: 'Avanzado',
  icon: mdiCog,
  to: '/generator/settings',
}
