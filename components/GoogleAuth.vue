<template>
  <v-card>
    <v-overlay v-model="loading" absolute>
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <CreateGoogleCalendar
        :dialog.sync="dialog"
        :item.sync="calendarItem"
      />
    </v-dialog>
    <v-card-title>Google Calendar</v-card-title>
    <v-card-text>
      <v-btn v-if="!signinStatus" :key="'signinButton'" color="success" @click="handleAuthClick()">
        Iniciar Sesión en Google
      </v-btn>
      <template v-else>
        <v-autocomplete
          v-model="selected"
          label="Selecciona tu calendario"
          :items="calendarList"
          return-object
          :search-input.sync="search"
          item-text="summary"
        >
          <template #prepend-item="">
            <v-list-item selectable color="primary" @click="addCalendar()">
              <v-list-item-content class=" text--primary">
                <v-list-item-title class=" text primary--text">
                  Crear mi calendario...
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-text-field v-model="dateEnd" type="date" label="Fecha de Finalizacion" />
        <v-form>
          <span class="heading">
            Notificaciones
          </span>
          <v-text-field
            v-for="(notification,index) in notifications"
            :id="'not-'+index"
            :key="index"
            v-model="notifications[index].minutes"
            type="number"
            :rules="[ (a)=>(a>0||'No permitido') ]"
            outlined
            dense
            :value="notification.minutes"
            prepend-icon="mdi-bell"
            :items="Array.from({length: 60}, (x,i) => i)"
            suffix="minutos"
          >
            <template v-slot:append-outer>
              <v-icon :key="index+'del'" color="error" @click="deleteNotification(notification)">
                mdi-delete
              </v-icon>
            </template>
          </v-text-field>
          <v-text-field
            key="selected"
            v-model="defaultNotification.minutes"
            :rules="[ (a)=>(a>0||'No permitido') ]"
            :value="defaultNotification.minutes"
            prepend-icon="mdi-bell"
            type="number"
            :items="Array.from({length: 60}, (x,i) => i)"
            suffix="minutos"
            outlined
            dense
          >
            <template v-slot:append-outer>
              <v-icon color="success" @click="addNotification()">
                mdi-plus
              </v-icon>
            </template>
          </v-text-field>
        </v-form>
      </template>
    </v-card-text>
    <v-card-actions v-if="signinStatus">
      <v-btn :loading="progress>0" text @click="exportEventToGCalendar">
        Exportar
        <template v-slot:loader>
          <v-progress-linear color="secondary" striped :value="progress/events.length*100" :height="30">
            <template v-slot="{ value }">
              <strong class="white--text">{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>
        </template>
      </v-btn>
      <v-btn text color="success" @click="handleSignoutClick()">
        Cerrar Sesión
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">

import { Vue } from 'nuxt-property-decorator'
import { colors } from '~/utils/core'
import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from '~/utils/gCalendar'
import CreateGoogleCalendar from '~/components/CreateGoogleCalendar.vue'

export default Vue.extend({
  name: 'GoogleAuth',
  components: { CreateGoogleCalendar },
  props: {
    events: {
      default: () => ([]),
      type: Array
    }
  },
  data: () => ({
    search: '',
    calendarItem: { name: '' },
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
      'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    signinStatus: false,
    dialog: false,
    dayNames: [
      'Do',
      'Lu', 'Ma', 'Mi', 'Ju',
      'Vi', 'Sa'],
    dateStart: new Date(),
    dateEnd: '2021-07-18',
    fechaInicio: '2020-11-04',
    fechaFin: '2021-02-20',
    progress: 0,
    day: [
      '2021-04-11 ',
      '2021-04-05 ',
      '2021-04-06 ',
      '2021-04-07 ',
      '2021-04-08 ',
      '2021-04-09 ',
      '2021-04-10 '
    ],
    notifications: [
      {
        method: 'popup',
        minutes: 15
      }
    ],
    defaultNotification: {
      method: 'popup',
      minutes: 15
    },
    calendarList: [],
    summary: '',
    selected: {
      id: undefined
    },
    loading: false,
    selectedError: false
  }
  ),
  watch: {
    signinStatus (value) {
      if (value) {
        this.getCalendarList()
      }
    }
  },
  created () {
    this.handleClientLoad()
  },
  methods: {
    handleClientLoad () {
      window.gapi.load('client:auth2', this.initClient)
    },
    initClient () {
      const vm = this
      this.loading = true
      window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      })
        .then(() => {
          // Listen for sign-in state changes.
          window.gapi.auth2.getAuthInstance().isSignedIn.listen(vm.updateSigninStatus)
          // Handle the initial sign-in state.
          vm.signinStatus = (window.gapi.auth2.getAuthInstance().isSignedIn.get())
          vm.loading = false
        }, (error: any) => {
          vm.loading = false
          console.log(JSON.stringify(error, null, 2))
        })
      console.log(this.signinStatus)
    },
    updateSigninStatus (isSignedIn: boolean) {
      this.signinStatus = isSignedIn
    },
    handleAuthClick () {
      window.gapi.auth2.getAuthInstance().signIn()
    },
    /**
     *  Sign out the user upon button click.
     */
    handleSignoutClick () {
      window.gapi.auth2.getAuthInstance().signOut()
    },
    async onSubmit () {
      if (this.selected) {
        await this.exportEventToGCalendar()
      } else {
        this.selectedError = true
      }
    },
    deleteNotification (index: { method: string; minutes: number }) {
      console.log(index)
      this.notifications = this.notifications.filter(notification => notification !== index)
      this.defaultNotification = {
        method: 'popup',
        minutes: 15
      }
    },
    addNotification () {
      const notification: any = {}
      Object.assign(notification, this.defaultNotification)
      this.notifications.push(notification)
    },
    addCalendar () {
      this.dialog = true
      this.calendarItem.name = this.search
    },
    async exportEventToGCalendar () {
      this.progress = 0
      for (let i = 0; i < this.events.length; i++) {
        const item: any = this.events[i]
        try {
          await this.eventRequest(item, i)
          this.progress++
        } catch (e) {
          console.log(e)
        }
      }
      this.progress = 0
    },
    // eslint-disable-next-line require-await
    async eventRequest (event: any, index: number) {
      return new Promise((resolve, reject) => {
        const eventData = {
          iCalUID: 'Horext-' + (index + 20),
          summary: event.name,
          description: event.code + '\n' + event.type + '\n' + event.teacher.lastName + ' ,' + event.teacher.firstName,
          location: event.classroom,
          start: {
            dateTime: new Date(this.day[event.day] + event.startTime).toISOString(),
            timeZone: 'America/Lima'
          },
          end: {
            dateTime: new Date(this.day[event.day] + event.endTime).toISOString(),
            timeZone: 'America/Lima'
          },
          recurrence: ['RRULE:FREQ=WEEKLY;UNTIL=' + new Date(this.dateEnd).toISOString().substring(0, 10).split('-').join('') + 'T000000Z'],
          colorId: colors.findIndex(color => (event.color === color)),
          source: {
            title: 'Horext',
            url: 'https://horext.web.app/'
          },
          reminders: {
            useDefault: !1,
            overrides: [...this.notifications]
          }
        }
        // create the request
        const request = window.gapi.client.calendar.events.import({
          calendarId: this.selected.id,
          resource: eventData
        })
        // execute the request and do something with response
        request.execute(function (resp: { status: any }) {
          const status = resp.status
          status === 'confirmed' ? resolve(status) : reject(status)
          // After the request is executed, you will invoke the resolve function with the result as a parameter.
        })
      })
    },
    async createEvent (event: any, index: any) {
      await this.eventRequest(event, index)
    },
    getCalendarList () {
      const vm = this
      return window.gapi.client.calendar.calendarList.list({})
        .then(function (response: { result: { items: never[] } }) {
          // Handle the results here (response.result has the parsed body).
          vm.calendarList = response.result.items
        },
        function (err: any) {
          console.error('Execute error', err)
        })
    }
  }

})
</script>
