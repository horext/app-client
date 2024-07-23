<template>
  <v-app-bar flat height="72">
    <template #prepend>
      <v-app-bar-nav-icon
        aria-label="Menu Iziquierdo"
        @click.stop="drawer = !drawer"
      />
    </template>
    <v-row justify="center" align="center" no-gutters>
      <v-col cols="12">
        <AppHourlyLoadInfo :hourly-load="hourlyLoad" class="pa-0" />
      </v-col>
    </v-row>
    <template #append>
      <ThemeDarkToggle v-model:dark-mode="darkMode" />
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" width="300">
    <v-card-title> Opciones </v-card-title>
    <v-divider />
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        link
        exact
      >
        <template #prepend>
          <v-badge v-if="item.badge" color="blue" :content="item.badge">
            <v-icon>{{ item.icon }}</v-icon>
          </v-badge>

          <v-icon v-else>
            {{ item.icon }}
          </v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

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
  <the-snackbar />
  <v-main>
    <slot />
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TheSnackbar from '~/components/base/TheSnackbar.vue'
import AppHourlyLoadInfo from '~/components/app/HourlyLoadInfo.vue'
import ThemeDarkToggle from '~/components/ThemeDarkToggle.vue'
import {
  mdiCalendar,
  mdiCalendarStar,
  mdiBook,
  mdiCalendarPlus,
  mdiCog,
} from '@mdi/js'

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
