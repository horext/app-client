<template>
  <schedules-presentation
    v-model:dialog="openMySchedules"
    color="blue"
    title="Generados"
    empty-message="Usted no tiene horarios generados"
    :schedules="schedules"
    path="/skd"
  >
    <template #top-items-right>
      <div class="d-flex align-self-center ga-2">
        <v-toolbar-title>
          Generados
          <v-badge color="white" :content="schedules.length" inline />
        </v-toolbar-title>
      </div>
    </template>
    <template #top-items-left="{ item }">
      <schedule-favorite-add
        v-if="item"
        :favorites-schedules="myFavoritesSchedules"
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
    <template #subtitle-items="">
      <schedule-generator-actions
        v-model:crossings="crossingSubjects"
        :loading-generate="loadingGenerate"
        @click:generate="generateAllUserSchedules"
      />
      <base-snackbar v-model="succces">
        Horarios generados correctamente!
      </base-snackbar>
      <v-spacer />
    </template>

    <template #emptyBody>
      <v-alert prominent type="error">
        <v-row align="center">
          <v-col class="grow">
            Lo sentimos, no hemos encontrados horarios para usted.
          </v-col>
        </v-row>
      </v-alert>
      <occurrences-list :items="occurrences" />
    </template>
  </schedules-presentation>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'
import ScheduleFavoriteAdd from '~/components/schedule/FavoriteToggle.vue'
import OccurrencesList from '~/components/schedule/OccurrencesList.vue'
import { useUserConfigStore } from '~/stores/user-config'
import { useUserEventsStore } from '~/stores/user-events'
import type { IScheduleGenerate } from '~/interfaces/schedule'

useSeoMeta({
  title: 'Generador - Generador de Horarios',
  description: 'Genera tus horarios de clases de manera automática',
})

const configStore = useUserConfigStore()
const eventsStore = useUserEventsStore()
const openMySchedules = ref(false)
const succces = ref(false)

const {
  crossings: crossingSubjects,
  subjects: mySubjects,
  favoritesSchedules: myFavoritesSchedules,
  schedules,
  occurrences,
} = storeToRefs(configStore)
const { items: myEvents } = storeToRefs(eventsStore)

const showAddFavoriteMessage = ref(false)

const addFavorite = async (schedule: IScheduleGenerate) => {
  showAddFavoriteMessage.value = false
  await configStore.addFavoriteSchedule(schedule)
  showAddFavoriteMessage.value = true
}

const showRemoveFavoriteMessage = ref(false)
const removeFavorite = async (schedule: IScheduleGenerate) => {
  showRemoveFavoriteMessage.value = false
  await configStore.removeFavoriteSchedule(schedule)
  showRemoveFavoriteMessage.value = true
}

const { loadSchedules } = useSchedules()

const loadingGenerate = ref(false)
const generateAllUserSchedules = async () => {
  succces.value = false
  loadingGenerate.value = true
  const { occurrences: occurrencesData, combinations } = await loadSchedules(
    mySubjects.value,
    myEvents.value,
    {
      crossingSubjects: crossingSubjects.value,
    },
  )
  loadingGenerate.value = false
  configStore.updateSchedules(combinations)
  configStore.updateOccurrences(occurrencesData)
  occurrences.value = occurrencesData
  succces.value = true
}
</script>

<style>
.cross-input {
  max-width: 10rem;
}
</style>
