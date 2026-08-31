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

const props = defineProps<{
  schedules: ISubjectSchedule[]
  loading: boolean
}>()
const emit = defineEmits<{
  (event: 'select-all', selected: boolean): void
}>()
const { schedules } = toRefs(props)
const { mdAndUp } = useDisplay()

const valueSync = defineModel<ISubjectSchedule[]>({
  required: true,
})

const availableSectionIds = computed(
  () => new Set(schedules.value.map((schedule) => schedule.section.id)),
)

const selectedCount = computed(
  () =>
    new Set(
      valueSync.value
        .filter((schedule) =>
          availableSectionIds.value.has(schedule.section.id),
        )
        .map((schedule) => schedule.section.id),
    ).size,
)

const selectAll = computed({
  get: () =>
    schedules.value.length > 0 &&
    selectedCount.value === schedules.value.length,
  set: (selected: boolean) => {
    emit('select-all', selected)
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
