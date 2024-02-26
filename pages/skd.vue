<template>
  <v-container fluid>
    <v-card flat style="min-height: 100vh">
      <v-toolbar flat>
        <v-btn
          v-if="schedules.length > 0"
          variant="outlined"
          @click="addFavoriteCurrentSchedule"
        >
          <v-icon :color="isFavorite(schedules[0]) >= 0 ? 'yellow' : undefined">
            mdi-star
          </v-icon>
          <span v-if="isFavorite(schedules[0]) >= 0">
            Quitar de Favoritos
          </span>
          <span v-else> Añadir a Favoritos </span>
        </v-btn>
      </v-toolbar>
      <ScheduleViewer
        v-for="schedule in schedules"
        :key="schedule.id"
        :schedule="schedule"
      />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { getSchedules } from '~/utils/core'
import ScheduleViewer from '~/components/ScheduleViewer.vue'
import { useUserConfigStore } from '~/stores/user-config'
import { useApi } from '~/composables/api'
import type { ISchedule } from '~/interfaces/schedule'

definePageMeta({
  layout: 'app',
})

useSeoMeta({
  title: 'Horario compartido',
  description: 'Comparte tu horario a tus amigos! ',
})

export default defineComponent({
  components: {
    ScheduleViewer,
  },
  setup() {
    const $api = useApi()
    const query = ref('')
    const schedules = ref<ISchedule[]>([])
    const loading = ref(false)
    const courses = ref([])

    const store = useUserConfigStore()

    const myFavoritesSchedules = computed(() => store.favoritesSchedules)
    const route = useRoute()

    const { data } = useAsyncData(async () => {
      const query: any = route.query
      const result = decodeBase64(query.q)
      const scheduleSubjects = await $api.scheduleSubject.getAllByIds(
        result.split(',').map(Number),
      )
      const schedulesId = scheduleSubjects.map((ss) => ss.schedule.id)
      const sessions = await $api.classSessions.findScheduleIds(schedulesId)
      return { scheduleSubjects, sessions }
    })

    const scheduleSubjects = computed(() => data.value?.scheduleSubjects || [])
    const sessions = computed(() => data.value?.sessions || [])

    const deleteFavoriteScheduleById = (favorites: ISchedule) =>
      store.deleteFavoriteScheduleById(favorites.id)

    const saveNewFavoriteSchedule = (favorites: ISchedule) =>
      store.saveNewFavoriteSchedule(favorites)

    const subjects = computed(() => {
      const _sessions = sessions.value
      return scheduleSubjects.value.map((sb) => ({
        ...sb.subject,
        schedules: [
          {
            ...sb?.schedule,
            scheduleSubject: {
              id: sb.id,
            },
            sessions: _sessions.filter((s) => s.schedule.id === sb.schedule.id),
            subject: sb.subject,
          },
        ],
      }))
    })

    async function fetchSchedules() {
      loading.value = true
      const { combinations } = await getSchedules(subjects.value, [], {
        crossingSubjects: 100,
      })
      schedules.value = combinations
      loading.value = false
    }

    onMounted(async () => {
      await fetchSchedules()
    })

    const addFavoriteCurrentSchedule = () => {
      const index = isFavorite(schedules.value[0])
      if (index >= 0) {
        deleteFavoriteScheduleById(schedules.value[0])
      } else {
        saveNewFavoriteSchedule(schedules.value[0])
      }
    }

    const isFavorite = (schedule: ISchedule) => {
      return myFavoritesSchedules.value.findIndex(
        (x: { id: any }) => x.id === schedule.id,
      )
    }

    return {
      query,
      sessions,
      scheduleSubjects,
      schedules,
      loading,
      courses,
      addFavoriteCurrentSchedule,
      isFavorite,
      myFavoritesSchedules,
    }
  },
})
</script>

<style scoped></style>
