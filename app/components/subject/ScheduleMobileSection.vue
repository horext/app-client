<template>
  <v-card
    class="mb-3"
    :class="{ 'added-section': isAddedToSelection }"
    role="checkbox"
    :aria-checked="option.selected"
    tabindex="0"
    variant="outlined"
    @click="toggleSelection"
    @keydown.enter.prevent="toggleSelection"
    @keydown.space.prevent="toggleSelection"
  >
    <v-card-title class="d-flex align-center py-2">
      <v-checkbox
        :id="checkboxId"
        :model-value="option.selected"
        class="flex-grow-0"
        density="compact"
        :label="schedule.section.id"
        hide-details
        @click.stop
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
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-0">
      <div
        v-for="session in sessionCards"
        :key="session.id"
        class="mobile-session pa-3"
        :class="{ 'changed-session': session.isModified }"
      >
        <div class="d-flex align-center flex-wrap ga-2 mb-2">
          <strong>{{ session.day }}</strong>
          <span>{{ session.time }}</span>
          <v-chip v-if="session.isModified" color="info" size="x-small">
            Modificado
          </v-chip>
        </div>
        <div class="mobile-field">
          <span class="field-label">Docente</span>
          <span>{{ session.teacher }}</span>
          <span v-if="session.teacherBefore" class="field-change">
            Antes: <del>{{ session.teacherBefore }}</del>
          </span>
        </div>
        <div class="mobile-details">
          <div class="mobile-field">
            <span class="field-label">Tipo</span>
            <span>{{ session.type }}</span>
            <span v-if="session.typeBefore" class="field-change">
              Antes: <del>{{ session.typeBefore }}</del>
            </span>
          </div>
          <div class="mobile-field">
            <span class="field-label">Aula</span>
            <span>{{ session.classroom }}</span>
            <span v-if="session.classroomBefore" class="field-change">
              Antes: <del>{{ session.classroomBefore }}</del>
            </span>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useScheduleSection } from '~/composables/use-schedule-section'
import type { PlannedSubjectSchedule } from '~/models/planned-subject'
import { getWeekdayName } from '~/utils/weekday'

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
const checkboxId = computed(() => `mobile-section-${schedule.value.section.id}`)

const toggleSelection = () => {
  emit('update:selected', !option.value.selected)
}

const sessionCards = computed(() =>
  schedule.value.sessions.map((session) => {
    const state = sessionStates.value[session.id]
    const changes = state?.changeDetails ?? []
    const byField = Object.fromEntries(
      changes.map((change) => [change.field, change]),
    )
    return {
      id: session.id,
      day: getWeekdayName(session.day)?.substring(0, 2).toUpperCase(),
      time: `${session.startTime.substring(0, 5)} - ${session.endTime.substring(0, 5)}`,
      teacher: session.teacher?.fullName,
      type: session.type?.name || session.type?.code,
      classroom: session.classroom?.name ?? session.classroom?.code,
      isModified: state?.isModified ?? false,
      teacherBefore: byField.teacher?.before,
      typeBefore: byField.type?.before,
      classroomBefore: byField.classroom?.before,
    }
  }),
)
</script>

<style scoped>
.added-section,
.changed-session {
  background-color: rgba(var(--v-theme-success), 0.06);
}

.v-card[role='checkbox'] {
  cursor: pointer;
}

.v-card[role='checkbox']:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.mobile-session + .mobile-session {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.mobile-field {
  display: grid;
  min-width: 0;
}

.mobile-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 10px;
}

.field-label {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.75rem;
}

.field-change {
  color: rgb(var(--v-theme-info));
  font-size: 0.75rem;
}
</style>
