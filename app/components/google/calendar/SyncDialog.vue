<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <v-card
      :disabled="
        calendarListStatus === 'pending' ||
        exportEventToGCalendarStatus === 'pending'
      "
      :loading="
        calendarListStatus === 'pending' ||
        exportEventToGCalendarStatus === 'pending'
      "
    >
      <v-card-title class="d-flex align-center ga-2">
        <v-icon>{{ mdiCalendarSync }}</v-icon>
        Exportar a Google Calendar
      </v-card-title>
      <v-dialog v-model="dialogCreateCalendar" max-width="320">
        <CreateGoogleCalendar
          :calendar="calendarItem"
          :loading="loadingCreate"
          @close="dialogCreateCalendar = false"
          @update:calendar="handleSaveCalendar"
        />
      </v-dialog>
      <v-card-text>
        <v-form ref="form">
          <v-autocomplete
            v-model="selected"
            v-model:search-input="search"
            label="Selecciona tu calendario"
            :items="calendarList"
            return-object
            clearable
            :loading="calendarListStatus === 'pending'"
            :rules="[(r) => !!r || 'Requerido']"
            item-title="summary"
          >
            <template #prepend-item="">
              <v-list-item selectable color="primary" @click="addCalendar()">
                <v-list-item-title class="text text-primary">
                  Crear mi calendario...
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-autocomplete>
          <v-text-field
            v-model="dateStart"
            :rules="[(r) => !!r || 'Requerido']"
            type="date"
            label="Fecha de Inicio"
          />
          <v-text-field
            v-model="dateEnd"
            :rules="[(r) => !!r || 'Requerido']"
            type="date"
            label="Fecha de Fin"
          />
          <v-form>
            <span class="heading"> Notificaciones </span>
            <v-text-field
              v-for="(notification, index) in notifications"
              :id="'not-' + index"
              :key="index"
              v-model="notification.minutes"
              type="number"
              :rules="[(a) => a > 0 || 'No permitido']"
              variant="outlined"
              density="compact"
              :prepend-icon="mdiBell"
              :items="Array.from({ length: 60 }, (x, i) => i)"
              suffix="minutos"
            >
              <template #append>
                <v-icon
                  :key="index + 'del'"
                  color="error"
                  @click="deleteNotification(notification)"
                >
                  {{ mdiDelete }}
                </v-icon>
              </template>
            </v-text-field>
            <v-text-field
              key="selected"
              v-model="defaultNotification.minutes"
              :rules="[(a) => a > 0 || 'No permitido']"
              :prepend-icon="mdiBell"
              type="number"
              :items="Array.from({ length: 60 }, (x, i) => i)"
              suffix="minutos"
              variant="outlined"
              density="compact"
            >
              <template #append>
                <v-icon color="success" @click="addNotification()">
                  {{ mdiPlus }}
                </v-icon>
              </template>
            </v-text-field>
          </v-form>
        </v-form>
        <!-- Success state -->
        <v-alert
          v-if="exportEventToGCalendarStatus === 'success'"
          type="success"
          density="comfortable"
          class="mb-2"
        >
          <strong>{{ events.length }} eventos exportados correctamente</strong>
          al calendario <em>{{ selected?.summary }}</em>.
          <br />
          <a :href="`https://calendar.google.com`" target="_blank" class="text-white">Abrir Google Calendar →</a>
        </v-alert>

        <v-alert
          v-if="calendarListStatus === 'error'"
          type="error"
          density="comfortable"
          dismissible
        >
          Error al obtener los calendarios. Tu sesión de Google Calendar puede haber expirado.
          <v-btn size="small" variant="text" color="white" class="mt-1" @click="handleReAuth">Volver a autorizar</v-btn>
        </v-alert>
        <v-alert
          v-if="exportEventToGCalendarStatus === 'error'"
          type="error"
          density="comfortable"
          dismissible
        >
          <div>Error al exportar los eventos.</div>
          <div class="text-caption">{{ exportEventToGCalendarError?.data?.error?.message }}</div>
          <v-btn size="small" variant="text" color="white" class="mt-1" @click="handleReAuth">Volver a autorizar</v-btn>
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :loading="progress > 0"
          variant="text"
          type="button"
          @click="exportEventToGCalendar"
        >
          Exportar
          <template #loader>
            <v-progress-linear
              color="secondary"
              striped
              :model-value="(progress / events.length) * 100"
              :height="30"
            >
              <template #default="{ value }">
                <strong class="text-white">{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </template>
        </v-btn>
        <v-spacer />
        <v-btn
          variant="text"
          color="error"
          :loading="signOutStatus === 'pending'"
          @click="handleSignOut"
        >
          Revocar acceso a Calendar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { DateTime } from 'luxon'
import CreateGoogleCalendar from '~/components/google/calendar/CreateDialog.vue'
import type { IEvent } from '~/interfaces/event'
import type { IGoogleCalendarItem } from '~/interfaces/google/calendar'
import type { VForm } from 'vuetify/components/VForm'
import { mdiBell, mdiDelete, mdiPlus, mdiCalendarSync } from '@mdi/js'
import { CalendarEvent, EventNotification } from '~/models/google'

const props = defineProps<{
  modelValue: boolean
  startDate?: string
  endDate?: string | null
  events: IEvent[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { events } = toRefs(props)

const { signOut, fetchCalendars, createCalendar, createEvent, getToken } =
  useGoogleOAuth2()

// Fetch calendar list when dialog opens
watch(
  () => props.modelValue,
  (open) => {
    if (open) getCalendarList()
  },
)

const search = ref('')
const calendarItem = ref<Pick<IGoogleCalendarItem, 'summary'>>({ summary: '' })
const dialogCreateCalendar = ref(false)
const selected = ref<IGoogleCalendarItem | null>(null)

const dateStart = ref(
  props.startDate
    ? DateTime.fromISO(props.startDate).toFormat('yyyy-MM-dd')
    : null,
)
const dateEnd = ref(
  props.endDate ? DateTime.fromISO(props.endDate).toFormat('yyyy-MM-dd') : null,
)

const progress = ref(0)
const defaultNotification = ref(new EventNotification())
const notifications = ref([new EventNotification()])

function deleteNotification(notification: EventNotification) {
  notifications.value = notifications.value.filter((n) => n !== notification)
}

function addNotification() {
  notifications.value.push(
    new EventNotification(
      defaultNotification.value.minutes,
      defaultNotification.value.method,
    ),
  )
  defaultNotification.value = new EventNotification()
}

function addCalendar() {
  dialogCreateCalendar.value = true
  if (search.value) {
    calendarItem.value.summary = search.value
  }
}

const loadingCreate = ref(false)
async function handleSaveCalendar({
  summary,
}: Pick<IGoogleCalendarItem, 'summary'>) {
  try {
    loadingCreate.value = true
    await createCalendar({ summary })
    await getCalendarList()
  } catch (e) {
    console.error('Execute error', e)
  } finally {
    dialogCreateCalendar.value = false
    loadingCreate.value = false
  }
}

const form = ref<typeof VForm | null>(null)

const {
  execute: exportEventToGCalendar,
  status: exportEventToGCalendarStatus,
  error: exportEventToGCalendarError,
} = useAsyncData<
  undefined,
  { error?: { message?: string } }
>(
  'google-calendar-sync-export',
  async () => {
    if (!form.value) return
    const { valid } = await form.value.validate()
    if (!valid) return
    progress.value = 0
    for (const event of events.value) {
      await eventRequest(event)
      progress.value++
    }
    progress.value = 0
  },
  { immediate: false, server: false },
)

async function eventRequest(event: IEvent): Promise<CalendarEvent> {
  if (!dateStart.value)
    throw new Error('No se ha seleccionado una fecha de inicio')
  if (!dateEnd.value) throw new Error('No se ha seleccionado una fecha de fin')
  if (!selected.value) throw new Error('No se ha seleccionado un calendario')
  return await createEvent(
    selected.value.id!,
    new CalendarEvent(event, notifications.value, dateStart.value, dateEnd.value),
  )
}

const {
  execute: getCalendarList,
  data: calendarList,
  status: calendarListStatus,
} = useAsyncData(
  'google-calendar-sync-list',
  async () => {
    const response = await fetchCalendars()
    return response.items
  },
  { immediate: false, server: false, default: () => [] },
)

const { execute: handleSignOut, status: signOutStatus } = useAsyncData(
  'google-calendar-sync-sign-out',
  async () => {
    await signOut()
    emit('update:modelValue', false)
    return true
  },
  { immediate: false, server: false },
)

function handleReAuth() {
  emit('update:modelValue', false)
  getToken()
}
</script>
