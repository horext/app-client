<template>
  <tr>
    <td :rowspan="sessionsCount + 1" class="section-cell">
      <v-checkbox
        :id="section"
        v-model="valueSync"
        class="text-caption"
        density="compact"
        :label="section"
        :value="schedule"
        hide-details
        multiple
      />
    </td>
  </tr>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { ISubjectSchedule } from '~/interfaces/subject'

const props = defineProps<{
  schedule: ISubjectSchedule
  modelValue: ISubjectSchedule[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: ISubjectSchedule[]): void
}>()

const valueSync = useVModel(props, 'modelValue', emit)
const { schedule } = toRefs(props)

const sessionsCount = computed(() => {
  return schedule.value?.sessions?.length
})

const section = computed(() => {
  return schedule.value?.section?.id
})
</script>

<style>
.section-cell.active {
  background-color: #f5f5f5;
}
</style>
