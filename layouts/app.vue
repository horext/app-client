<!-- eslint-disable vue/no-multiple-template-root -->
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
import { provideApis } from '~/modules/apis/runtime'
import { HOURLY_LOAD_API_KEY } from '~/modules/apis/runtime/registry/keys'
import type { IOrganization } from '~/interfaces/organization'
import { useUserSchedules } from '~/composables/user-schedules'
import { useUserFavoriteSchedules } from '~/composables/user-favorite-schedules'
import { useUserSubjects } from '~/composables/user-subjects'

const apis = provideApis()

const settingsStore = useSettingsStore()

const { darkMode } = storeToRefs(settingsStore)
const store = useUserConfigStore()
const userEventsStore = useUserEventsStore()
const { hourlyLoad } = storeToRefs(store)

const { subjects } = storeToRefs(store)
const { items: events } = storeToRefs(userEventsStore)

const hourlyLoadApi = apis.get(HOURLY_LOAD_API_KEY)

async function fetchHourlyLoad(faculty: IOrganization) {
  try {
    const data = await hourlyLoadApi.getLatestByFaculty(faculty.id)
    store.updateHourlyLoad(data)
  } catch (e) {
    console.error(e)
  }
}

await useAsyncData('initData', async () => {
  const [_, faculty] = await Promise.all([
    store.fetchFirstEntry(),
    store.fetchFaculty(),
    store.fetchSpeciality(),
  ])
  if (faculty) {
    await fetchHourlyLoad(faculty)
  }

  return true
})

const { fetchSubjects } = useUserSubjects()
const { fetchSchedules, schedules } = useUserSchedules()

const { fetchFavoritesSchedules, favoritesSchedules } = useUserFavoriteSchedules()

onMounted(async () => {
  await fetchSubjects()
  await fetchSchedules()
  await store.fetchCrossings()
  await fetchFavoritesSchedules()
  await userEventsStore.fetchItems()
  await store.fetchMyOcurrences()
  await store.fetchWeekDays()
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
