<template>
  <v-window id="window" show-arrows continuous>
    <template #next>
      <v-icon size="large" @click="next">
        {{ mdiArrowRightBoldCircle }}
      </v-icon>
    </template>

    <template #prev>
      <v-icon size="large" @click="prev">
        {{ mdiArrowLeftBoldCircle }}
      </v-icon>
    </template>
    <v-window-item v-if="schedule">
      <schedule-viewer
        v-if="mode === MODES.CALENDAR"
        :schedule="schedule"
        :week-days="weekDays"
      />
      <view-list v-else :schedule="schedule" />
      <v-divider />
      <v-footer v-if="schedules.length > 1" width="100%" color="transparent" class="pa-0">
        <v-pagination v-model="page" :length="schedules.length" class="w-100" />
      </v-footer>
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import ViewList from './schedule/SubjectsTable.vue'
import ScheduleViewer from '~/components/schedule/Calendar.vue'
import { ViewMode } from '~/models/ViewMode'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import { mdiArrowRightBoldCircle, mdiArrowLeftBoldCircle } from '@mdi/js'
import type { Weekdays } from '~/interfaces/event'

const props = defineProps<{
  schedules: IScheduleGenerate[]
  weekDays: Weekdays[]
  currentSchedule: IScheduleGenerate | undefined
  mode: ViewMode
}>()

const emit = defineEmits<{
  (event: 'update:currentSchedule', value: IScheduleGenerate): void
}>()

const { schedules } = toRefs(props)

const index = ref(0)

const syncedCurrentSchedule = useVModel(props, 'currentSchedule', emit)

const MODES = ViewMode

const schedule = computed(() => schedules.value[index.value])

// Reset to first item only when the list size changes (new generation or removal)
watch(
  () => schedules.value.length,
  (length) => {
    if (index.value >= length) {
      index.value = 0
    }
  },
)

// Keep parent's currentSchedule in sync with the displayed schedule
watch(
  schedule,
  (value) => {
    syncedCurrentSchedule.value = value
  },
  { immediate: true },
)

const page = computed<number>({
  get() {
    return index.value + 1
  },
  set(value) {
    index.value = value - 1
  },
})

const next = () => {
  if (page.value < props.schedules.length) {
    page.value = page.value + 1
  } else {
    page.value = 1
  }
}

const prev = () => {
  if (page.value > 1) {
    page.value = page.value - 1
  } else {
    page.value = props.schedules.length
  }
}
</script>

<style lang="sass">
/* This is for documentation purposes and will not be needed in your application */
#lateral .v-btn--example
  bottom: 0
  position: absolute
  margin: 0 0 16px 16px

.v-application--is-ltr .v-window__next
  right: -28px

.v-application--is-ltr .v-window__prev
  left: -28px
</style>
