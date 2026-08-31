<template>
  <div v-if="!loading && schedules.length" class="selection-toolbar">
    <v-checkbox-btn
      v-model="selectAll"
      aria-label="Seleccionar todas las secciones"
      :indeterminate="isPartiallySelected"
      label="Seleccionar todas"
    />
    <span class="text-caption text-medium-emphasis">
      {{ selectedCount }} de {{ schedules.length }}
    </span>
  </div>
  <ScheduleDesktopList
    v-if="mdAndUp"
    :schedules="schedules"
    :loading="loading"
    :show-changes="resolvedShowChanges"
  />
  <ScheduleMobileList
    v-else
    :schedules="schedules"
    :loading="loading"
    :show-changes="resolvedShowChanges"
  />
</template>

<script setup lang="ts">
import ScheduleDesktopList from '~/components/subject/ScheduleDesktopList.vue'
import ScheduleMobileList from '~/components/subject/ScheduleMobileList.vue'
import type { PlannedSubjectSchedule } from '~/models/planned-subject'
import { useDisplay } from 'vuetify'

const props = defineProps<{
  schedules: PlannedSubjectSchedule[]
  showChanges?: boolean
  loading: boolean
}>()
const { schedules, loading, showChanges: showChangesProp } = toRefs(props)
const { mdAndUp } = useDisplay()
const resolvedShowChanges = computed(() => showChangesProp.value ?? true)

const selectedCount = computed(
  () => schedules.value.filter(({ selected }) => selected).length,
)

const selectAll = computed({
  get: () =>
    schedules.value.length > 0 &&
    selectedCount.value === schedules.value.length,
  set: (selected: boolean) => {
    schedules.value.forEach((option) => {
      option.selected = selected
    })
  },
})

const isPartiallySelected = computed(
  () => selectedCount.value > 0 && !selectAll.value,
)
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
