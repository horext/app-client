<template>
  <schedules-presentation
    color="warning"
    title="Horarios Favoritos"
    empty-message="Usted no tiene horarios favoritos"
    :schedules="favoritesSchedules"
    path="/skd"
  >
    <template #top-items-right>
      <v-toolbar-title> Horarios favoritos </v-toolbar-title>
    </template>
    <template #top-items-left="{ item }">
      <schedule-favorite-add
        v-if="item"
        :favorites-schedules="favoritesSchedules"
        :schedule="item"
        @click:add-favorite="addFavorite"
        @click:remove-favorite="removeFavorite"
      />
      <base-snackbar v-model="showAddFavoriteMessage">
        Horario agregado a favoritos!
      </base-snackbar>
      <base-snackbar v-model="showRemoveFavoriteMessage">
        Horario eliminado de favoritos!
      </base-snackbar>
    </template>
    <template #emptyBody>
      <FavoriteBanner />
    </template>
  </schedules-presentation>
</template>

<script setup lang="ts">
import FavoriteBanner from '~/components/schedule/FavoriteBanner.vue'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'
import ScheduleFavoriteAdd from '~/components/schedule/FavoriteToggle.vue'
import { useUserConfigStore } from '~/stores/user-config'
import type { IScheduleGenerate } from '~/interfaces/schedule'

useSeoMeta({
  title: 'Horarios Favoritos - Generador de Horarios',
  description: 'Administra tus horarios favoritos para tener un mejor control de tu tiempo',
})

const store = useUserConfigStore()
const { favoritesSchedules } = storeToRefs(store)

const showAddFavoriteMessage = ref(false)

const addFavorite = async (schedule: IScheduleGenerate) => {
  showAddFavoriteMessage.value = false
  await store.addFavoriteSchedule(schedule)
  showAddFavoriteMessage.value = true
}

const showRemoveFavoriteMessage = ref(false)
const removeFavorite = async (schedule: IScheduleGenerate) => {
  showRemoveFavoriteMessage.value = false
  await store.removeFavoriteSchedule(schedule)
  showRemoveFavoriteMessage.value = true
}
</script>
