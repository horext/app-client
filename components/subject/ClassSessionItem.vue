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
<script setup lang="ts">
import { computed } from 'vue'
import type { ISession } from '~/interfaces/subject'
import { getWeekdayName } from '~/utils/weekday'

const props = defineProps<{
  session: ISession
  for?: string
}>()

const { session, for: forLabel } = toRefs(props)
const dayWeek = computed(() =>
  getWeekdayName(session.value?.day ?? 0)
    ?.substring(0, 2)
    .toUpperCase(),
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
</script>

<style scoped>
label {
  display: flex;
  width: 100%;
  min-height: 100%;
  align-items: center;
}
</style>
