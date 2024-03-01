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
<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue'
import type { ISubjectSchedule } from '~/interfaces/subject'

export default defineComponent({
  props: {
    schedule: {
      type: Object as PropType<ISubjectSchedule>,
      required: true,
    },
  },
  setup(props) {
    const sessionsCount = computed(() => {
      return props.schedule?.sessions?.length
    })

    const courseName = computed(() => {
      return props.schedule?.subject?.course.name
    })

    const subjectSection = computed(() => {
      return (
        props.schedule?.subject?.course.id + ' ' + props.schedule?.section?.id
      )
    })

    return {
      sessionsCount,
      courseName,
      subjectSection,
    }
  },
})
</script>
