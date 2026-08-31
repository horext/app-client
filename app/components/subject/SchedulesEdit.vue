<template>
  <v-card :loading="loading">
    <v-card-title class="schedule-edit-title">
      <div class="schedule-edit-title-content w-100">
        <v-menu :close-on-content-click="false" location="right center">
          <template #activator="{ props: menuActivatorProps }">
            <v-btn
              v-bind="menuActivatorProps"
              icon
              variant="text"
              aria-label="Editar color del curso"
            >
              <v-avatar size="18" :color="current.color" />
              <v-tooltip activator="parent" location="bottom">
                Editar color del curso
              </v-tooltip>
            </v-btn>
          </template>

          <v-card min-width="260">
            <v-card-title class="text-subtitle-2">Color del curso</v-card-title>
            <v-card-text class="pt-0">
              <v-color-picker
                v-model="current.color"
                class="ma-2"
                hide-canvas
                hide-inputs
              />
            </v-card-text>
          </v-card>
        </v-menu>
        <span class="schedule-edit-heading text-headline-medium">{{
          title
        }}</span>
      </div>
    </v-card-title>
    <v-card-text>
      <v-alert
        v-if="isEditing && hasChanges"
        class="mb-4"
        density="compact"
        type="info"
        variant="tonal"
      >
        <div class="changes-alert-layout">
          <div>
            <div class="text-subtitle-2 mb-1">Cambios en tus selecciones</div>
            <div v-if="sectionChangesSummary">
              <strong>Cambios en tu selección:</strong>
              {{ sectionChangesSummary }}
            </div>
            <div v-if="sessionChangesSummary">
              <strong>Cambios en horarios de secciones guardadas:</strong>
              {{ sessionChangesSummary }}
            </div>
          </div>
          <v-btn
            v-if="originalSchedules.length"
            class="restore-selection"
            size="small"
            variant="text"
            @click="restoreSavedSelection"
          >
            Restaurar selección guardada
          </v-btn>
        </div>
      </v-alert>
      <ScheduleSubjectList
        :schedules="current.scheduleOptions"
        :show-changes="isEditing"
        :loading="loading"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="reportUrl"
        :href="reportUrl"
        target="_blank"
        rel="noopener noreferrer"
        variant="text"
        density="compact"
        size="small"
        :prepend-icon="mdiFlagOutline"
        :append-icon="mdiOpenInNew"
      >
        Informar secciones u horarios
      </v-btn>
      <v-spacer />
      <v-btn color="primary" variant="text" @click="$emit('cancel')">
        Cancelar
      </v-btn>
      <v-btn color="primary" variant="text" @click="saveSections">
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { mdiFlagOutline, mdiOpenInNew } from '@mdi/js'
import { computed, watch } from 'vue'
import ScheduleSubjectList from '~/components/subject/ScheduleItem.vue'
import type {
  IBasePlannedSubject,
  ISubjectSchedule,
  IPlannedSubject,
} from '~/interfaces/subject'
import { PlannedSubject } from '~/models/planned-subject'
import type { PlannedSubjectId } from '~~/shared/domain'

const props = defineProps<{
  planedSubject: IBasePlannedSubject | IPlannedSubject
  availableSchedules: ISubjectSchedule[]
  loading: boolean
  reportUrl?: string
}>()

const emit = defineEmits<{
  (
    event: 'save',
    value: PlannedSubject<PlannedSubjectId> | PlannedSubject<undefined>,
  ): void
  (event: 'cancel'): void
}>()

const { planedSubject, availableSchedules, loading } = toRefs(props)

const currentSelectedSchedules = computed(() => {
  const currentSchedules = availableSchedules.value
  const _subjectSchedules = planedSubject.value.schedules
  const selectedSectionIds = new Set(
    _subjectSchedules.map(({ section }) => section.id),
  )
  return {
    ...planedSubject.value,
    currentSchedules: currentSchedules.filter(({ section }) =>
      selectedSectionIds.has(section.id),
    ),
  }
})

const current = ref(
  PlannedSubject.buildFrom({
    ...planedSubject.value,
    currentSchedules: [],
  }),
)
const initialized = ref(false)

const originalSchedules = computed(() => planedSubject.value.schedules)
const isEditing = computed(() => 'id' in planedSubject.value)
const changes = computed(() =>
  current.value.changesFrom(originalSchedules.value),
)

const hasChanges = computed(
  () =>
    initialized.value &&
    (changes.value.addedSchedules.length > 0 ||
      changes.value.removedSchedules.length > 0 ||
      changes.value.removedSessions > 0 ||
      changes.value.modifiedSessions > 0),
)

const sectionChangesSummary = computed(() => {
  const summary: string[] = []
  if (changes.value.addedSchedules.length) {
    summary.push(
      `+${changes.value.addedSchedules.length} ${changes.value.addedSchedules.length === 1 ? 'sección' : 'secciones'}`,
    )
  }
  if (changes.value.removedSchedules.length) {
    summary.push(
      `-${changes.value.removedSchedules.length} ${changes.value.removedSchedules.length === 1 ? 'sección' : 'secciones'}`,
    )
  }
  return summary.join(' · ')
})

const sessionChangesSummary = computed(() => {
  const summary: string[] = []
  if (changes.value.removedSessions) {
    summary.push(
      `-${changes.value.removedSessions} ${changes.value.removedSessions === 1 ? 'eliminado' : 'eliminados'}`,
    )
  }
  if (changes.value.modifiedSessions) {
    summary.push(
      `${changes.value.modifiedSessions} ${changes.value.modifiedSessions === 1 ? 'modificado' : 'modificados'}`,
    )
  }
  return summary.join(' · ')
})

const restoreSavedSelection = () => {
  current.value.scheduleOptions.forEach((option) => {
    option.selected = option.wasSelected
  })
}

watch(
  [loading, availableSchedules],
  () => {
    if (loading.value) return
    if (initialized.value) {
      current.value.updateAvailableSchedules(availableSchedules.value)
      return
    }
    current.value = PlannedSubject.buildFrom(currentSelectedSchedules.value)
    current.value.initializeAvailableSchedules(availableSchedules.value)
    initialized.value = true
  },
  { immediate: true },
)

const saveSections = () => {
  emit('save', current.value)
}

const title = computed(() => {
  const course = planedSubject.value?.subject.course
  return `${course?.id} - ${course?.name}`
})
</script>

<style scoped>
.schedule-edit-title {
  min-width: 0;
}

.schedule-edit-heading {
  width: 0;
  flex: 1 1 0;
  min-width: 0;
  margin-left: 8px;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.schedule-edit-title-content {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  overflow: hidden;
}

.changes-alert-layout {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.restore-selection {
  flex: none;
}

@media (max-width: 959.98px) {
  .schedule-edit-title {
    position: sticky;
    top: 0;
    z-index: 2;
    background: rgb(var(--v-theme-surface));
  }

  .schedule-edit-heading {
    font-size: 1.25rem !important;
  }

  .changes-alert-layout {
    display: grid;
    gap: 8px;
  }

  .restore-selection {
    justify-self: start;
    margin-inline-start: -8px;
  }

  .v-card-actions {
    position: sticky;
    bottom: 0;
    z-index: 2;
    background: rgb(var(--v-theme-surface));
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
}
</style>
