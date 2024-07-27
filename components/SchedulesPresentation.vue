<template>
  <v-card>
    <v-toolbar flat theme="dark" :color="color" class="px-2">
      <slot name="top-items-right" />
      <v-spacer />
      <ScheduleMode v-model:mode="mode" />
      <v-spacer />
      <slot name="top-items-left" :item="currentSchedule" />
    </v-toolbar>

    <div class="d-flex align-center justify-center flex-wrap ma-1">
      <slot name="subtitle" :item="currentSchedule">
        <slot name="subtitle-items" :item="currentSchedule" />
        <template v-if="schedules.length > 0">
          <schedule-external-actions
            v-if="currentSchedule"
            :mode="mode"
            :loading-export-pdf="loadingPdf"
            :loading-export-image="loadingImage"
            @click:export-pdf="downloadPdf"
            @click:export-image="downloadImage"
            @click:share="dialogShare = true"
          />
          <GoogleAuth
            v-if="currentSchedule"
            :events="currentSchedule.events"
            :end-date="endDate"
            :start-date="startDate"
          />
          <v-dialog
            v-if="currentSchedule"
            v-model="dialogShare"
            max-width="600"
          >
            <ScheduleShare
              v-model:dialog="dialogShare"
              :path="path"
              :schedule="currentSchedule"
            />
          </v-dialog>
        </template>
      </slot>
    </div>

    <v-divider />
    <schedules-list
      v-if="schedules.length > 0"
      ref="calendar"
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
import { computed, ref, defineComponent, type PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserConfigStore } from '~/stores/user-config'
import SchedulesList from '~/components/SchedulesList.vue'
import ScheduleShare from '~/components/ScheduleShare.vue'
import GoogleAuth from '~/components/GoogleAuth.vue'
import { ViewMode } from '~/models/ViewMode'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import {
  mdiCalendar,
  mdiTable,
  mdiExport,
  mdiShareVariant,
  mdiShare,
} from '@mdi/js'
import ScheduleMode from './schedule/Mode.vue'

const props = defineProps({
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
const store = useUserConfigStore()
const { weekDays, hourlyLoad } = storeToRefs(store)
const academicPeriodOrganizationUnit = computed(
  () => hourlyLoad.value?.academicPeriodOrganizationUnit!,
)

const startDate = computed(() => academicPeriodOrganizationUnit.value?.fromDate)

const endDate = computed(() => academicPeriodOrganizationUnit.value?.toDate)

const currentSchedule = ref<IScheduleGenerate>()

const dialogShare = ref(false)

const message = ref('')

const mode = ref(ViewMode.CALENDAR)

const MODES = ref(ViewMode)

const calendar = ref<ComponentPublicInstance | null>(null)

function getCalendar(): HTMLElement | null {
  return document.getElementById('calendar')
}

const loadingImage = ref(false)
async function downloadImage() {
  loadingImage.value = true
  await exportToPNG(getCalendar())
  loadingImage.value = false
}

const loadingPdf = ref(false)
async function downloadPdf() {
  loadingPdf.value = true
  await exportToPDF(getCalendar())
  loadingPdf.value = false
}
</script>
