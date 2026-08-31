<template>
  <v-table class="schedule-table" density="comfortable">
    <thead>
      <tr>
        <th class="text-left">Sección</th>
        <th class="text-left">Día</th>
        <th class="text-left">Horas</th>
        <th class="text-left">Docente</th>
        <th class="text-left">Tipo</th>
        <th class="text-left">Aula</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td colspan="6">
          <v-skeleton-loader type="table-row@10" />
        </td>
      </tr>
      <template v-else>
        <ScheduleDesktopSection
          v-for="option in schedules"
          :key="option.sectionId"
          :option="option"
          :show-changes="showChanges"
          @update:selected="emit('update:selected', option.sectionId, $event)"
        />
      </template>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import ScheduleDesktopSection from '~/components/subject/ScheduleDesktopSection.vue'
import type { PlannedSubjectSchedule } from '~/models/planned-subject'

const props = defineProps<{
  schedules: PlannedSubjectSchedule[]
  loading: boolean
  showChanges: boolean
}>()
const emit = defineEmits<{
  (event: 'update:selected', sectionId: string, selected: boolean): void
}>()
const { schedules, loading, showChanges } = toRefs(props)
</script>

<style>
.schedule-table.v-table > .v-table__wrapper > table > tbody > tr > td,
.schedule-table.v-table > .v-table__wrapper > table > tbody > tr > th,
.schedule-table.v-table > .v-table__wrapper > table > thead > tr > td,
.schedule-table.v-table > .v-table__wrapper > table > thead > tr > th,
.schedule-table.v-table > .v-table__wrapper > table > tfoot > tr > td,
.schedule-table.v-table > .v-table__wrapper > table > tfoot > tr > th {
  padding: 0 6px;
}

.schedule-table.v-table > .v-table__wrapper > table > tbody > tr > td {
  transition: background-color 120ms ease;
}

.schedule-table.v-table > .v-table__wrapper > table > tbody > tr:hover > td {
  background-color: rgba(var(--v-theme-primary), 0.06);
}
</style>
