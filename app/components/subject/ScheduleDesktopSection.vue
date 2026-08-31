<template>
  <tr :class="{ 'added-row': isAddedToSelection }">
    <td :rowspan="schedule.sessions.length + 1" class="section-cell">
      <v-checkbox
        :id="schedule.section.id"
        :model-value="option.selected"
        class="text-body-small"
        density="compact"
        :label="schedule.section.id"
        hide-details
        @update:model-value="emit('update:selected', Boolean($event))"
      />
      <v-chip
        v-if="isAddedToSelection"
        class="ml-2"
        color="success"
        size="x-small"
      >
        Nueva selección
      </v-chip>
    </td>
  </tr>
  <ClassSessionItem
    v-for="session in schedule.sessions"
    :key="session.id"
    :session="session"
    :for="schedule.section.id"
    :is-modified="sessionStates[session.id]?.isModified"
    :change-details="sessionStates[session.id]?.changeDetails"
  />
</template>

<script setup lang="ts">
import ClassSessionItem from '~/components/subject/ClassSessionItem.vue'
import { useScheduleSection } from '~/composables/use-schedule-section'
import type { PlannedSubjectSchedule } from '~/models/planned-subject'

const props = defineProps<{
  option: PlannedSubjectSchedule
  showChanges: boolean
}>()
const emit = defineEmits<{
  (event: 'update:selected', selected: boolean): void
}>()
const { option, showChanges } = toRefs(props)
const { schedule, isAddedToSelection, sessionStates } = useScheduleSection(
  option,
  showChanges,
)
</script>

<style>
.section-cell.active {
  background-color: #f5f5f5;
}

.added-row {
  background-color: rgba(var(--v-theme-success), 0.06);
}
</style>
