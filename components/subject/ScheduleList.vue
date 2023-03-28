<template>
  <v-card :loading="$fetchState.pending">
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <template #default>
          <thead>
            <tr>
              <th class="text-left">
                Sección
              </th>
              <th class="text-left">
                Día
              </th>
              <th class="text-left">
                Horas
              </th>
              <th class="text-left">
                Docente
              </th>
              <th class="text-left">
                Tipo
              </th>
              <th class="text-left">
                Aula
              </th>
            </tr>
          </thead>
          <ScheduleSubjectList
            v-model="selected"
            :schedules="schedules"
          />
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        text
        @click="$emit('cancel')"
      >
        Cancelar
      </v-btn>
      <v-btn color="primary" text @click="saveSections">
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'

import ScheduleSubjectList from '~/components/subject/ScheduleItem.vue'

@Component({
  components: { ScheduleSubjectList }
})
export default class SubjectScheduleList extends Vue {
  @Prop({ type: Object }) subject!: any
  @Prop({ type: Object }) hourlyLoad!: any

  async fetch () {
    if (this.subject?.id && this.hourlyLoad?.id) {
      const { data: schedulesSubject } = await this.$api.scheduleSubject.findBySubjectIdAndHourlyLoadId(
        this.subject?.id, this.hourlyLoad?.id
      )
      const ids = schedulesSubject.map((sb:any) => sb.schedule.id)
      const { data: sessions } = await this.$api.classSessions.findScheduleIds(
        ids
      )
      this.sessions = sessions
      this.schedulesSubject = schedulesSubject
    }
  }

  selected: Array<any> = []
  schedulesSubject: Array<any> = []
  sessions: Array<any> = []
  get schedules () {
    return this.schedulesSubject.map(
      sb => ({
        ...sb?.schedule,
        scheduleSubject: {
          id: sb.id
        },
        sessions: this.sessions.filter(
          s => s.schedule.id === sb.schedule.id
        )
      })
    )
  }

  saveSections () {
    this.$emit('save', this.selected)
  }

  get title () {
    return `${this.subject?.course?.id} - ${this.subject?.course?.name}`
  }

  @Watch('subject')
  async onChangeSubject () {
    await this.$fetch()
  }

  @Watch('schedules')
  onChangeSessions () {
    if (this.subject.schedules) {
      this.selected = this.schedules.filter(
        (s1: any) => {
          const schedule = this.subject.schedules.find((s2:any) => s2.section.id === s1.section.id)
          return schedule?.id === s1?.id
        }
      )
    } else {
      this.selected = []
    }
  }
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@media #{map-get($display-breakpoints, 'sm-and-down')}
  .v-data-table
    td, th
      padding: 0 10px

    td
      font-size: 0.75rem

</style>
