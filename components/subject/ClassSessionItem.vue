<template>
  <tr>
    <td class="text-left">
      <label :for="forLabel">{{ dayWeek }}</label>
    </td>
    <td class="text-left">
      <label :for="forLabel">{{ timeInterval }}</label>
    </td>
    <td class="text-left">
      <label :for="forLabel">{{ teacherFullName }}</label>
    </td>
    <td class="text-left">
      <label :for="forLabel">{{ type }}</label>
    </td>
    <td class="text-left">
      <label :for="forLabel">{{ classroom }}</label>
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
    for: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const { session, for: forLabel } = toRefs(props)
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
      forLabel,
    }
  },
})
</script>


<style scoped>
label {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
}
</style>
