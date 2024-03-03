<template>
  <v-window id="window" show-arrows continuous>
    <template #next>
      <v-icon size="large" @click="next"> mdi-arrow-right-bold-circle </v-icon>
    </template>

    <template #prev>
      <v-icon size="large" @click="prev"> mdi-arrow-left-bold-circle </v-icon>
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

<script lang="ts">
import { defineComponent, computed, ref, watch, type WatchCallback } from 'vue'
import { useVModel } from '@vueuse/core'
import ViewList from './schedule/ViewList.vue'
import ScheduleViewer from '~/components/ScheduleViewer.vue'
import { ViewMode } from '~/models/ViewMode'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export default defineComponent({
  name: 'SchedulesList',

  components: {
    ScheduleViewer,
    ViewList,
  },

  props: {
    schedules: {
      type: Array as PropType<IScheduleGenerate[]>,
      default: () => [],
    },
    weekDays: {
      type: Array,
      default: () => [1, 2, 3, 4, 5, 6],
    },
    currentSchedule: {
      type: Object as PropType<IScheduleGenerate | undefined>,
      default: () => undefined,
    },
    mode: {
      type: String,
      default: () => ViewMode.CALENDAR,
    },
  },
  emits: ['update:currentSchedule'],
  setup(props, { emit }) {
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

    const shareDialog = ref(false)
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

    return {
      schedule,
      page,
      next,
      prev,
      MODES,
      shareDialog,
    }
  },
})
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
