<template>
  <tr>
    <td :rowspan="sessionsCount + 1">
      {{ courseName }}
    </td>
    <td :rowspan="sessionsCount + 1">
      {{ subjectSection }}
    </td>
  </tr>
</template>

<script setup lang="ts">
import { type PropType, computed } from 'vue'
import type { ISubjectSchedule } from '~/interfaces/subject'

const props = defineProps({
  schedule: {
    type: Object as PropType<ISubjectSchedule>,
    required: true,
  },
})
const { schedule } = toRefs(props)
const sessionsCount = computed(() => {
  return schedule.value.sessions?.length
})

const courseName = computed(() => {
  return schedule.value.subject?.course.name
})

const subjectSection = computed(() => {
  return schedule.value.subject?.course.id + ' ' + schedule.value.section?.id
})
</script>
