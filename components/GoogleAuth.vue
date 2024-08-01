<template>
  <div v-if="tokenClient">
    <GoogleSignIn v-if="!isSignedIn" @click="getToken()">
      Sincronizar con Google
    </GoogleSignIn>
    <v-btn
      v-else
      rounded
      class="ma-1"
      variant="outlined"
      density="compact"
      @click="dialogCalendarSync = true"
    >
      Agregar a mi Calendario
    </v-btn>
    <v-dialog v-model="dialogCalendarSync">
      <v-card :disabled="loading">
        <v-card-title>Google Calendar</v-card-title>
        <v-dialog v-model="dialog" max-width="320">
          <CreateGoogleCalendar
            :calendar="calendarItem"
            :loading="loading"
            @close="dialog = false"
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
                v-model="notifications[index].minutes"
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
        </v-card-text>
        <v-card-actions>
          <v-btn
            :loading="progress > 0"
            variant="text"
            type="buttom"
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
            color="success"
            :loading="signOutStatus === 'pending'"
            @click="handleSignOutClick()"
          >
            Cerrar Sesión
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { DateTime } from 'luxon'
import { v4 } from 'uuid'
import CreateGoogleCalendar from '~/components/CreateGoogleCalendar.vue'
import GoogleSignIn from '~/components/GoogleSignIn.vue'
import { EVENT_COLORS } from '~/constants/event'
import type { IEvent } from '~/interfaces/event'
import type { IGoogleCalendarItem } from '~/interfaces/google/calendar'
import type { VForm } from 'vuetify/components/VForm'
import { mdiBell, mdiDelete, mdiPlus } from '@mdi/js'

const props = defineProps<{
  startDate: string
  endDate?: string | null
  events: IEvent[]
}>()

const {
  tokenClient,
  getToken,
  isSignedIn,
  signOut,
  fetchCalendars,
  createCalendar,
  createEvent,
} = useGoogleOAuth2()
const { events } = toRefs(props)

const search = ref('')
const calendarItem = ref<Pick<IGoogleCalendarItem, 'summary'>>({ summary: '' })

const dialogCalendarSync = ref(false)
const dialog = ref(false)
const dateStart = ref(DateTime.fromISO(props.startDate).toFormat('yyyy-MM-dd'))
const dateEnd = ref(
  props.endDate ? DateTime.fromISO(props.endDate).toFormat('yyyy-MM-dd') : null,
)

const progress = ref(0)

class Notification {
  method: 'popup' | 'email'
  minutes: number
  constructor(minutes: number = 15, method: 'popup' | 'email' = 'popup') {
    this.method = method
    this.minutes = minutes
  }
}
const defaultNotification = ref(new Notification())
const notifications = ref([new Notification()])

const calendarList = ref<IGoogleCalendarItem[]>([])
const selected = ref<any>(null)
const loading = ref(false)

/**
 *  Sign out the user upon button click.
 */
const { execute: handleSignOutClick, status: signOutStatus } = useAsyncData(
  async () => {
    await signOut()
    dialogCalendarSync.value = false
  },
  {
    immediate: false,
  },
)

function deleteNotification(index: Notification) {
  notifications.value = notifications.value.filter(
    (notification) => notification !== index,
  )
}

function addNotification() {
  notifications.value.push(
    new Notification(
      defaultNotification.value.minutes,
      defaultNotification.value.method,
    ),
  )
  defaultNotification.value = new Notification()
}

function addCalendar(this: any) {
  dialog.value = true
  if (search.value) {
    calendarItem.value.summary = search.value
  }
}

async function handleSaveCalendar({
  summary,
}: Pick<IGoogleCalendarItem, 'summary'>) {
  try {
    const response = await createCalendar({ summary })
    await getCalendarList()
    return response
  } catch (e) {
    console.error('Execute error', e)
  } finally {
    dialog.value = false
  }
}

const form = ref<typeof VForm | null>(null)

const exportEventToGCalendar = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  progress.value = 0
  for (const event of events.value) {
    try {
      await eventRequest(event)
      progress.value++
    } catch (e) {
      console.error(e)
    }
  }
  progress.value = 0
}

async function eventRequest(event: IEvent): Promise<any> {
  if (!dateEnd.value) {
    throw new Error('No se ha seleccionado una fecha de fin')
  }
  const format =
    event.startTime.length > 5 ? 'yyyy-MM-dd hh:mm:ss' : 'yyyy-MM-dd hh:mm'
  let color = EVENT_COLORS.findIndex((color) => event.color === color)
  if (color === -1) {
    color = 10
  }
  const eventData = {
    iCalUID: 'Horext-' + v4(),
    summary: event.title,
    description: event.description,
    location: event?.location,
    start: {
      dateTime: DateTime.fromFormat(
        dateStart.value + ' ' + event.startTime,
        format,
      )
        .set({ weekday: event.day === 0 ? 7 : event.day })
        .toISO(),
      timeZone: 'America/Lima',
    },
    end: {
      dateTime: DateTime.fromFormat(
        dateStart.value + ' ' + event.endTime,
        format,
      )
        .set({ weekday: event.day === 0 ? 7 : event.day })
        .toISO(),
      timeZone: 'America/Lima',
    },
    recurrence: [
      'RRULE:FREQ=WEEKLY;UNTIL=' +
        new Date(dateEnd.value)
          .toISOString()
          .substring(0, 10)
          .split('-')
          .join('') +
        'T000000Z',
    ],
    colorId: color,
    source: {
      title: 'Horext',
      url: 'https://horext.octatec.io',
    },
    reminders: {
      useDefault: !1,
      overrides: [...notifications.value],
    },
  }
  return await createEvent(selected.value.id, eventData)
}

async function getCalendarList() {
  try {
    const response = await fetchCalendars()
    calendarList.value = response.items
  } catch (e) {
    console.error('Execute error', e)
  }
}

function onChangeSignInStatus(value: boolean) {
  console.log(value)
  if (value) {
    getCalendarList()
  }
}

watch(isSignedIn, onChangeSignInStatus)
</script>
