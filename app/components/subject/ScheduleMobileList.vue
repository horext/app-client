<template>
  <v-skeleton-loader v-if="loading" type="card@4" />
  <ScheduleMobileSection
    v-for="option in schedules"
    v-else
    :key="option.sectionId"
    :option="option"
    :show-changes="showChanges"
  />
</template>

<script setup lang="ts">
import ScheduleMobileSection from '~/components/subject/ScheduleMobileSection.vue'
import type { PlannedSubjectSchedule } from '~/models/planned-subject'

const props = defineProps<{
  schedules: PlannedSubjectSchedule[]
  loading: boolean
  showChanges: boolean
}>()
const { schedules, loading, showChanges } = toRefs(props)
</script>
