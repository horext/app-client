<template>
  <schedules-presentation
    v-model:dialog="openMySchedules"
    color="blue"
    title="Generados"
    empty-message="Usted no tiene horarios generados"
    :schedules="result?.schedules ?? []"
    path="/skd"
  >
    <template #top-items-right>
      <div class="d-flex align-self-center ga-2">
        <v-toolbar-title>
          Generados
          <v-badge
            color="white"
            :content="result?.schedules.length ?? 0"
            inline
          />
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
        :crossings="crossingSubjects"
        :loading-generate="loadingGenerate"
        @update:crossings="updateCrossings"
        @click:generate="generateAllUserSchedules"
      />
      <base-snackbar v-model="succces">
        Horarios generados correctamente!
      </base-snackbar>
      <v-spacer />
    </template>

    <template #emptyBody>
      <template v-if="result">
        <v-alert prominent type="error">
          <v-row align="center">
            <v-col class="grow">
              Lo sentimos, no hemos encontrados horarios para usted.
            </v-col>
          </v-row>
        </v-alert>
        <occurrences-list :items="result?.occurrences ?? []" />
      </template>
    </template>
  </schedules-presentation>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'
import ScheduleFavoriteAdd from '~/components/schedule/FavoriteToggle.vue'
import OccurrencesList from '~/components/schedule/OccurrencesList.vue'
import { useUserPreferencesStore } from '~/stores/user-preferences'
import { useUserProfileStore } from '~/stores/user-profile'
import { useGenerationStore } from '~/stores/generation'
import { useUserEventsStore } from '~/stores/user-events'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import { useUserFavoriteSchedules } from '~/composables/user-favorite-schedules'

useSeoMeta({
  title: 'Generador - Generador de Horarios',
  description: 'Genera tus horarios de clases de manera automática',
})

const preferencesStore = useUserPreferencesStore()
const profileStore = useUserProfileStore()
const subjectsStore = useUserSubjectsStore()
const favoritesStore = useUserFavoritesStore()
const generationStore = useGenerationStore()
const eventsStore = useUserEventsStore()
const openMySchedules = ref(false)
const succces = ref(false)

const { subjects: mySubjects } = storeToRefs(subjectsStore)
const { favoritesSchedules: myFavoritesSchedules } = storeToRefs(favoritesStore)

const { setResult } = useGeneration()
const { updateCrossings } = useUserPreferences()
const { weekDays, crossings: crossingSubjects } = storeToRefs(preferencesStore)
const { hourlyLoad } = storeToRefs(profileStore)
const { result } = storeToRefs(generationStore)
const { items: myEvents } = storeToRefs(eventsStore)

const showAddFavoriteMessage = ref(false)

const { saveNewFavoriteSchedule, deleteFavoriteScheduleById } =
  useUserFavoriteSchedules()

const addFavorite = async (schedule: IScheduleGenerate) => {
  showAddFavoriteMessage.value = false
  await saveNewFavoriteSchedule(toRaw(schedule))
  showAddFavoriteMessage.value = true
}

const showRemoveFavoriteMessage = ref(false)
const removeFavorite = async (schedule: IScheduleGenerate) => {
  showRemoveFavoriteMessage.value = false
  await deleteFavoriteScheduleById(schedule.id)
  showRemoveFavoriteMessage.value = true
}

const { loadSchedules } = useSchedulesGenerator()
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
  await setResult(toRaw(combinations), toRaw(occurrencesData), {
    generatedAt: new Date().toISOString(),
    crossingsSetting: toRaw(crossingSubjects.value),
    weekDays: toRaw(weekDays.value),
    hourlyLoadId: toRaw(hourlyLoad.value)?.id ?? 0,
  })
  succces.value = true
}
</script>

<style>
.cross-input {
  max-width: 10rem;
}
</style>
