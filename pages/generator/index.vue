<template>
  <schedules-presentation
    color="blue"
    title="Generados"
    empty-message="Usted no tiene horarios generados"
    :schedules="schedules"
    :dialog.sync="openMySchedules"
    path="/skd"
  >
    <template #top-items-right>
      <v-toolbar-title> Generados </v-toolbar-title>

      <v-btn plain class="ml-2" outlined fab small>
        {{ schedules.length }}
      </v-btn>
    </template>
    <template #top-items-left="{ item }">
      <schedule-favorite-add
        :favorites-schedules="myFavoritesSchedules"
        :schedule="item"
        @update:favoritesSchedules="updateFavoritesSchedules"
      />
    </template>
    <template #subtitle-items>
      <v-text-field
        v-model.number="crossingSubjects"
        label="Cantidad de cruces"
        hide-details
        outlined
        dense
        max="5"
        min="0"
        class="shrink"
        type="number"
      />

      <v-btn
        color="success"
        dark
        rounded
        shaped
        class="ma-1"
        @click="generateAllUserSchedules"
      >
        <v-icon>mdi-update</v-icon>
        Generar
      </v-btn>
      <v-snackbar v-model="succces" color="success" app timeout="3000">
        <v-icon> mdi-check </v-icon>
        Horarios generados correctamente!
        <template #action="{ attrs }">
          <v-btn text small icon v-bind="attrs" @click="succces = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </template>

    <template #emptyBody>
      <v-container>
        <v-alert prominent type="error">
          <v-row align="center">
            <v-col class="grow">
              Lo sentimos, no hemos encontrados horarios :(
            </v-col>
          </v-row>
        </v-alert>
        <occurrences-list :items="occurrences" />
      </v-container>
    </template>
  </schedules-presentation>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed
} from '@nuxtjs/composition-api'
import { getSchedules } from '~/utils/core'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'
import ScheduleFavoriteAdd from '~/components/ScheduleFavoriteAdd.vue'
import OccurrencesList from '~/components/OccurrencesList.vue'
import { useUserConfigStore } from '~/stores/user-config'
import { useUserEventsStore } from '~/stores/user-events'

export default defineComponent({
  components: {
    ScheduleFavoriteAdd,
    SchedulesPresentation,
    OccurrencesList
  },
  layout: 'app',
  setup () {
    const configStore = useUserConfigStore()
    const eventsStore = useUserEventsStore()
    const occurrences = ref<any[]>([])
    const openMySchedules = ref(false)
    const succces = ref(false)

    const crossingSubjects = computed({
      get: () => configStore.crossings,
      set: (crossing: number) => {
        updateCrossings(crossing)
      }
    })

    const mySubjects = computed(() => configStore.subjects)

    const updateCrossings = (crossings: number) => {
      configStore.updateCrossings(crossings)
    }

    const myEvents = computed(() => eventsStore.items)

    const myFavoritesSchedules = computed(
      () => configStore.favoritesSchedules
    )

    const updateFavoritesSchedules = (favoritesSchedules: any[]) => {
      configStore.updateFavoritesSchedules(
        favoritesSchedules
      )
    }

    const schedules = computed(() => configStore.schedules)

    const updateSchedules = (schedules: any[]) => {
      configStore.updateSchedules(schedules)
    }

    const generateAllUserSchedules = () => {
      console.log('start')
      succces.value = false
      const { occurrences: occurrencesData, combinations } = getSchedules(
        mySubjects.value,
        myEvents.value,
        {
          crossingSubjects: crossingSubjects.value
        }
      )
      updateSchedules(combinations)
      occurrences.value = occurrencesData
      succces.value = true
      console.log('end')
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
      updateSchedules,
      generateAllUserSchedules
    }
  }
})
</script>
