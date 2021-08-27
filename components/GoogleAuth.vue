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
      @click="dialogCalendarSync=true"
    >
      Agregar a mi Calendario
    </v-btn>
    <v-dialog v-if="signInStatus" v-model="dialogCalendarSync">
      <v-card>
        <v-card-title>Google Calendar</v-card-title>
        <v-dialog
          v-model="dialog"
          max-width="320"
        >
          <CreateGoogleCalendar
            :calendar="calendarItem"
            :loading="loading"
            @close="dialog=false"
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
                :rules="[(r)=>(!!r||'Requerido')]"
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
              <v-text-field v-model="dateStart" :rules="[(r)=>!!r||'Requerido']" type="date" label="Fecha de Inicio" />
              <v-text-field v-model="dateEnd" :rules="[(r)=>!!r||'Requerido']" type="date" label="Fecha de Fin" />
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
          </v-form>
        </v-card-text>
        <v-card-actions v-if="signInStatus">
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

import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { v4 } from 'uuid'
import { DateTime } from 'luxon'
import { colors, weekdayToDatetime } from '~/utils/core'
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

  @Prop({
    type: String
  })
    startDate!: string

  @Prop({
    type: String
  })
    endDate!: string

  @Watch('startDate', { immediate: true })
  onChangeStartDate (startDate) {
    if (startDate) { this.dateStart = DateTime.fromISO(startDate).toFormat('yyyy-MM-dd') }
  }

  @Watch('endDate', { immediate: true })
  onChangeEndDate (endDate) {
    if (endDate) { this.dateEnd = DateTime.fromISO(endDate).toFormat('yyyy-MM-dd') }
  }

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
  calendarItem= { summary: '' }
  monthNames= ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
    'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  dialogCalendarSync= false
  signInStatus= false
  isGoogleApiLoaded= false
  dialog= false
  dayNames= [
    'Do',
    'Lu', 'Ma', 'Mi', 'Ju',
    'Vi', 'Sa']

  dateStart = DateTime.local().toFormat('yyyy-MM-dd')
  dateEnd = DateTime.local().plus({ months: 4 }).toFormat('yyyy-MM-dd')

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
  selected:any = null

  loading= false
  selectedError= false

  handleClientLoad () {
    window.gapi.load('client:auth2', this.initClient)
  }

  async initClient () {
    try {
      this.loading = true
      await window.gapi.client.init({
        apiKey: this.$config.googleApi.apiKey,
        clientId: this.$config.googleApi.clientId,
        discoveryDocs: this.$config.googleApi.discoveryDocs,
        scope: this.$config.googleApi.scopes
      })
      // Listen for sign-in state changes.
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus)
      // Handle the initial sign-in state.
      this.signInStatus = window.gapi.auth2.getAuthInstance().isSignedIn.get()
      this.loading = false
    } catch (e) {
      this.loading = false
      console.log(JSON.stringify(e, null, 2))
    }
    console.log(this.signInStatus)
  }

  updateSigninStatus (isSignedIn: boolean) {
    this.signInStatus = isSignedIn
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
    if (this.search) { this.calendarItem.summary = this.search }
  }

  async createCalendar ({ summary }: any) {
    try {
      const response = await window.gapi.client.calendar.calendars.insert({
        resource: {
          summary,
          etag: 'Created by Octatec'
        }
      })
      // Handle the results here (response.result has the parsed body).
      console.log('Response', response)
      await this.getCalendarList()
      return response.result
    } catch (e) {
      console.error('Execute error', e)
    } finally {
      this.dialog = false
    }
  }

  async exportEventToGCalendar () {
    if (!this.$refs.form.validate()) {
      return
    }

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

  eventRequest (event: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const format = event.startTime.length > 5 ? 'yyyy-MM-dd hh:mm:ss' : 'yyyy-MM-dd hh:mm'
      let color = colors.findIndex(color => (event.color === color))
      if(color === -1){
        color = 10
      }
      const eventData = {
        iCalUID: 'Horext-' + v4(),
        summary: event.title,
        description: event.description,
        location: event.classroom,
        start: {
          dateTime: DateTime.fromFormat(this.dateStart + ' ' + event.startTime, format).set({ weekday: event.day }).toISO(),
          timeZone: 'America/Lima'
        },
        end: {
          dateTime: DateTime.fromFormat(this.dateStart + ' ' + event.endTime, format).set({ weekday: event.day }).toISO(),
          timeZone: 'America/Lima'
        },
        recurrence: ['RRULE:FREQ=WEEKLY;UNTIL=' + new Date(this.dateEnd).toISOString().substring(0, 10).split('-').join('') + 'T000000Z'],
        colorId:  color,
        source: {
          title: 'Horext',
          url: 'https://horext.octatec.io'
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

  async getCalendarList () {
    try {
      const response: { result: { items: never[] } } = await window.gapi.client.calendar.calendarList.list({})
      this.calendarList = response.result.items
    } catch (e) {
      console.error('Execute error', e)
    }
  }

  @Watch('signInStatus')
  onChangeSignInStatus (value: boolean) {
    console.log(value)
    if (value) {
      this.getCalendarList()
    }
  }
}
</script>
