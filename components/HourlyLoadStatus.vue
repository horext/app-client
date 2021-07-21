<template lang="html">
  <v-card>
    <v-card-title>
      Carga horaria actualizada
    </v-card-title>
    <v-card-text>
      <v-btn @click="checkUpdateCourses">
        Inspeccionar Cursos
      </v-btn>
      <v-list>
        <v-subheader>Los siguiente cursos han sido modificados</v-subheader>
        <v-list-item
          v-for="c in courseUpdatedNeed"
          :key="c.id"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ c.name }}
            </v-list-item-title>
            <v-chip-group>
              <v-chip v-for="h in c.sections" :key="h.id">
                {{ h.section.id }}
              </v-chip>
            </v-chip-group>
          </v-list-item-content>
          <v-list-item-action />
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="updateSchedules">
        Actualizar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
export default class HourlyLoadStatus extends Vue {
  async mounted () {

  }

  newSchedules:Array<any> = []
  newBasicSchedules:Array<any> = []
  loading = false

  get courseUpdatedNeed () {
    return this.courses.map((c:any) => ({
      ...c,
      sections: c.sections.filter(
        (s:any) => (this.newBasicSchedules
          .findIndex(n =>
            n.id === s.id &&
              (s.updatedAt < n.updatedAt || !s.updatedAt)) > -1)
      )
    })).filter(c => c.sections.length > 0)
  }

  async checkUpdateCourses () {
    this.newBasicSchedules = await this.$api.$get('/schedules/status', {
      params: {
        ids: this.schedules.join(',')
      }
    })
  }

  async updateSchedules () {
    this.loading = true
    this.newSchedules = await this.$api.$get('/schedules', {
      params: {
        ids: this.schedules.join(',')
      }
    })
    this.loading = false
    this.courses = this.courses.map((c:any) => ({
      ...c,
      sections: c.sections.map(
        (s:any) => {
          const index = this.newSchedules.findIndex((n :any) => n.id === s.id)
          if (index > -1) {
            return this.newSchedules[index]
          } else {
            return s
          }
        }
      )
    }))
    const lastHourlyLoad = await this.$api.$get('/hourlyLoads', {
      params: {
        speciality: this.$storage.getUniversal('myFaculty').id
      }
    })
    this.$storage.setUniversal('myHourlyLoad', lastHourlyLoad)
    await window.location.reload()
  }

  get schedules () {
    return [].concat(...this.courses.map(
      (c:any) => c.sections.map(
        (s:any) => s.id
      )))
  }

  get courses (): Array<any> {
    return this.$store.state.modules.MyData.myCourses
  }

  set courses (courses : Array<any>) {
    this.$store.commit('modules/MyData/setMyCourses', courses)
  }
}

</script>
