<template>
  <v-card>
    <v-toolbar flat theme="dark" :color="color" class="px-2">
      <slot name="top-items-right" />
      <v-spacer />
      <ScheduleMode v-model:mode="mode" />
      <v-spacer />
      <slot name="top-items-left" :item="currentSchedule" />
    </v-toolbar>

    <div class="d-flex align-center justify-center flex-wrap ma-1 ga-1">
      <slot name="subtitle" :item="currentSchedule">
        <slot name="subtitle-items" :item="currentSchedule" />
        <ClientOnly>
          <ScheduleActionsBar
            v-if="schedules.length > 0 && currentSchedule"
            :current-schedule="currentSchedule"
            :mode="mode"
            :path="path"
          />
        </ClientOnly>
      </slot>
    </div>

    <v-divider />
    <schedules-list
      v-if="schedules.length > 0"
      v-model:current-schedule="currentSchedule"
      :schedules="schedules"
      :week-days="weekDays"
      :mode="mode"
    />
    <v-card-text v-else>
      <slot name="emptyBody">
        {{ emptyMessage }}
      </slot>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, shallowRef, type PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserPreferencesStore } from '~/stores/user-preferences'
import SchedulesList from '~/components/SchedulesWindow.vue'
import ScheduleActionsBar from '~/components/schedule/ActionsBar.vue'
import { ViewMode } from '~/models/ViewMode'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import ScheduleMode from './schedule/Mode.vue'

defineProps({
  schedules: {
    type: Array as PropType<IScheduleGenerate[]>,
    default: () => [],
  },
  path: {
    type: String,
    default: '/subject',
  },
  title: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'primary',
  },
  emptyMessage: {
    type: String,
    default: '',
  },
  dialog: {
    type: Boolean,
    default: false,
  },
})

const store = useUserPreferencesStore()
const { weekDays } = storeToRefs(store)

const currentSchedule = shallowRef<IScheduleGenerate>()
const mode = ref(ViewMode.CALENDAR)
</script>
