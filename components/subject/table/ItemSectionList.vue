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
import { getSectionColor } from '~/utils/color'

const props = defineProps<{
  schedules: Pick<ISubjectSchedule, 'section' | 'id'>[]
}>()

const { schedules } = toRefs(props)

const internalItems = computed(() => {
  return schedules.value.map((schedule) => ({
    color: getSectionColor(schedule.section.id),
    text: schedule.section.id,
    id: schedule.id,
  }))
})
</script>
