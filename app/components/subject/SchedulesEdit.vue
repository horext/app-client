<template>
  <v-card :loading="loading">
    <v-card-title>
      <div class="d-flex align-center w-100">
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
        <v-spacer />
        <span class="text-headline-medium">{{ title }}</span>
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
import { computed, watch } from 'vue'
import ScheduleSubjectList from '~/components/subject/ScheduleItem.vue'
import type {
  IBaseSubjectSchedules,
  ISubjectSchedule,
  ISubjectSchedules,
} from '~/interfaces/subject'
import { SubjectSchedules } from '~/models/subject-schedules'
import type { UUID } from 'crypto'

const props = defineProps<{
  subjectSchedules: IBaseSubjectSchedules | ISubjectSchedules
  availableSchedules: ISubjectSchedule[]
  loading: boolean
}>()

const emit = defineEmits<{
  (
    event: 'save',
    value: SubjectSchedules<UUID> | SubjectSchedules<undefined>,
  ): void
  (event: 'cancel'): void
}>()

const { subjectSchedules, availableSchedules } = toRefs(props)

const currentSelectedSchedules = computed(() => {
  const currentSchedules = availableSchedules.value
  const _subjectSchedules = subjectSchedules.value.schedules
  return currentSchedules.filter((s1) => {
    const schedule = _subjectSchedules.find(
      (s2) => s2.section.id === s1.section.id,
    )
    return schedule?.id === s1?.id
  })
})

const current = ref(
  SubjectSchedules.buildFrom(
    subjectSchedules.value,
    currentSelectedSchedules.value,
  ),
)

watch(currentSelectedSchedules, (availableSchedules) => {
  current.value.schedules = availableSchedules.map((s) => ({ ...s }))
})

const saveSections = () => {
  emit('save', current.value)
}

const title = computed(() => {
  const course = subjectSchedules.value?.subject.course
  return `${course?.id} - ${course?.name}`
})
</script>
