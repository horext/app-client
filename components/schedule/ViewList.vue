<template>
  <v-simple-table dense>
    <template #default>
      <thead>
        <tr>
          <th class="text-left">
            Nombre del Curso
          </th>
          <th class="text-left">
            Curso / Sección
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
      <tbody>
        <template
          v-for="item in schedule.schedule"
        >
          <schedule-section
            :key="item.id"
            :schedule="item"
          />
          <class-session-item
            v-for="session in item.sessions"
            :key="session.id"
            :session="session"
          />
        </template>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator'
import { Component, Vue } from 'vue-property-decorator'

import ScheduleSection from './ViewListSubjectSection.vue'
import ClassSessionItem from '~/components/subject/ClassSessionItem.vue'

@Component({
  components: { ScheduleSection, ClassSessionItem },
  name: 'ScheduleViewList'
})
export default class extends Vue {
  @Prop({ type: Object })
    schedule!: any
}
</script>
