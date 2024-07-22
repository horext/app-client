<template>
  <v-chip
    v-for="schedule in internalItems"
    :key="schedule.id"
    theme="dark"
    :color="schedule.color"
  >
    {{ schedule.text }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ISubjectSchedule } from '~/interfaces/subject'

const props = defineProps<{
  schedules: ISubjectSchedule[]
}>()

const { schedules } = toRefs(props)

const getColor = (id: string) => {
  const colors = [
    'primary',
    'secondary',
    'accent',
    'error',
    'info',
    'success',
    'warning',
  ]

  return colors[id.length % colors.length]
}

const internalItems = computed(() => {
  return schedules.value.map((schedule) => ({
    color: getColor(schedule.section.id),
    text: schedule.section.id,
    id: schedule.id,
  }))
})
</script>
