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
import { WEEK_DAYS_NAMES } from '~/constants/weekdays'

export default defineComponent({
  props: {
    session: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { session } = toRefs(props)
    const dayWeek = computed(() =>
      WEEK_DAYS_NAMES[session.value?.day]?.substring(0, 2).toUpperCase(),
    )

    const type = computed(() => session.value?.type?.code)

    const teacherFullName = computed(() => session.value?.teacher?.fullName)

    const classroom = computed(() => session.value?.classroom?.code)

    const timeInterval = computed(
      () =>
        session.value?.startTime?.substring(0, 5) +
        ' - ' +
        session.value?.endTime?.substring(0, 5),
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
