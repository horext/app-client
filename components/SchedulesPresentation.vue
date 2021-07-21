<template>
  <v-card>
    <v-toolbar
      flat
      dark
      :color="color"
    >
      <slot name="top-items-right" />
      <v-spacer />
      <slot name="top-items-left" :item="currentSchedule">
        <template v-if="schedules.length>0">
          <v-badge
            v-if="currentSchedule"
            class="ma-2"
            color="secondary"
            overlap
            :content="currentSchedule.numCruces"
          >
            <v-btn
              x-small
              class="white--text"
              color="error"
              depressed
            >
              Cruces
            </v-btn>
          </v-badge>
          <v-btn
            fab
            outlined
            icon
            :color="isFavoriteCurrentSchedule?'yellow':null"
            @click="changeFavoriteCurrentSchedule"
          >
            <v-icon :color="isFavoriteCurrentSchedule?'yellow':null">
              mdi-star
            </v-icon>
          </v-btn>
        </template>
      </slot>
    </v-toolbar>

    <div class="row col align-self-center align-items-center justify-center align-content-center">
      <slot name="subtitle" :item="currentSchedule">
        <slot name="subtitle-items" :item="currentSchedule" />
        <template v-if="schedules.length>0">
          <v-btn
            color="purple"
            dark
            rounded
            shaped
            class="ma-1"
            @click="dialogExport=!dialogExport"
          >
            <v-icon>mdi-export</v-icon>
            Exportar
          </v-btn>
          <v-btn
            color="indigo"
            dark
            rounded
            shaped
            class="ma-1"
            @click="dialogShare=!dialogShare"
          >
            <v-icon>mdi-share-variant</v-icon>
            Compartir
          </v-btn>
          <v-dialog
            v-model="dialogExport"
            max-width="600"
          >
            <ScheduleExport :dialog.sync="dialogExport" :schedule="currentSchedule" />
          </v-dialog>
          <v-dialog
            v-model="dialogShare"
            max-width="600"
          >
            <ScheduleShare :path="path" :dialog.sync="dialogShare" :schedule="currentSchedule" />
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
import { Component, namespace, Prop, PropSync, Vue, Getter } from 'nuxt-property-decorator'
import SchedulesList from '~/components/SchedulesList.vue'
import ScheduleShare from '~/components/ScheduleShare.vue'
import ScheduleExport from '~/components/ScheduleExport.vue'
const userModule = namespace('modules/UserModule')

@Component(
  {
    components: {
      SchedulesList,
      ScheduleShare,
      ScheduleExport
    }
  }
)
export default class SchedulesPresentation extends Vue {
  mounted () {
    this.vCalendar = document.getElementById('calendar')
  }

  vCalendar: any = null
  @Prop({ type: Array, default: [] })
  schedules!: [];

  @Prop({ type: String, default: '/schedule' })
  path!:string

  @Prop({ type: String, default: '' })
  title!: string;

  @Prop({ type: String, default: 'primary' })
  color!: string;

  @Prop({ type: String, default: '' })
  emptyMessage!: string;

  @PropSync('dialog', { type: Boolean, default: false })
  dialogSync!:boolean

  currentSchedule:any =null

  dialogShare = false;
  dialogExport = false;

  @userModule.State
  weekDays!: Array<number>;

  @userModule.Mutation
  deleteFavoriteSchedule!: (index: any) => {};

  @userModule.Mutation
  addFavoriteSchedule!: (schedule: any) => {};

  get isFavoriteCurrentSchedule () {
    return this.indexCurrentFavoriteSchedule >= 0
  }

  message = ''
  showMessage = false
  changeFavoriteCurrentSchedule () {
    const index = this.indexCurrentFavoriteSchedule
    if (index >= 0) {
      this.deleteFavoriteSchedule({
        indexFavorite: index,
        indexSchedule: this.indexCurrentSchedule
      })
      this.showMessage = true
      this.message = 'Horario quitado de Favoritos'
    } else {
      this.addFavoriteSchedule({
        schedule: this.currentSchedule,
        index: this.indexCurrentSchedule
      })
      this.showMessage = true
      this.message = 'Horario añadido de Favoritos'
    }
  }

  @Getter('findIndexMyFavoriteScheduleById', { namespace: 'modules/UserModule' })
  findIndexMyFavoriteScheduleById!: (id: string) => number;

  get indexCurrentFavoriteSchedule (): number {
    if (this.currentSchedule == null) { return -1 }
    return this.findIndexMyFavoriteScheduleById(this.currentSchedule.id)
  }

  @Getter('findIndexMyScheduleById', { namespace: 'modules/UserModule' })
  findIndexMyScheduleById!: (id: string) => number;

  get indexCurrentSchedule () {
    if (this.currentSchedule == null) { return -1 }
    return this.findIndexMyScheduleById(this.currentSchedule.id)
  }
}
</script>
