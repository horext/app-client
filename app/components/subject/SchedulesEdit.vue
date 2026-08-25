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
      <ScheduleSubjectList
        v-model="current.schedules"
        :schedules="availableSchedules"
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

const { planedSubject, availableSchedules } = toRefs(props)

const currentSelectedSchedules = computed(() => {
  const currentSchedules = availableSchedules.value
  const _subjectSchedules = planedSubject.value.schedules
  return {
    ...planedSubject.value,
    currentSchedules: currentSchedules.filter((s1) => {
      const schedule = _subjectSchedules.find(
        (s2) => s2.section.id === s1.section.id,
      )
      return schedule?.id === s1?.id
    }),
  }
})

const current = ref(PlannedSubject.buildFrom(currentSelectedSchedules.value))

watch(currentSelectedSchedules, (availableSchedules) => {
  current.value = PlannedSubject.buildFrom(availableSchedules)
})

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

  .v-card-actions {
    position: sticky;
    bottom: 0;
    z-index: 2;
    background: rgb(var(--v-theme-surface));
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
}
</style>
