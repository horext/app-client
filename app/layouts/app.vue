<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <VitePwaManifest v-if="isGeneratorRoute" />
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
  <v-main>
    <AppPersistentStorageAlert />
    <slot />
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

onMounted(async () => {
  await Promise.all([fetchProfile(), fetchAcademicConfig(), fetchPreferences()])
  if (profileStore.facultyId) {
    await fetchLatestHourlyLoad(profileStore.facultyId)
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
const isGeneratorRoute = computed(
  () => route.path === '/generator' || route.path.startsWith('/generator/'),
)
let reloadingForServiceWorkerUpdate = false

const activateServiceWorker = (worker: ServiceWorker | null) => {
  worker?.postMessage({ type: 'SKIP_WAITING' })
}

const registerGeneratorServiceWorker = async () => {
  if (
    import.meta.dev ||
    !isGeneratorRoute.value ||
    !('serviceWorker' in navigator)
  )
    return
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/generator',
      updateViaCache: 'none',
    })

    activateServiceWorker(registration.waiting)
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing
      installingWorker?.addEventListener('statechange', () => {
        if (
          installingWorker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          activateServiceWorker(registration.waiting)
        }
      })
    })
    await registration.update()
  } catch (error) {
    console.warn('Generator service worker registration failed.', error)
  }
}

onMounted(() => {
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (reloadingForServiceWorkerUpdate) return
    reloadingForServiceWorkerUpdate = true
    window.location.reload()
  })
  void registerGeneratorServiceWorker()
})

watch(isGeneratorRoute, (enabled) => {
  if (enabled) void registerGeneratorServiceWorker()
})

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
