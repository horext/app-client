<template>
  <tr>
    <td :rowspan="schedule.sessions.length + 1" class="section-cell">
      <v-checkbox
        :id="schedule.section.id"
        v-model="valueSync"
        class="text-body-small"
        density="compact"
        :label="schedule.section.id"
        :value="schedule"
        hide-details
        multiple
      />
    </td>
  </tr>
  <ClassSessionItem
    v-for="session in schedule.sessions"
    :key="session.id"
    :session="session"
    :for="schedule.section.id"
  />
</template>

<script setup lang="ts">
import ClassSessionItem from '~/components/subject/ClassSessionItem.vue'
import type { ISubjectSchedule } from '~/interfaces/subject'

defineProps<{
  schedule: ISubjectSchedule
}>()

const valueSync = defineModel<ISubjectSchedule[]>({
  required: true,
})
</script>

<style>
.section-cell.active {
  background-color: #f5f5f5;
}
</style>
