<template>
  <div v-if="!loading && schedules.length" class="selection-toolbar">
    <v-checkbox-btn
      :model-value="allSelected"
      aria-label="Seleccionar todas las secciones"
      :indeterminate="partiallySelected"
      label="Seleccionar todas"
      @update:model-value="emit('select-all', $event)"
    />
    <span class="text-caption text-medium-emphasis">
      {{ selectedCount }} de {{ totalCount }}
    </span>
  </div>
  <ScheduleDesktopList
    v-if="mdAndUp"
    v-model="valueSync"
    :schedules="schedules"
    :loading="loading"
  />
  <ScheduleMobileList
    v-else
    v-model="valueSync"
    :schedules="schedules"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import ScheduleDesktopList from '~/components/subject/ScheduleDesktopList.vue'
import ScheduleMobileList from '~/components/subject/ScheduleMobileList.vue'
import type { ISubjectSchedule } from '~/interfaces/subject'
import { useDisplay } from 'vuetify'

defineProps<{
  schedules: ISubjectSchedule[]
  loading: boolean
  allSelected: boolean
  partiallySelected: boolean
  selectedCount: number
  totalCount: number
}>()
const emit = defineEmits<{
  (event: 'select-all', selected: boolean): void
}>()
const { mdAndUp } = useDisplay()

const valueSync = defineModel<ISubjectSchedule[]>({
  required: true,
})
</script>

<style>
.selection-toolbar {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.selection-toolbar .v-checkbox-btn,
.selection-toolbar .v-label,
.selection-toolbar .text-caption {
  flex: none;
  white-space: nowrap;
}
</style>
