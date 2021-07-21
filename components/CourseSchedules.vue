<template>
  <v-dialog
    v-model="dialog"
    dense
    max-width="800"
    @click:outside="cancel"
    @keydown.esc="cancel"
  >
    <v-card :loading="loading">
      <v-card-title>
        <span class="headline">{{ course.code }} - {{ course.name }}</span>
      </v-card-title>
      <v-card-text>
        <v-simple-table dense>
          <template v-slot:default>
            <thead v-if="!loading">
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
            <tbody v-if="!loading">
              <template v-for="schedule in schedules">
                <tr :key="schedule.id">
                  <td :rowspan="schedule.classSessions.length+1">
                    <v-checkbox
                      :key="schedule.id"
                      v-model="selectedSections"
                      class="text-caption"
                      dense
                      :label="schedule.section.id"
                      :value="schedule"
                      multiple
                    />
                  </td>
                </tr>
                <tr v-for="(classSession) in reOrganizarHorarios(schedule.classSessions)" :key="classSession.id">
                  <template
                    v-for="(val,key) in classSession"
                  >
                    <td v-if="key!=='id'" :key="key" class="text-caption ">
                      <div class="d-flex flex-wrap">
                        {{ val }}
                      </div>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
            <v-skeleton-loader
              v-else
              :loading="loading"
              type="table-tbody"
              max-width="600px"
            />
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="cancel"
        >
          Cancelar
        </v-btn>
        <v-btn color="primary" text @click="saveSections">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'nuxt-property-decorator'
import { Course, Section } from '~/types'
import { weekdays } from '~/utils/core'

@Component
export default class CourseSchedules extends Vue {
  @PropSync('open', { type: Boolean }) dialog!: boolean;
  @Prop({ type: Object }) course!: Course
  @Prop({ type: Object }) hourlyLoad!: any

  reOrganizarHorarios (classSessions:any []) {
    const ch:any[] = []
    for (let i = 0; i < classSessions.length; i++) {
      ch[i] = {}
      ch[i].id = classSessions[i].id
      ch[i].dia = weekdays[classSessions[i].day].substring(0, 2).toUpperCase()
      ch[i].horas = classSessions[i].startTime.substring(0, 5) + ' - ' + classSessions[i].endTime.substring(0, 5)
      if (classSessions[i].teacher) { ch[i].profesor = classSessions[i].teacher.lastName + ', ' + classSessions[i].teacher.firstName }
      ch[i].tipo = classSessions[i].typeSchedule
      ch[i].aula = classSessions[i].classroom
    }
    return ch
  }

  loading=false

  @Watch('course', { immediate: true })
  async getSections (course: Course) {
    try {
      this.loading = true
      const cleanCourse = {
        sections: undefined
      }
      Object.assign(cleanCourse, course)
      delete cleanCourse.sections
      const scheduleSubjects: Array<any> = await this.$api.$get('/scheduleSubjects', {
        params: {
          subject: course.id,
          hourlyLoad: this.hourlyLoad.id
        }
      })
      this.schedules = scheduleSubjects.map((ss: any) => {
        return {
          ...ss.schedule,
          scheduleSubjectId: ss.id
        }
      })
    } catch (e) {
      this.schedules = []
    } finally {
      if (course.sections) {
        this.selectedSections = this.schedules.filter(c =>
          course.sections.findIndex((d:Section) =>
            c.id === d.id) >= 0)
      } else {
        this.selectedSections = []
      }
      this.loading = false
    }
  }

  cancel () {
    this.dialog = false
    this.$emit('cancel', this.course)
  }

  saveSections () {
    const course = { ...this.course, sections: this.selectedSections }
    this.$emit('update:course', course)
    this.dialog = false
  }

  schedules:Section[]=[]
  selectedSections:Section[]=[]
}
</script>

<style lang="sass">
  @import '~vuetify/src/styles/styles.sass'
  @media #{map-get($display-breakpoints, 'sm-and-down')}
    .v-data-table
      td , th
        padding: 0 10px
      td
       font-size: 0.75rem

</style>
