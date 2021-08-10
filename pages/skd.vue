<template>
  <v-container fluid>
    <v-card flat style="min-height: 100vh">
      <v-toolbar flat>
        <v-btn
          v-if="schedules.length>0"
          outlined
          @click="addFavoriteCurrentSchedule"
        >
          <v-icon :color="isFavorite(schedules[0])>=0?'yellow':null">
            mdi-star
          </v-icon>
          <span v-if="isFavorite(schedules[0])>=0">
            Quitar de Favoritos
          </span>
          <span v-else>
            Añadir a Favoritos
          </span>
        </v-btn>
      </v-toolbar>
      <ScheduleViewer v-for="schedule in schedules" :key="schedule.id" :schedule="schedule" />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import { getSchedules } from '~/utils/core'
import ScheduleViewer from '~/components/ScheduleViewer.vue'

@Component({
  components: {
    ScheduleViewer
  },
  layout: 'app'
})
export default class Skd extends Vue {
  query =''
  sessions = [] as Array<any>
  scheduleSubjects = [] as Array<any>
  schedules = [] as Array<any>
  loading = false
  courses = [] as Array<any>

  get myFavoritesSchedules () {
    return this.$store.state.modules.UserModule.myFavoritesSchedules
  }

  async asyncData ({ route, $api }: Context) {
    const query: any = route.query
    const result = Buffer.from(query.q, 'base64').toString()
    const { data: scheduleSubjects } = await $api.scheduleSubject
      .getAllByIds(
        result.split(',').map(Number)
      )
    const schedulesId = scheduleSubjects.map((ss:any) => ss.schedule.id)
    const { data: sessions } = await $api.classSessions.findScheduleIds(schedulesId)
    return { sessions, scheduleSubjects }
  }

  get subjects () {
    return this.scheduleSubjects.map(
      sb => ({
        ...sb.subject,
        schedules: [{
          ...sb?.schedule,
          scheduleSubject: {
            id: sb.id
          },
          sessions: this.sessions.filter(
            s => s.schedule.id === sb.schedule.id
          )
        }]
      })
    )
  }

  mounted () {
    this.loading = true
    const { combinations } = getSchedules(this.subjects, [],
      { crossingSubjects: 100 }
    )
    this.schedules = combinations
    this.loading = false
  }

  addFavoriteCurrentSchedule () {
    const index = this.isFavorite(this.schedules[0])
    console.log(index)
    if (index >= 0) {
      this.$store.commit('modules/UserModule/deleteFavoriteExternalSchedule', {
        index
      })
    } else {
      this.$store.commit('modules/UserModule/addFavoriteExternalSchedule', {
        schedule: this.schedules[0]
      })
    }
  }

  isFavorite (schedule: any) {
    return this.myFavoritesSchedules.findIndex((x: { id: any }) => x.id === schedule.id)
  }

  head = {
    title: 'Horext - Horario compartido',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Comparte tu horario a tus amigos! '
      }
    ]
  }
}

</script>

<style scoped>

</style>
