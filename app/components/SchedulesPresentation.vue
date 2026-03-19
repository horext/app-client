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
          <template v-if="currentSchedule">
            <GoogleCalendarConnect
              :loading="isPendingClient"
              @click="handleGoogleAuthClick"
            />
            <GoogleSignInDialog
              v-model="dialogSignIn"
              @signed-in="dialogSync = true"
            />
            <GoogleCalendarSyncDialog
              v-model="dialogSync"
              :events="currentSchedule.events"
              :end-date="endDate"
              :start-date="startDate"
            />
          </template>
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
import { computed, ref, watch, type PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserConfigStore } from '~/stores/user-config'
import SchedulesList from '~/components/SchedulesWindow.vue'
import ScheduleShare from '~/components/schedule/ShareCard.vue'
import GoogleCalendarConnect from '~/components/google/calendar/Connect.vue'
import GoogleSignInDialog from '~/components/google/SignInDialog.vue'
import GoogleCalendarSyncDialog from '~/components/google/calendar/SyncDialog.vue'
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
const store = useUserConfigStore()
const { weekDays, hourlyLoad } = storeToRefs(store)
const { isSignedIn, isPendingClient } = useGoogleOAuth2()

function handleGoogleAuthClick() {
  if (isSignedIn.value) {
    dialogSync.value = true
  } else {
    dialogSignIn.value = true
  }
}
const academicPeriodOrganizationUnit = computed(
  () => hourlyLoad.value?.academicPeriodOrganizationUnit,
)

const startDate = computed(() => academicPeriodOrganizationUnit.value?.fromDate)

const endDate = computed(() => academicPeriodOrganizationUnit.value?.toDate)

const currentSchedule = ref<IScheduleGenerate>()

const dialogShare = ref(false)
const dialogSignIn = ref(false)
const dialogSync = ref(false)

watch(isSignedIn, (value) => {
  if (value) {
    dialogSignIn.value = false
    dialogSync.value = true
  }
})

const mode = ref(ViewMode.CALENDAR)

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
