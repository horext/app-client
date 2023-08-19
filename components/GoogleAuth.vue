<template>
  <div v-if="isGoogleApiLoaded">
    <GoogleSignIn v-if="!signInStatus" @click="handleAuthClick()">
      Sincronizar con Google
    </GoogleSignIn>
    <v-btn
      v-else
      rounded
      class="ma-1"
      shaped
      @click="dialogCalendarSync = true"
    >
      Agregar a mi Calendario
    </v-btn>
    <v-dialog v-if="signInStatus" v-model="dialogCalendarSync">
      <v-card>
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
            <template v-if="signInStatus">
              <v-autocomplete
                v-model="selected"
                label="Selecciona tu calendario"
                :items="calendarList"
                return-object
                clearable
                :rules="[(r) => !!r || 'Requerido']"
                :search-input.sync="search"
                item-text="summary"
              >
                <template #prepend-item="">
                  <v-list-item
                    selectable
                    color="primary"
                    @click="addCalendar()"
                  >
                    <v-list-item-content class="text--primary">
                      <v-list-item-title class="text primary--text">
                        Crear mi calendario...
                      </v-list-item-title>
                    </v-list-item-content>
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
                  outlined
                  dense
                  :value="notification.minutes"
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
                  :value="defaultNotification.minutes"
                  prepend-icon="mdi-bell"
                  type="number"
                  :items="Array.from({ length: 60 }, (x, i) => i)"
                  suffix="minutos"
                  outlined
                  dense
                >
                  <template #append-outer>
                    <v-icon color="success" @click="addNotification()">
                      mdi-plus
                    </v-icon>
                  </template>
                </v-text-field>
              </v-form>
            </template>
          </v-form>
        </v-card-text>
        <v-card-actions v-if="signInStatus">
          <v-btn :loading="progress > 0" text @click="exportEventToGCalendar">
            Exportar
            <template #loader>
              <v-progress-linear
                color="secondary"
                striped
                :value="(progress / events.length) * 100"
                :height="30"
              >
                <template #default="{ value }">
                  <strong class="white--text">{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </template>
          </v-btn>
          <v-spacer />
          <v-btn text color="success" @click="handleSignOutClick()">
            Cerrar Sesión
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { DateTime } from 'luxon'
import { defineComponent, PropType, toRefs, watch } from 'vue'
import { useContext } from '@nuxtjs/composition-api'
import { v4 } from 'uuid'
import { colors } from '~/utils/core'
import CreateGoogleCalendar from '~/components/CreateGoogleCalendar.vue'
import GoogleSignIn from '~/components/GoogleSignIn.vue'
import Event from '~/model/Event'
import { VForm } from '~/types'

export default defineComponent({
  name: 'GoogleAuth',
  components: { CreateGoogleCalendar, GoogleSignIn },

  props: {
    events: {
      type: Array as PropType<Event[]>,
      default: () => []
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    }
  },

  setup (props) {
    const { events } = toRefs(props)

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
      'Diciembre'
    ]

    const dialogCalendarSync = ref(false)
    const signInStatus = ref(false)
    const isGoogleApiLoaded = ref(false)
    const dialog = ref(false)
    const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']
    const dateStart = computed(() => DateTime.fromISO(props.startDate).toFormat('yyyy-MM-dd'))
    const dateEnd = computed(() => DateTime.fromISO(props.endDate).toFormat('yyyy-MM-dd'))

    const progress = ref(0)
    const day = [
      '2021-04-11 ',
      '2021-04-05 ',
      '2021-04-06 ',
      '2021-04-07 ',
      '2021-04-08 ',
      '2021-04-09 ',
      '2021-04-10 '
    ]

    const notifications = ref([
      {
        method: 'popup',
        minutes: 15
      }
    ])

    let defaultNotification = {
      method: 'popup',
      minutes: 15
    }

    const calendarList = ref([])
    const summary = ref('')
    const selected = ref<any>(null)
    const loading = ref(false)
    const selectedError = ref(false)

    const handleClientLoad = () => {
      window.gapi.load('client:auth2', initClient)
    }

    const config = useContext().$config
    const initClient = async () => {
      try {
        loading.value = true
        await window.gapi.client.init({
          apiKey: config.googleApi.apiKey,
          clientId: config.googleApi.clientId,
          discoveryDocs: config.googleApi.discoveryDocs,
          scope: config.googleApi.scopes
        })
        // Listen for sign-in state changes.
        window.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(updateSigninStatus)
        // Handle the initial sign-in state.
        signInStatus.value = window.gapi.auth2
          .getAuthInstance()
          .isSignedIn.get()
        loading.value = false
      } catch (e) {
        loading.value = false
        console.log(JSON.stringify(e, null, 2))
      }
      console.log(signInStatus.value)
    }

    const updateSigninStatus = (isSignedIn: any) => {
      signInStatus.value = isSignedIn
    }

    const handleAuthClick = () => {
      window.gapi.auth2.getAuthInstance().signIn()
    }

    /**
     *  Sign out the user upon button click.
     */
    const handleSignOutClick = () => {
      window.gapi.auth2.getAuthInstance().signOut()
    }

    function deleteNotification (
      index: { method: string; minutes: number }
    ) {
      console.log(index)
      notifications.value = notifications.value.filter(
        (notification: { method: string; minutes: number }) =>
          notification !== index
      )
      defaultNotification = {
        method: 'popup',
        minutes: 15
      }
    }

    function addNotification (this: any) {
      const notification: any = {}
      Object.assign(notification, defaultNotification)
      notifications.value.push(notification)
    }

    function addCalendar (this: any) {
      dialog.value = true
      if (search.value) {
        calendarItem.value.summary = search.value
      }
    }

    async function createCalendar (this: any, { summary }: any) {
      try {
        const response = await window.gapi.client.calendar.calendars.insert({
          resource: {
            summary,
            etag: 'Created by Octatec'
          }
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

    const form = ref<VForm>()

    const exportEventToGCalendar = async () => {
      if (!form.value?.validate()) {
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

    function eventRequest (event: Event): Promise<any> {
      return new Promise((resolve, reject) => {
        const format =
          event.startTime.length > 5
            ? 'yyyy-MM-dd hh:mm:ss'
            : 'yyyy-MM-dd hh:mm'
        let color = colors.findIndex(color => event.color === color)
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
              format
            )
              .set({ weekday: event.day })
              .toISO(),
            timeZone: 'America/Lima'
          },
          end: {
            dateTime: DateTime.fromFormat(
              dateStart.value + ' ' + event.endTime,
              format
            )
              .set({ weekday: event.day })
              .toISO(),
            timeZone: 'America/Lima'
          },
          recurrence: [
            'RRULE:FREQ=WEEKLY;UNTIL=' +
              new Date(dateEnd.value)
                .toISOString()
                .substring(0, 10)
                .split('-')
                .join('') +
              'T000000Z'
          ],
          colorId: color,
          source: {
            title: 'Horext',
            url: 'https://horext.octatec.io'
          },
          reminders: {
            useDefault: !1,
            overrides: [...notifications.value]
          }
        }
        // create the request
        const request = window.gapi.client.calendar.events.import({
          calendarId: selected.value?.id,
          resource: eventData
        })
        // execute the request and do something with response
        request.execute(function (resp: { status: any }) {
          const status = resp.status
          status === 'confirmed' ? resolve(status) : reject(status)
          // After the request is executed, you will invoke the resolve function with the result as a parameter.
        })
      })
    }

    async function getCalendarList () {
      try {
        const response = await window.gapi.client.calendar.calendarList.list(
          {}
        )
        calendarList.value = response.result.items
      } catch (e) {
        console.error('Execute error', e)
      }
    }

    function onChangeSignInStatus (value: boolean) {
      console.log(value)
      if (value) {
        getCalendarList()
      }
    }

    watch(signInStatus, onChangeSignInStatus)

    return {
      isGoogleApiLoaded,
      handleClientLoad,
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
      handleAuthClick,
      handleSignOutClick,
      selectedError,
      dialogCalendarSync,
      dayNames,
      day,
      signInStatus
    }
  },
  head () {
    return {
      script: [
        {
          src: 'https://apis.google.com/js/api.js',
          crossorigin: true,
          // Changed after script load
          callback: () => {
            this.isGoogleApiLoaded = true
            this.handleClientLoad()
          },
          json: {}
        }

      ]
    }
  }
})
</script>
