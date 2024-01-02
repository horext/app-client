<template>
  <tr>
    <td class="text-left">
      {{ dayWeek }}
    </td>
    <td class="text-left">
      {{ timeInterval }}
    </td>
    <td class="text-left">
      {{ teacherFullName }}
    </td>
    <td class="text-left">
      {{ type }}
    </td>
    <td class="text-left">
      {{ classroom }}
    </td>
  </tr>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { weekdays } from '~/utils/core'

export default defineComponent({
  props: {
    session: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const dayWeek = computed(
      () => weekdays[props.session?.day]?.substring(0, 2).toUpperCase(),
    )

    const type = computed(() => props.session?.type?.code)

    const teacherFullName = computed(() => props.session?.teacher?.fullName)

    const classroom = computed(() => props.session?.classroom?.code)

    const timeInterval = computed(
      () =>
        props.session?.startTime?.substring(0, 5) +
        ' - ' +
        props.session?.endTime?.substring(0, 5),
    )

    return {
      dayWeek,
      type,
      teacherFullName,
      classroom,
      timeInterval,
    }
  },
})
</script>
