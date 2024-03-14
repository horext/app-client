<template>
  <div>
    <GoogleSignIn v-if="!isSignedIn" @click="getToken()">
      Sincronizar con Google
    </GoogleSignIn>
    <v-btn
      v-else
      rounded
      class="ma-1"
      variant="outlined"
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
            @update:calendar="createCalendar"
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
                :model-value="notification.minutes"
                prepend-icon="mdi-bell"
                :items="Array.from({ length: 60 }, (x, i) => i)"
                suffix="minutos"
              >
                <template #append-outer>
                  <v-icon
                    :key="index + 'del'"
                    color="error"
                    @click="deleteNotification(notification)"
                  >
                    mdi-delete
                  </v-icon>
                </template>
              </v-text-field>
              <v-text-field
                key="selected"
                v-model="defaultNotification.minutes"
                :rules="[(a) => a > 0 || 'No permitido']"
                :model-value="defaultNotification.minutes"
                prepend-icon="mdi-bell"
                type="number"
                :items="Array.from({ length: 60 }, (x, i) => i)"
                suffix="minutos"
                variant="outlined"
                density="compact"
              >
                <template #append-outer>
                  <v-icon color="success" @click="addNotification()">
                    mdi-plus
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
          <v-btn variant="text" color="success" @click="handleSignOutClick()">
            Cerrar Sesión
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, type PropType, toRefs, watch } from 'vue'
import { DateTime } from 'luxon'
import { v4 } from 'uuid'
import CreateGoogleCalendar from '~/components/CreateGoogleCalendar.vue'
import GoogleSignIn from '~/components/GoogleSignIn.vue'
import { EVENT_COLORS } from '~/constants/event'
import type { IEvent } from '~/interfaces/event'
import type {
  IGoogleCalendarListPayload,
  IGoogleCalendarItem,
} from '~/interfaces/google/calendar'
import type { VForm } from 'vuetify/components/VForm'

export default defineComponent({
  name: 'GoogleAuth',
  components: { CreateGoogleCalendar, GoogleSignIn },

  props: {
    events: {
      type: Array as PropType<IEvent[]>,
      default: () => [],
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { events } = toRefs(props)
    const { googleApis, accessToken, getToken, isSignedIn, signOut } =
      useGoogleOAuth2()

    const search = ref('')
    const calendarItem = ref({ summary: '' })
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ]

    const dialogCalendarSync = ref(false)
    const dialog = ref(false)
    const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']
    const dateStart = ref(
      DateTime.fromISO(props.startDate).toFormat('yyyy-MM-dd'),
    )
    const dateEnd = ref(DateTime.fromISO(props.endDate).toFormat('yyyy-MM-dd'))

    const progress = ref(0)
    const day = [
      '2021-04-11 ',
      '2021-04-05 ',
      '2021-04-06 ',
      '2021-04-07 ',
      '2021-04-08 ',
      '2021-04-09 ',
      '2021-04-10 ',
    ]

    const notifications = ref([
      {
        method: 'popup',
        minutes: 15,
      },
    ])

    let defaultNotification = {
      method: 'popup',
      minutes: 15,
    }

    const calendarList = ref<IGoogleCalendarItem[]>([])
    const summary = ref('')
    const selected = ref<any>(null)
    const loading = ref(false)
    const selectedError = ref(false)

    /**
     *  Sign out the user upon button click.
     */
    const handleSignOutClick = () => {
      signOut()
    }

    function deleteNotification(index: { method: string; minutes: number }) {
      console.log(index)
      notifications.value = notifications.value.filter(
        (notification: { method: string; minutes: number }) =>
          notification !== index,
      )
      defaultNotification = {
        method: 'popup',
        minutes: 15,
      }
    }

    function addNotification(this: any) {
      const notification: any = {}
      Object.assign(notification, defaultNotification)
      notifications.value.push(notification)
    }

    function addCalendar(this: any) {
      dialog.value = true
      if (search.value) {
        calendarItem.value.summary = search.value
      }
    }

    async function createCalendar(this: any, { summary }: any) {
      try {
        const response = await window.gapi.client.calendar.calendars.insert({
          resource: {
            summary,
            etag: 'Created by Octatec',
          },
        })
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response)
        await getCalendarList()
        return response.result
      } catch (e) {
        console.error('Execute error', e)
      } finally {
        this.dialog = false
      }
    }

    const form = ref<typeof VForm | null>(null)

    const exportEventToGCalendar = async () => {
      console.log('Exporting to Google Calendar', form.value)
      const { valid } = await form.value?.validate()
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
            .set({ weekday: event.day })
            .toISO(),
          timeZone: 'America/Lima',
        },
        end: {
          dateTime: DateTime.fromFormat(
            dateStart.value + ' ' + event.endTime,
            format,
          )
            .set({ weekday: event.day })
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
      // create the request
      const request = await googleApis(
        'calendar/v3/calendars/' + selected.value.id + '/events',
        {
          method: 'POST',
          body: eventData,
        },
      )
      return request
    }

    async function getCalendarList() {
      try {
        const response = await googleApis<IGoogleCalendarListPayload>(
          'calendar/v3/users/me/calendarList',
        )
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

    return {
      exportEventToGCalendar,
      addCalendar,
      addNotification,
      deleteNotification,
      monthNames,
      notifications,
      summary,
      dateStart,
      dateEnd,
      createCalendar,
      handleSignOutClick,
      selectedError,
      dialogCalendarSync,
      dayNames,
      day,
      progress,
      defaultNotification,
      dialog,
      loading,
      selected,
      calendarList,
      search,
      calendarItem,
      getToken,
      accessToken,
      form,
      isSignedIn,
    }
  },
})
</script>
