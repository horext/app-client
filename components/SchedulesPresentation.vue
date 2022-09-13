<template>
  <v-card>
    <v-toolbar flat dark :color="color">
      <slot name="top-items-right" />
      <v-spacer />
      <v-radio-group
        v-model="mode"
        hide-details
        dense
        :column="false"
        hide-spin-buttons
      >
        <template #label>
          <div>Modo:</div>
        </template>
        <v-row no-gutters>
          <v-col cols="12">
            <v-radio :value="MODES.CALENDAR" color="primary darken-2">
              <template #label>
                <v-icon small left>
                  mdi-calendar
                </v-icon>Calendario
              </template>
            </v-radio>
          </v-col>
          <v-col cols="12">
            <v-radio :value="MODES.LIST" color="primary darken-2">
              <template #label>
                <v-icon small left>
                  mdi-table
                </v-icon> Lista
              </template>
            </v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
      <v-spacer />
      <slot name="top-items-left" :item="currentSchedule" />
    </v-toolbar>

    <div
      class="row col align-self-center align-items-center justify-center align-content-center ma-1"
    >
      <slot name="subtitle" :item="currentSchedule">
        <slot name="subtitle-items" :item="currentSchedule" />
        <template v-if="schedules.length > 0">
          <v-menu v-if="mode === MODES.CALENDAR" offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                color="purple"
                dark
                rounded
                shaped
                class="ma-1"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-export</v-icon>
                Exportar
              </v-btn>
            </template>
            <ScheduleExport
              :dialog.sync="dialogExport"
              :schedule="currentSchedule"
            />
          </v-menu>

          <v-btn
            color="indigo"
            dark
            rounded
            shaped
            class="ma-1"
            @click="dialogShare = !dialogShare"
          >
            <v-icon>mdi-share-variant</v-icon>
            Compartir
          </v-btn>
          <GoogleAuth
            v-if="currentSchedule"
            :events="currentSchedule.events"
            :end-date="endDate"
            :start-date="startDate"
          />
          <v-dialog v-model="dialogExport" max-width="600">
            <ScheduleExport
              :dialog.sync="dialogExport"
              :schedule="currentSchedule"
            />
          </v-dialog>
          <v-dialog v-model="dialogShare" max-width="600">
            <ScheduleShare
              :path="path"
              :dialog.sync="dialogShare"
              :schedule="currentSchedule"
            />
          </v-dialog>
        </template>
      </slot>
    </div>

    <v-divider />
    <v-card-text v-if="schedules.length > 0">
      <schedules-list
        ref="calendar"
        :schedules="schedules"
        :current-schedule.sync="currentSchedule"
        :week-days="weekDays"
        :mode="mode"
      />
    </v-card-text>
    <v-card-text v-else>
      <slot name="emptyBody">
        {{ emptyMessage }}
      </slot>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import {
  Component,
  namespace,
  Prop,
  PropSync,
  Vue
} from 'nuxt-property-decorator'
import SchedulesList from '~/components/SchedulesList.vue'
import ScheduleShare from '~/components/ScheduleShare.vue'
import ScheduleExport from '~/components/ScheduleExport.vue'
import GoogleAuth from '~/components/GoogleAuth.vue'
import { ViewMode } from '~/model/ViewMode'
const userModule = namespace('user/config')

@Component({
  components: {
    SchedulesList,
    GoogleAuth,
    ScheduleShare,
    ScheduleExport
  }
})
export default class SchedulesPresentation extends Vue {
  get hourlyLoad () {
    return this.$store.state.user.config.hourlyLoad
  }

  get academicPeriodOrganizationUnit () {
    return this.hourlyLoad?.academicPeriodOrganizationUnit
  }

  get startDate () {
    return this.academicPeriodOrganizationUnit.fromDate
  }

  get endDate () {
    return this.academicPeriodOrganizationUnit.toDate
  }

  mounted () {
    this.vCalendar = document.getElementById('calendar')
  }

  vCalendar: any = null
  @Prop({ type: Array, default: [] })
    schedules!: []

  @Prop({ type: String, default: '/subject' })
    path!: string

  @Prop({ type: String, default: '' })
    title!: string

  @Prop({ type: String, default: 'primary' })
    color!: string

  @Prop({ type: String, default: '' })
    emptyMessage!: string

  @PropSync('dialog', { type: Boolean, default: false })
    dialogSync!: boolean

  currentSchedule: any = null

  dialogShare = false
  dialogExport = false

  @userModule.State
    weekDays!: Array<number>

  message = ''

  mode: ViewMode = ViewMode.CALENDAR

  MODES = ViewMode
}
</script>
