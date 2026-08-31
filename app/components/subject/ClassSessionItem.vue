<template>
  <tr :class="{ 'changed-row': isModified }">
    <td class="text-left">
      <label :for="forLabel">{{ dayWeek }}</label>
    </td>
    <td class="text-left">
      <label :for="forLabel">
        {{ timeInterval }}
        <v-chip v-if="isModified" class="ml-2" color="info" size="x-small">
          Modificado
        </v-chip>
      </label>
    </td>
    <td class="text-left">
      <label :for="forLabel">
        <span>{{ teacherFullName }}</span>
        <span v-if="changesByField.teacher?.before" class="field-change">
          Antes: <del>{{ changesByField.teacher.before }}</del>
        </span>
      </label>
    </td>
    <td class="text-left">
      <label :for="forLabel">
        <span>{{ type }}</span>
        <span v-if="changesByField.type?.before" class="field-change">
          Antes: <del>{{ changesByField.type.before }}</del>
        </span>
      </label>
    </td>
    <td class="text-left">
      <label :for="forLabel">
        <span>{{ classroom }}</span>
        <span v-if="changesByField.classroom?.before" class="field-change">
          Antes: <del>{{ changesByField.classroom.before }}</del>
        </span>
      </label>
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
  isModified?: boolean
  changeDetails?: Array<{
    field: string
    before: string
    after: string
  }>
}>()

const { session, for: forLabel } = toRefs(props)
const changesByField = computed(() =>
  Object.fromEntries(
    (props.changeDetails ?? []).map((change) => [change.field, change]),
  ),
)
const dayWeek = computed(() =>
  getWeekdayName(session.value?.day ?? 0)
    ?.substring(0, 2)
    .toUpperCase(),
)

const type = computed(() => {
  const type = session.value?.type
  return type?.name || type?.code
})

const teacherFullName = computed(() => session.value?.teacher?.fullName)

const classroom = computed(() => {
  const classroom = session.value?.classroom
  return classroom?.name ?? classroom?.code
})

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
  flex-wrap: wrap;
}

.changed-row {
  background-color: rgba(var(--v-theme-success), 0.06);
}

.field-change {
  width: 100%;
  color: rgb(var(--v-theme-info));
  font-size: 0.75rem;
  white-space: normal;
}
</style>
