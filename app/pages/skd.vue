<template>
  <v-container fluid>
    <v-card flat style="min-height: 100vh">
      <v-toolbar flat>
        <ScheduleShareAddFavorite
          v-if="firstSchedule"
          :schedule="firstSchedule"
          :favorites-schedules="favoritesSchedules"
          @click:add-favorite="saveNewFavoriteSchedule"
          @click:remove-favorite="deleteFavoriteScheduleById"
        />
      </v-toolbar>
      <ScheduleViewer v-if="firstSchedule" :schedule="firstSchedule" />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ScheduleViewer from '~/components/schedule/Calendar.vue'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import {
  useClassSessionApi,
  useScheduleSubjectApi,
} from '~~/modules/apis/runtime/composables'
import type { ISelectedSubject } from '~/interfaces/subject'
import { useUserFavoriteSchedules } from '~/composables/user-favorite-schedules'
import ScheduleShareAddFavorite from '../components/ScheduleShareAddFavorite.vue'

definePageMeta({
  layout: 'app',
})

useSeoMeta({
  title: 'Horario compartido',
  description: 'Comparte tu horario a tus amigos! ',
})

const scheduleSubjectApi = useScheduleSubjectApi()
const classSessionApi = useClassSessionApi()
const schedules = ref<IScheduleGenerate[]>([])
const loading = ref(false)

const firstSchedule = computed(() => schedules.value[0])
const route = useRoute()

const { data: subjects } = useAsyncData<ISelectedSubject[]>(
  'skd-subjects',
  async () => {
    const encodedQuery = route.query.q
    if (!encodedQuery) return []
    const result = decodeBase64(encodedQuery.toString())
    const scheduleSubjectIds = result.split(',').map(Number)
    const scheduleSubjects =
      await scheduleSubjectApi.getAllByIds(scheduleSubjectIds)
    const schedulesIds = scheduleSubjects.map((ss) => ss.schedule.id)
    const sessions = await classSessionApi.findScheduleIds(schedulesIds)

    return scheduleSubjects.map((sb) => ({
      ...sb.subject,
      schedules: [
        {
          ...sb?.schedule,
          scheduleSubject: {
            id: sb.id,
          },
          sessions: sessions.filter((s) => s.schedule.id === sb.schedule.id),
          subject: sb.subject,
        },
      ],
    }))
  },
  {
    default: () => [],
  },
)

const { deleteFavoriteScheduleById, saveNewFavoriteSchedule, favoritesSchedules } =
  useUserFavoriteSchedules()

const { loadSchedules } = useSchedulesGenerator()

async function fetchSchedules(subjects: ISelectedSubject[]) {
  loading.value = true
  const { combinations } = await loadSchedules(subjects, [], {
    crossingSubjects: 100,
  })
  schedules.value = combinations
  loading.value = false
}

onMounted(async () => {
  await fetchSchedules(subjects.value)
})

watch(subjects, async (subjects) => {
  await fetchSchedules(subjects)
})
</script>

<style scoped></style>
