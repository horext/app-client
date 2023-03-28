<template>
  <v-window id="window" class="px-6 mx-4" show-arrows continuous>
    <template #next>
      <v-icon large @click="next">
        mdi-arrow-right-bold-circle
      </v-icon>
    </template>

    <template #prev>
      <v-icon large @click="prev">
        mdi-arrow-left-bold-circle
      </v-icon>
    </template>
    <v-window-item v-if="schedule">
      <schedule-viewer
        v-show="mode == MODES.CALENDAR"
        :schedule="schedule"
        :week-days="weekDays"
      />
      <view-list v-show="mode == MODES.LIST" :schedule="schedule" />
      <v-divider />
      <v-footer class="text-center align-center justify-center">
        <v-pagination v-model="page" :length="schedules.length" />
      </v-footer>
    </v-window-item>
  </v-window>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'nuxt-property-decorator'
import ViewList from './schedule/ViewList.vue'
import ScheduleViewer from '~/components/ScheduleViewer.vue'
import ScheduleOptionsBar from '~/components/ScheduleOptionsBar.vue'
import ScheduleOptionsFAB from '~/components/ScheduleOptionsFAB.vue'
import { ViewMode } from '~/model/ViewMode'

@Component({
  components: {
    ScheduleOptionsFAB,
    ScheduleOptionsBar,
    ScheduleViewer,
    ViewList
  }
})
export default class SchedulesList extends Vue {
  @Prop({ type: Array, default: [] })
    schedules!: Array<any>

  @Prop({ type: Array, default: () => [1, 2, 3, 4, 5, 6] })
    weekDays!: Array<number>

  @PropSync('currentSchedule', { type: Object })
    syncedCurrentSchedule: any

  MODES = ViewMode

  @Prop({ type: String, default: () => ViewMode.CALENDAR })
    mode!: ViewMode

  @Watch('schedules')
  onChangeSchedules (newValue: string | any[], oldValue: string | any[]) {
    if (oldValue.length !== newValue.length) {
      this.index = 0
    }
  }

  @Watch('schedule', { immediate: true })
  onChangeSchedule (value: any) {
    if (this.index >= this.schedules.length) {
      this.index = this.schedules.length - 1
    }
    this.syncedCurrentSchedule = value
  }

  shareDialog = false
  get schedule () {
    return this.schedules[this.index]
  }

  next () {
    if (this.page < this.schedules.length) {
      this.page++
    } else {
      this.page = 1
    }
  }

  prev () {
    if (this.page > 1) {
      this.page--
    } else {
      this.page = this.schedules.length
    }
  }

  get page () {
    return this.index + 1
  }

  set page (page) {
    this.index = page - 1
  }

  @Watch('page')
  onChangePage (val: any) {
    this.$emit('page', val)
  }

  index = 0
}
</script>

<style lang="sass">
/* This is for documentation purposes and will not be needed in your application */
#lateral .v-btn--example
  bottom: 0
  position: absolute
  margin: 0 0 16px 16px

.v-application--is-ltr .v-window__next
  right: -28px

.v-application--is-ltr .v-window__prev
  left: -28px
</style>
