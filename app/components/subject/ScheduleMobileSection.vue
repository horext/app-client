<template>
  <v-card
    class="mb-3"
    role="checkbox"
    :aria-checked="isSelected"
    tabindex="0"
    variant="outlined"
    @click="toggleSelection"
    @keydown.enter.prevent="toggleSelection"
    @keydown.space.prevent="toggleSelection"
  >
    <v-card-title class="py-2">
      <v-checkbox
        :id="checkboxId"
        v-model="valueSync"
        class="flex-grow-0"
        density="compact"
        :label="schedule.section.id"
        :value="schedule"
        hide-details
        multiple
        @click.stop
      />
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-0">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="mobile-session px-3 py-2"
      >
        <div class="session-time d-flex align-center ga-2">
          <strong>{{ session.day }}</strong>
          <span>{{ session.time }}</span>
        </div>
        <div class="mobile-field session-teacher">
          <span class="field-label">Docente:</span>
          <span class="field-value">{{ session.teacher }}</span>
        </div>
        <div class="mobile-details">
          <div class="mobile-field">
            <span class="field-label">Tipo:</span>
            <span class="field-value">{{ session.type }}</span>
          </div>
          <div class="mobile-field">
            <span class="field-label">Aula:</span>
            <span class="field-value">{{ session.classroom }}</span>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { ISubjectSchedule } from '~/interfaces/subject'
import { getWeekdayName } from '~/utils/weekday'

const props = defineProps<{ schedule: ISubjectSchedule }>()
const { schedule } = toRefs(props)
const valueSync = defineModel<ISubjectSchedule[]>({ required: true })

const isSelected = computed(() =>
  valueSync.value.some(
    (selectedSchedule) =>
      selectedSchedule.section.id === schedule.value.section.id,
  ),
)
const checkboxId = computed(() => `mobile-section-${schedule.value.section.id}`)

const toggleSelection = () => {
  if (isSelected.value) {
    valueSync.value = valueSync.value.filter(
      (selectedSchedule) =>
        selectedSchedule.section.id !== schedule.value.section.id,
    )
    return
  }
  valueSync.value = [...valueSync.value, schedule.value]
}

const sessions = computed(() =>
  schedule.value.sessions.map((session) => ({
    id: session.id,
    day: getWeekdayName(session.day)?.substring(0, 2).toUpperCase(),
    time: `${session.startTime.substring(0, 5)} - ${session.endTime.substring(0, 5)}`,
    teacher: session.teacher?.fullName,
    type: session.type?.name || session.type?.code,
    classroom: session.classroom?.name ?? session.classroom?.code,
  })),
)
</script>

<style scoped>
.v-card[role='checkbox'] {
  container-type: inline-size;
  cursor: pointer;
}

.v-card[role='checkbox']:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.mobile-session + .mobile-session {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.mobile-session {
  display: grid;
  grid-template-areas:
    'time'
    'teacher'
    'details';
  gap: 4px;
}

.session-time {
  grid-area: time;
}

.session-teacher {
  grid-area: teacher;
}

.mobile-field {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 6px;
}

.mobile-details {
  display: grid;
  grid-area: details;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field-label {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.75rem;
  flex: none;
}

.field-value {
  min-width: 0;
  overflow-wrap: anywhere;
}

@container (min-width: 480px) {
  .mobile-session {
    grid-template-areas:
      'time teacher'
      'details details';
    grid-template-columns: minmax(135px, auto) minmax(0, 1fr);
    align-items: baseline;
    column-gap: 20px;
  }
}

@container (min-width: 700px) {
  .mobile-session {
    grid-template-areas: 'time teacher details';
    grid-template-columns: minmax(135px, auto) minmax(240px, 1fr) minmax(
        260px,
        0.8fr
      );
    align-items: baseline;
    column-gap: 24px;
  }
}
</style>
