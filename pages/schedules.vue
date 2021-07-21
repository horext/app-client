<template lang="html">
  <v-container fluid>
    <v-card flat style="min-height: 100vh">
      <v-toolbar flat>
        <v-btn
          v-if="horarios.length>0"
          outlined
          @click="addFavoriteCurrentSchedule"
        >
          <v-icon :color="isFavorite(horarios[0])>=0?'yellow':null">
            mdi-star
          </v-icon>
          <span v-if="isFavorite(horarios[0])>=0">
            Quitar de Favoritos
          </span>
          <span v-else>
            Añadir a Favoritos
          </span>
        </v-btn>
      </v-toolbar>
      <ScheduleViewer v-for="schedule in horarios" :key="schedule.id" :schedule="schedule" />
      <v-overlay :value="loading" absolute z-index="0">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { generate } from '~/utils/core'
import ScheduleViewer from '~/components/ScheduleViewer.vue'

@Component({
  components: {
    ScheduleViewer
  },
  layout: 'app'
})
export default class Schedule extends Vue {
  query =''
  horarios = [] as Array<any>
  loading = false
  courses = [] as Array<any>
  get myFavoritesSchedules () {
    return this.$store.state.modules.UserModule.myFavoritesSchedules
  }

  async mounted () {
    const query: any = this.$nuxt.context.query
    this.query = atob(query.q)
    const courses = [...new Set(this.query.split(','))]
    this.loading = true

    const scheduleSubjects:Array<any> = await this.$api.$get('/scheduleSubjects', {
      params: {
        ids: courses.join(',')
      }
    })
    this.courses = scheduleSubjects.map(
      (ss:any) => ({
        ...ss.subject,
        sections: [ss.schedule]
      })
    )
    /*    for (let i = 0; i < courses.length; i++) {
      const course = courses[i]
      if (course) {
        const scheduleSubjects = await this.$api.$get('/scheduleSubjects/' + course)
        this.courses.push({
          ...scheduleSubjects.subject,
          sections: [scheduleSubjects.schedule]
        })
      }
    } */
    const { schedules } = generate(this.courses, [], 100)
    this.horarios = schedules
    this.loading = false
  }

  addFavoriteCurrentSchedule () {
    const index = this.isFavorite(this.horarios[0])
    console.log(index)
    if (index >= 0) {
      this.$store.commit('modules/UserModule/deleteFavoriteExternalSchedule', {
        index
      })
    } else {
      this.$store.commit('modules/UserModule/addFavoriteExternalSchedule', {
        schedule: this.horarios[0]
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
