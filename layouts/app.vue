<template>
  <v-app>
    <v-app-bar flat height="72">
      <template #prepend>
        <v-app-bar-nav-icon
          aria-label="Menu Iziquierdo"
          @click.stop="drawer = !drawer"
        />
      </template>

      <v-row justify="center" align="center" no-gutters>
        <v-col cols="9" sm="8">
          <AppHourlyLoadInfo class="mx-0" />
        </v-col>
        <v-spacer />
        <v-col cols="3" sm="4">
          <ThemeDarkToggle />
        </v-col>
      </v-row>
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

            <v-icon v-else>{{ item.icon }}</v-icon>
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
        <span>
          {{ item.title }}
        </span>
      </v-btn>
    </v-bottom-navigation>
    <the-snackbar />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TheSnackbar from '~/components/base/TheSnackbar.vue'
import AppHourlyLoadInfo from '~/components/app/HourlyLoadInfo.vue'
import ThemeDarkToggle from '~/components/ThemeDarkToggle.vue'

const store = useUserConfigStore()
const userEventsStore = useUserEventsStore()

await useAsyncData('initData', async () => {
  await Promise.all([
    store.fetchFirstEntry(),
    store.fetchFaculty(),
    store.fetchSpeciality(),
  ])

  await store.fetchHourlyLoad()
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
    icon: 'mdi-calendar',
    to: '/',
  },
  {
    title: 'Generador de Horarios',
    icon: 'mdi-calendar',
    to: '/generator',
    badge: schedules.value.length,
  },
  {
    title: 'Horarios Favoritos',
    icon: 'mdi-calendar-star',
    to: '/generator/favorites',
    badge: favoritesSchedules.value.length,
  },
  {
    title: 'Mis cursos y secciones',
    icon: 'mdi-book',
    to: '/generator/subjects',
    badge: subjects.value.length,
  },
  {
    title: 'Mis actividades',
    icon: 'mdi-calendar-plus',
    to: '/generator/events',
    badge: events.value.length,
  },
  {
    title: 'Avanzado',
    icon: 'mdi-cog',
    to: '/generator/settings',
  },
])

const denseItems = computed(() => [
  {
    title: 'Generador',
    icon: 'mdi-calendar',
    to: '/generator',
    badge: schedules.value.length,
  },
  {
    title: 'Favoritos',
    icon: 'mdi-calendar-star',
    to: '/generator/favorites',
    badge: favoritesSchedules.value.length,
  },
  {
    title: 'Mis cursos',
    icon: 'mdi-book',
    to: '/generator/subjects',
    badge: subjects.value.length,
  },
  {
    title: 'Mis actividades',
    icon: 'mdi-calendar-plus',
    to: '/generator/events',
    badge: events.value.length,
  },
])
</script>
