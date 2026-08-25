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
        class="mobile-session pa-3"
      >
        <div class="d-flex align-center ga-2 mb-2">
          <strong>{{ session.day }}</strong>
          <span>{{ session.time }}</span>
        </div>
        <div class="mobile-field">
          <span class="field-label">Docente</span>
          <span>{{ session.teacher }}</span>
        </div>
        <div class="mobile-details">
          <div class="mobile-field">
            <span class="field-label">Tipo</span>
            <span>{{ session.type }}</span>
          </div>
          <div class="mobile-field">
            <span class="field-label">Aula</span>
            <span>{{ session.classroom }}</span>
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
const valueSync = defineModel<ISubjectSchedule[]>({ required: true })

const isSelected = computed(() =>
  valueSync.value.some(
    (schedule) => schedule.section.id === props.schedule.section.id,
  ),
)
const checkboxId = computed(() => `mobile-section-${props.schedule.section.id}`)

const toggleSelection = () => {
  if (isSelected.value) {
    valueSync.value = valueSync.value.filter(
      (schedule) => schedule.section.id !== props.schedule.section.id,
    )
    return
  }
  valueSync.value = [...valueSync.value, props.schedule]
}

const sessions = computed(() =>
  props.schedule.sessions.map((session) => ({
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
</style>
