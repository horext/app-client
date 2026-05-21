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
import { provideApis } from '~~/modules/apis/runtime'
import { useUserSchedules } from '~/composables/user-schedules'
import { useUserFavoriteSchedules } from '~/composables/user-favorite-schedules'
import { useUserSubjects } from '~/composables/user-subjects'

const apis = provideApis()

const settingsStore = useSettingsStore()

const { darkMode } = storeToRefs(settingsStore)
const profileStore = useUserProfileStore()
const subjectsStore = useUserSubjectsStore()
const favoritesStore = useUserFavoritesStore()
const userEventsStore = useUserEventsStore()
const { hourlyLoad } = storeToRefs(profileStore)

const { subjects } = storeToRefs(subjectsStore)
const { favoritesSchedules } = storeToRefs(favoritesStore)
const { items: events } = storeToRefs(userEventsStore)

const { fetchProfile, fetchAcademicConfig, fetchLatestHourlyLoad } = useUserProfile(apis)
const { fetchPreferences } = useUserPreferences()
const { fetchItems: fetchEvents } = useUserEvents()

const { fetchSubjects } = useUserSubjects()
const { fetchSchedules, mySchedules } = useUserSchedules()

const { fetchFavoritesSchedules } = useUserFavoriteSchedules()

onMounted(async () => {
  await Promise.all([fetchProfile(), fetchAcademicConfig(), fetchPreferences()])
  if (profileStore.facultyId) {
    await fetchLatestHourlyLoad(profileStore.facultyId)
  }
  await Promise.all([
    fetchSubjects(),
    fetchSchedules(),
    fetchFavoritesSchedules(),
    fetchEvents(),
  ])
})
const drawer = ref(true)
const items = computed(() => [
  HOME_ROUTE,
  {
    ...GENERATOR_ROUTE,
    badge: mySchedules.value.length,
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
    badge: mySchedules.value.length,
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
