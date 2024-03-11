<template>
  <tbody>
    <tr v-if="loading">
      <td colspan="6">
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </td>
    </tr>
    <template v-else>
      <template v-for="schedule in schedules" :key="schedule.id">
        <ScheduleSection v-model="valueSync" :schedule="schedule" />
        <ClassSessionItem
          v-for="session in schedule.sessions"
          :key="session.id"
          :session="session"
        />
      </template>
    </template>
  </tbody>
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
