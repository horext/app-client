<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <AppBar
    v-model:drawer="drawer"
    v-model:dark-mode="darkMode"
    :hourly-load="hourlyLoad"
  />
  <AppNavigationDrawer
    v-model:drawer="drawer"
    :items="items"
    :report-url="userBugReportUrl"
  />

  <AppBottomNavigation v-if="$vuetify.display.smAndDown" :items="denseItems" />
  <v-main class="d-flex flex-column min-h-screen">
    <AppPersistentStorageAlert />
    <div class="flex-grow-1">
      <slot />
    </div>
    <v-footer
      class="py-3 px-4 text-caption text-medium-emphasis justify-center border-t mt-auto position-sticky bottom-0"
      style="
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        background-color: rgba(var(--v-theme-surface), 0.75);
        border-top: 1px solid rgba(var(--v-border-color), 0.12) !important;
        z-index: 10;
      "
    >
      Copyright &copy; {{ new Date().getFullYear() }} Octatec &middot; Lenin
      Castro
    </v-footer>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppBar from '../components/app/Bar.vue'
import AppNavigationDrawer from '../components/app/NavigationDrawer.vue'
import AppBottomNavigation from '../components/app/BottomNavigation.vue'
import AppPersistentStorageAlert from '../components/app/PersistentStorageAlert.vue'
import {
  EVENTS_ROUTE,
  FAVORITES_ROUTE,
  GENERATOR_ROUTE,
  HOME_ROUTE,
  SETTINGS_ROUTE,
  SUBJECTS_ROUTE,
} from '~/constants/app-routes'
import { useUserSchedules } from '~/composables/user-schedules'
import { useUserFavoriteSchedules } from '~/composables/user-favorite-schedules'
import { useUserSubjects } from '~/composables/user-subjects'
import { buildUserBugReportUrl } from '~/utils/user-bug-report'

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

const {
  fetchProfile,
  fetchAcademicConfig,
  fetchLatestHourlyLoad,
  fetchSpecialityById,
} = useUserProfile()
const { fetchPreferences } = useUserPreferences()
const { fetchItems: fetchEvents } = useUserEvents()

const { fetchSubjects } = useUserSubjects()
const { fetchSchedules, mySchedules } = useUserSchedules()

const { fetchFavoritesSchedules } = useUserFavoriteSchedules()
const { ensureLoaded: ensureLocalHourlyLoad } = useLocalHourlyLoad()

onMounted(async () => {
  await Promise.all([fetchProfile(), fetchAcademicConfig(), fetchPreferences()])
  const localHourlyLoad = await ensureLocalHourlyLoad()
  if (!localHourlyLoad && profileStore.facultyId) {
    try {
      await fetchLatestHourlyLoad(profileStore.facultyId)
    } catch {
      // No hourly load available yet for this faculty — non-blocking
    }
  }
  if (profileStore.specialityId) {
    await fetchSpecialityById(profileStore.specialityId)
  }
  await Promise.all([
    fetchSubjects(),
    fetchSchedules(),
    fetchFavoritesSchedules(),
    fetchEvents(),
  ])
})
const drawer = ref(true)
const route = useRoute()
const userBugReportUrl = computed(() =>
  buildUserBugReportUrl({
    path: route.path,
    userAgent: import.meta.client ? navigator.userAgent : undefined,
  }),
)
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
