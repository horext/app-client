<template>
  <v-card :loading="loading">
    <v-card-title>
      <span class="text-h5">{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <ScheduleSubjectList
        v-model="selected"
        :schedules="schedules"
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
import { computed, ref, watch } from 'vue'
import ScheduleSubjectList from '~/components/subject/ScheduleItem.vue'
import type { ISelectedSubject, ISubjectSchedule } from '~/interfaces/subject'

const props = defineProps<{
  subject: ISelectedSubject
  schedules: ISubjectSchedule[]
  loading: boolean
}>()

const emit = defineEmits<{
  (event: 'save', value: ISubjectSchedule[]): void
  (event: 'cancel'): void
}>()

const { subject, schedules } = toRefs(props)

const selected = ref<ISubjectSchedule[]>([])

const availableSchedules = computed(() => {
  const currentSchedules = schedules.value
  const subjectSchedules = subject.value.schedules
  return currentSchedules.filter((s1) => {
    const schedule = subjectSchedules.find(
      (s2) => s2.section.id === s1.section.id,
    )
    return schedule?.id === s1?.id
  })
})

watch(availableSchedules, (availableSchedules) => {
  selected.value = availableSchedules.map((s) => ({ ...s }))
})

const saveSections = () => {
  emit('save', selected.value)
}

const title = computed(() => {
  const course = subject.value?.course
  return `${course?.id} - ${course?.name}`
})
</script>
