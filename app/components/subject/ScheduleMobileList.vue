<template>
  <v-skeleton-loader v-if="loading" type="card@4" />
  <ScheduleMobileSection
    v-for="schedule in schedules"
    v-else
    :key="schedule.id"
    v-model="valueSync"
    :schedule="schedule"
  />
</template>

<script setup lang="ts">
import ScheduleMobileSection from '~/components/subject/ScheduleMobileSection.vue'
import type { ISubjectSchedule } from '~/interfaces/subject'

defineProps<{
  schedules: ISubjectSchedule[]
  loading: boolean
}>()

const valueSync = defineModel<ISubjectSchedule[]>({ required: true })
</script>
