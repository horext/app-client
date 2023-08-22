<template>
  <v-container fluid>
    <v-card flat style="min-height: 100vh">
      <v-toolbar flat>
        <v-btn
          v-if="schedules.length > 0"
          outlined
          @click="addFavoriteCurrentSchedule"
        >
          <v-icon :color="isFavorite(schedules[0]) >= 0 ? 'yellow' : null">
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
import { useAsync, useRoute } from '@nuxtjs/composition-api'
import { getSchedules } from '~/utils/core'
import ScheduleViewer from '~/components/ScheduleViewer.vue'
import { $api } from '~/utils/api'
import { useUserConfigStore } from '~/stores/user-config'

export default defineComponent({
  components: {
    ScheduleViewer,
  },
  layout: 'app',
  setup() {
    const query = ref('')
    const schedules = ref<any[]>([])
    const loading = ref(false)
    const courses = ref([])

    const store = useUserConfigStore()

    const myFavoritesSchedules = computed(() => store.favoritesSchedules)
    const route = useRoute()

    const data = useAsync(async () => {
      const query: any = route.value.query
      const result = Buffer.from(query.q, 'base64').toString()
      const { data: scheduleSubjects } = await $api.scheduleSubject.getAllByIds(
        result.split(',').map(Number)
      )
      const schedulesId = scheduleSubjects.map((ss: any) => ss.schedule.id)
      const { data: sessions } = await $api.classSessions.findScheduleIds(
        schedulesId
      )
      return { scheduleSubjects, sessions }
    })

    const scheduleSubjects = computed(() => data.value?.scheduleSubjects)
    const sessions = computed(() => data.value?.sessions)

    const deleteFavoriteScheduleById = (favorites: any) =>
      store.deleteFavoriteScheduleById(favorites)

    const saveNewFavoriteSchedule = (favorites: any) =>
      store.saveNewFavoriteSchedule(favorites)

    const subjects = computed(() => {
      return scheduleSubjects.value.map((sb: any) => ({
        ...sb.subject,
        schedules: [
          {
            ...sb?.schedule,
            scheduleSubject: {
              id: sb.id,
            },
            sessions: sessions.value.filter(
              (s: any) => s.schedule.id === sb.schedule.id
            ),
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

    const isFavorite = (schedule: any) => {
      return myFavoritesSchedules.value.findIndex(
        (x: { id: any }) => x.id === schedule.id
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
  head() {
    return {
      title: 'Horario compartido',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Comparte tu horario a tus amigos! ',
        },
      ],
    }
  },
})
</script>

<style scoped></style>
