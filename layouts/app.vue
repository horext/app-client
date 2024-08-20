<template>
  <AppBar
    v-model:drawer="drawer"
    v-model:dark-mode="darkMode"
    :hourly-load="hourlyLoad"
  />
  <AppNavigationDrawer v-model:drawer="drawer" :items="items" />

  <AppBottomNavigation v-if="$vuetify.display.smAndDown" :items="denseItems" />
  <v-main>
    <slot />
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppBar from '../components/app/Bar.vue'
import AppNavigationDrawer from '../components/app/NavigationDrawer.vue'
import AppBottomNavigation from '../components/app/BottomNavigation.vue'
import {
  EVENTS_ROUTE,
  FAVORITES_ROUTE,
  GENERATOR_ROUTE,
  HOME_ROUTE,
  SETTINGS_ROUTE,
  SUBJECTS_ROUTE,
} from '~/constants/app-routes'
import { createApis } from '~/modules/apis/runtime'

createApis()

const settingsStore = useSettingsStore()

const { darkMode } = storeToRefs(settingsStore)
const store = useUserConfigStore()
const userEventsStore = useUserEventsStore()
const { hourlyLoad } = storeToRefs(store)

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
  HOME_ROUTE,
  {
    ...GENERATOR_ROUTE,
    badge: schedules.value.length,
  },
  {
    ...FAVORITES_ROUTE,
    badge: favoritesSchedules.value.length,
  },
  {
    ...SUBJECTS_ROUTE,
    badge: subjects.value.length,
  },
  {
    ...EVENTS_ROUTE,
    badge: events.value.length,
  },
  SETTINGS_ROUTE,
])

const denseItems = computed(() => [
  {
    ...GENERATOR_ROUTE,
    badge: schedules.value.length,
  },
  {
    ...FAVORITES_ROUTE,
    badge: favoritesSchedules.value.length,
  },
  {
    ...SUBJECTS_ROUTE,
    badge: subjects.value.length,
  },
  {
    ...EVENTS_ROUTE,
    badge: events.value.length,
  },
])
</script>
