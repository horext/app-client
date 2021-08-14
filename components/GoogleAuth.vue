<template>
  <div v-if="isGoogleApiLoaded">
    <GoogleSignIn v-if="!signinStatus" @click="handleAuthClick()">
      Sincronizar con Google
    </GoogleSignIn>
    <v-btn
      v-else
      rounded
      class="ma-1"
      shaped
      @click="dialogCalendarSync=true"
    >
      Agregar a mi Calendario
    </v-btn>
    <v-dialog v-if="signinStatus" v-model="dialogCalendarSync">
      <v-card>
        <v-card-title>Google Calendar</v-card-title>
        <v-dialog
          v-model="dialog"
          max-width="290"
        >
          <CreateGoogleCalendar
            :dialog.sync="dialog"
            :item.sync="calendarItem"
          />
        </v-dialog>
        <v-card-text>
          <template v-if="signinStatus">
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
                <template #append-outer>
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
                <template #append-outer>
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
            <template #loader>
              <v-progress-linear color="secondary" striped :value="progress/events.length*100" :height="30">
                <template #default="{ value }">
                  <strong class="white--text">{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </template>
          </v-btn>
          <v-btn text color="success" @click="handleSignOutClick()">
            Cerrar Sesión
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { colors } from '~/utils/core'
import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from '~/utils/gCalendar'
import CreateGoogleCalendar from '~/components/CreateGoogleCalendar.vue'
import GoogleSignIn from '~/components/GoogleSignIn.vue'

@Component({
  name: 'GoogleAuth',
  components: { CreateGoogleCalendar, GoogleSignIn }
})

export default class GoogleAuth extends Vue {
  @Prop({
    default: () => ([]),
    type: Array
  })
    events!: Array<any>

  API_KEY = API_KEY
  CLIENT_ID = CLIENT_ID
  DISCOVERY_DOCS = DISCOVERY_DOCS
  SCOPES = SCOPES

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
          }
        }

      ]
    }
  }

  search = ''
  calendarItem= { name: '' }
  monthNames= ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
    'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  dialogCalendarSync= false
  signinStatus= false
  isGoogleApiLoaded= false
  dialog= false
  dayNames= [
    'Do',
    'Lu', 'Ma', 'Mi', 'Ju',
    'Vi', 'Sa']

  dateStart = new Date()
  dateEnd = '2021-07-18'
  fechaInicio = '2020-11-04'
  fechaFin = '2021-02-20'
  progress = 0
  day= [
    '2021-04-11 ',
    '2021-04-05 ',
    '2021-04-06 ',
    '2021-04-07 ',
    '2021-04-08 ',
    '2021-04-09 ',
    '2021-04-10 '
  ]

  notifications= [
    {
      method: 'popup',
      minutes: 15
    }
  ]

  defaultNotification= {
    method: 'popup',
    minutes: 15
  }

  calendarList= []
  summary= ''
  selected= {
    id: undefined
  }

  loading= false
  selectedError= false

  handleClientLoad () {
    window.gapi.load('client:auth2', this.initClient)
  }

  async initClient () {
    try {
      this.loading = true
      await window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      })
      // Listen for sign-in state changes.
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus)
      // Handle the initial sign-in state.
      this.signinStatus = window.gapi.auth2.getAuthInstance().isSignedIn.get()
      this.loading = false
    } catch (e) {
      this.loading = false
      console.log(JSON.stringify(e, null, 2))
    }
    console.log(this.signinStatus)
  }

  updateSigninStatus (isSignedIn: boolean) {
    this.signinStatus = isSignedIn
  }

  handleAuthClick () {
    window.gapi.auth2.getAuthInstance().signIn()
  }

  /**
   *  Sign out the user upon button click.
   */
  handleSignOutClick () {
    window.gapi.auth2.getAuthInstance().signOut()
  }

  deleteNotification (index: { method: string; minutes: number }) {
    console.log(index)
    this.notifications = this.notifications.filter(notification => notification !== index)
    this.defaultNotification = {
      method: 'popup',
      minutes: 15
    }
  }

  addNotification () {
    const notification: any = {}
    Object.assign(notification, this.defaultNotification)
    this.notifications.push(notification)
  }

  addCalendar () {
    this.dialog = true
    this.calendarItem.name = this.search
  }

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
  }

  eventRequest (event: any, index: number): Promise<any> {
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
  }

  getCalendarList () {
    return window.gapi.client.calendar.calendarList.list({})
      .then((response: { result: { items: never[] } }) => {
        // Handle the results here (response.result has the parsed body).
        this.calendarList = response.result.items
      }, (err: any) => {
        console.error('Execute error', err)
      })
  }

  @Watch('signInStatus')
  onChangeSignInStatus (value: boolean) {
    if (value) {
      this.getCalendarList()
    }
  }
}
</script>
