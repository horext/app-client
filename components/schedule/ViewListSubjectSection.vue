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
import { defineComponent, PropType, computed } from 'vue'

export default defineComponent({
  props: {
    schedule: {
      type: Object as PropType<any>,
      default: () => ({}),
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
