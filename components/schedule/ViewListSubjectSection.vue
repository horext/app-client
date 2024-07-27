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

const sessionsCount = computed(() => {
  return props.schedule?.sessions?.length
})

const courseName = computed(() => {
  return props.schedule?.subject?.course.name
})

const subjectSection = computed(() => {
  return props.schedule?.subject?.course.id + ' ' + props.schedule?.section?.id
})
</script>
