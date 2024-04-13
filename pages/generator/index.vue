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
          <v-badge color="white" :content="schedules.length" inline></v-badge>
        </v-toolbar-title>
      </div>
    </template>
    <template #top-items-left="{ item }">
      <schedule-favorite-add
        v-if="item"
        :favorites-schedules="myFavoritesSchedules"
        :schedule="item"
        @update:favorites-schedules="updateFavoritesSchedules"
      />
    </template>
    <template #subtitle-items="">
      <v-text-field
        v-model.number="crossingSubjects"
        class="flex-sm-1-1 flex-1-1-100 cross-input"
        label="Cantidad de cruces"
        hide-details
        density="compact"
        max="5"
        min="0"
        type="number"
      >
        <template #append-inner>
          <v-menu bottom>
            <template #activator="{ props }">
              <v-icon v-bind="props">mdi-help-circle</v-icon>
            </template>
            <v-card max-width="300" density="compact">
              <v-card-text>
                Solo se contabiliza los cruces entre cursos y los horarios con
                cruces entre Práctica y Práctica no se muestran.
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
      </v-text-field>

      <v-btn
        color="success"
        theme="dark"
        rounded
        variant="outlined"
        class="ma-1"
        density="compact"
        :loading="loadingGenerate"
        @click="generateAllUserSchedules"
      >
        <v-icon>mdi-update</v-icon>
        Generar
      </v-btn>
      <v-snackbar v-model="succces" color="success" timeout="3000">
        <v-icon> mdi-check </v-icon>
        Horarios generados correctamente!
        <template #actions>
          <v-btn variant="text" size="small" icon @click="succces = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </template>
      </v-snackbar>
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

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'
import ScheduleFavoriteAdd from '~/components/ScheduleFavoriteAdd.vue'
import OccurrencesList from '~/components/OccurrencesList.vue'
import { useUserConfigStore } from '~/stores/user-config'
import { useUserEventsStore } from '~/stores/user-events'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export default defineComponent({
  components: {
    ScheduleFavoriteAdd,
    SchedulesPresentation,
    OccurrencesList,
  },
  setup() {
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

    const updateCrossings = (crossings: number) => {
      configStore.updateCrossings(crossings)
    }

    const updateFavoritesSchedules = (
      favoritesSchedules: IScheduleGenerate[],
    ) => {
      configStore.updateFavoritesSchedules(favoritesSchedules)
    }

    const { loadSchedules } = useSchedules()

    const loadingGenerate = ref(false)
    const generateAllUserSchedules = async () => {
      succces.value = false
      loadingGenerate.value = true
      const { occurrences: occurrencesData, combinations } =
        await loadSchedules(mySubjects.value, myEvents.value, {
          crossingSubjects: crossingSubjects.value,
        })
      loadingGenerate.value = false
      configStore.updateSchedules(combinations)
      configStore.updateOccurrences(occurrencesData)
      occurrences.value = occurrencesData
      succces.value = true
    }

    return {
      occurrences,
      openMySchedules,
      succces,
      mySubjects,
      crossingSubjects,
      myEvents,
      myFavoritesSchedules,
      schedules,
      updateCrossings,
      updateFavoritesSchedules,
      generateAllUserSchedules,
      loadingGenerate,
    }
  },
})
</script>

<style>
.cross-input {
  max-width: 10rem;
}
</style>
