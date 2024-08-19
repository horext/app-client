<template>
  <v-table class="schedule-table" dense>
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
        <template v-for="schedule in schedules" :key="schedule.id">
          <ScheduleSection v-model="valueSync" :schedule="schedule" />
          <ClassSessionItem
            v-for="session in schedule.sessions"
            :key="session.id"
            :session="session"
            :for="schedule?.section?.id"
          />
        </template>
      </template>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { defineComponent } from 'vue'
import ClassSessionItem from '~/components/subject/ClassSessionItem.vue'
import ScheduleSection from '~/components/subject/ScheduleSection.vue'
import type { ISubjectSchedule } from '~/interfaces/subject'

export default defineComponent({
  components: { ScheduleSection, ClassSessionItem },
  props: {
    schedules: {
      type: Array as PropType<ISubjectSchedule[]>,
      required: true,
    },
    modelValue: {
      type: Array as PropType<ISubjectSchedule[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const valueSync = useVModel(props, 'modelValue', emit)

    return {
      valueSync,
    }
  },
})
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
</style>
