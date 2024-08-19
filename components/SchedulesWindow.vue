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
        v-show="mode == MODES.CALENDAR"
        :schedule="schedule"
        :week-days="weekDays"
      />
      <view-list v-show="mode == MODES.LIST" :schedule="schedule" />
      <v-divider />
      <v-footer class="text-center align-center justify-center">
        <v-pagination v-model="page" :length="schedules.length" />
      </v-footer>
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { computed, ref, watch, type WatchCallback } from 'vue'
import { useVModel } from '@vueuse/core'
import ViewList from './schedule/SubjectsTable.vue'
import ScheduleViewer from '~/components/schedule/Calendar.vue'
import { ViewMode } from '~/models/ViewMode'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import { mdiArrowRightBoldCircle, mdiArrowLeftBoldCircle } from '@mdi/js'

const props = defineProps<{
  schedules: IScheduleGenerate[]
  weekDays: number[]
  currentSchedule: IScheduleGenerate | undefined
  mode: ViewMode
}>()

const emit = defineEmits<{
  (event: 'update:currentSchedule', value: IScheduleGenerate): void
}>()

const index = ref(0)

const syncedCurrentSchedule = useVModel(props, 'currentSchedule', emit)

const MODES = ViewMode

const onChangeSchedules: WatchCallback = (newValue, oldValue) => {
  if (oldValue.length !== newValue.length) {
    index.value = 0
  }
}
watch(() => props.schedules, onChangeSchedules)

const onChangeSchedule: WatchCallback = (value) => {
  if (index.value >= props.schedules.length) {
    index.value = props.schedules.length - 1
  }
  syncedCurrentSchedule.value = value
}

const schedule = computed(() => props.schedules[index.value])

watch(schedule, onChangeSchedule, { immediate: true })

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
