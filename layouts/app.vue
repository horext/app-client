<template>
  <AppBar
    v-model:drawer="drawer"
    v-model:dark-mode="darkMode"
    :hourly-load="hourlyLoad"
  />
  <AppNavigationDrawer v-model:drawer="drawer" :items="items" />

  <v-bottom-navigation v-if="$vuetify.display.smAndDown" color="primary" grow>
    <v-btn
      v-for="item in denseItems"
      :key="item.to"
      exact
      tag="div"
      :to="item.to"
      stacked
    >
      <v-badge color="blue" :content="item.badge" overlap>
        <v-icon>{{ item.icon }}</v-icon>
      </v-badge>
      <span class="hidden-xs">
        {{ item.title }}
      </span>
      <span class="hidden-sm-and-up">
        {{ item.shortTitle }}
      </span>
    </v-btn>
  </v-bottom-navigation>
  <v-main>
    <slot />
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  mdiCalendar,
  mdiCalendarStar,
  mdiBook,
  mdiCalendarPlus,
  mdiCog,
} from '@mdi/js'
import AppBar from '../components/app/Bar.vue'
import AppNavigationDrawer from '../components/app/NavigationDrawer.vue'

const settingsStore = useSettingsStore()

const { darkMode } = storeToRefs(settingsStore)
const store = useUserConfigStore()
const userEventsStore = useUserEventsStore()
const { hourlyLoad } = storeToRefs(store)
await useAsyncData('initData', async () => {
  await Promise.all([
    store.fetchFirstEntry(),
    store.fetchFaculty(),
    store.fetchSpeciality(),
  ])

  await store.fetchHourlyLoad()

  return true
})
const { schedules, subjects, favoritesSchedules } = storeToRefs(store)
const { items: events } = storeToRefs(userEventsStore)

onMounted(async () => {
  await store.fetchSubjects()
  await store.fetchSchedules()
  await store.fetchCrossings()
  await store.fetchFavoritesSchedules()
  await userEventsStore.fetchItems()
  await store.fetchMyOcurrences()
})
const drawer = ref(true)
const items = computed(() => [
  {
    title: 'Inicio',
    icon: mdiCalendar,
    to: '/',
  },
  {
    title: 'Generador de Horarios',
    icon: mdiCalendar,
    to: '/generator',
    badge: schedules.value.length,
  },
  {
    title: 'Horarios Favoritos',
    icon: mdiCalendarStar,
    to: '/generator/favorites',
    badge: favoritesSchedules.value.length,
  },
  {
    title: 'Mis cursos y secciones',
    icon: mdiBook,
    to: '/generator/subjects',
    badge: subjects.value.length,
  },
  {
    title: 'Mis actividades',
    icon: mdiCalendarPlus,
    to: '/generator/events',
    badge: events.value.length,
  },
  {
    title: 'Avanzado',
    icon: mdiCog,
    to: '/generator/settings',
  },
])

const denseItems = computed(() => [
  {
    title: 'Generador',
    shortTitle: 'Generador',
    icon: mdiCalendar,
    to: '/generator',
    badge: schedules.value.length,
  },
  {
    title: 'Favoritos',
    shortTitle: 'Favoritos',
    icon: mdiCalendarStar,
    to: '/generator/favorites',
    badge: favoritesSchedules.value.length,
  },
  {
    title: 'Mis cursos',
    shortTitle: 'Cursos',
    icon: mdiBook,
    to: '/generator/subjects',
    badge: subjects.value.length,
  },
  {
    title: 'Mis actividades',
    shortTitle: 'Actividades',
    icon: mdiCalendarPlus,
    to: '/generator/events',
    badge: events.value.length,
  },
])
</script>
