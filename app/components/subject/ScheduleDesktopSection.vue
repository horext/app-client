<template>
  <tr>
    <td :rowspan="sectionRowspan" class="section-cell">
      <v-checkbox
        :id="sectionId"
        v-model="valueSync"
        class="text-body-small"
        density="compact"
        :label="sectionId"
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
import { computed } from 'vue'
import type { ISubjectSchedule } from '~/interfaces/subject'

const props = defineProps<{
  schedule: ISubjectSchedule
}>()

const valueSync = defineModel<ISubjectSchedule[]>({
  required: true,
})
const { schedule } = toRefs(props)

const sectionRowspan = computed(() => {
  return schedule.value.sessions?.length + 1
})

const sectionId = computed(() => {
  return schedule.value.section?.id
})
</script>

<style>
.section-cell.active {
  background-color: #f5f5f5;
}
</style>
