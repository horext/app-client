<template>
  <schedule-external-actions
    :mode="mode"
    :loading-export-pdf="loadingPdf"
    :loading-export-image="loadingImage"
    @click:export-pdf="downloadPdf"
    @click:export-image="downloadImage"
    @click:share="dialogShare = true"
  />
  <GoogleCalendarConnect
    :loading="isPendingClient"
    @click="handleGoogleAuthClick"
  />
  <GoogleSignInDialog v-model="dialogSignIn" @signed-in="dialogSync = true" />
  <GoogleCalendarSyncDialog
    v-model="dialogSync"
    :events="currentSchedule.events"
    :end-date="endDate"
    :start-date="startDate"
  />
  <v-dialog v-model="dialogShare" max-width="600">
    <ScheduleShare
      v-model:dialog="dialogShare"
      :path="path"
      :schedule="currentSchedule"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserConfigStore } from '~/stores/user-config'
import ScheduleShare from '~/components/schedule/ShareCard.vue'
import GoogleCalendarConnect from '~/components/google/calendar/Connect.vue'
import GoogleSignInDialog from '~/components/google/SignInDialog.vue'
import GoogleCalendarSyncDialog from '~/components/google/calendar/SyncDialog.vue'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { ViewMode } from '~/models/ViewMode'

defineProps<{
  currentSchedule: IScheduleGenerate
  mode: ViewMode
  path: string
}>()

const store = useUserConfigStore()
const { hourlyLoad } = storeToRefs(store)
const { isSignedIn, isPendingClient } = useGoogleOAuth2()

const academicPeriodOrganizationUnit = computed(
  () => hourlyLoad.value?.academicPeriodOrganizationUnit,
)
const startDate = computed(() => academicPeriodOrganizationUnit.value?.fromDate)
const endDate = computed(() => academicPeriodOrganizationUnit.value?.toDate)

const dialogShare = ref(false)
const dialogSignIn = ref(false)
const dialogSync = ref(false)

watch(isSignedIn, (value) => {
  if (value) {
    dialogSignIn.value = false
    dialogSync.value = true
  }
})

function handleGoogleAuthClick() {
  if (isSignedIn.value) {
    dialogSync.value = true
  } else {
    dialogSignIn.value = true
  }
}

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
