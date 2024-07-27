<template>
  <v-table dense>
    <template #default>
      <thead>
        <tr>
          <th class="text-left">Nombre del Curso</th>
          <th class="text-left">Curso / Sección</th>
          <th class="text-left">Día</th>
          <th class="text-left">Horas</th>
          <th class="text-left">Docente</th>
          <th class="text-left">Tipo</th>
          <th class="text-left">Aula</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in schedule.schedule" :key="item.id">
          <schedule-section :schedule="item" />
          <class-session-item
            v-for="session in item.sessions"
            :key="session.id"
            :session="session"
          />
        </template>
      </tbody>
    </template>
  </v-table>
</template>

<script setup lang="ts">
import ScheduleSection from './ViewListSubjectSection.vue'
import ClassSessionItem from '~/components/subject/ClassSessionItem.vue'
import type { IScheduleGenerate } from '~/interfaces/schedule'

defineProps({
  schedule: {
    type: Object as PropType<IScheduleGenerate>,
    required: true,
  },
})
</script>
