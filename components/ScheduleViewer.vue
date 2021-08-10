<template lang="html">
  <v-sheet>
    <v-calendar
      id="calendar"
      v-model="focus"
      :start="start"
      :events="schedule.events"
      first-interval="7"
      interval-count="16"
      :event-color="getEventColor"
      :type="type"
      interval-width="40"
      :short-intervals="false"
      :interval-format="intervalFormat"
      :weekdays="[1,2,3,4,5,6]"
      @click:event="showEvent"
    >
      <template #day-label-header>
        <div />
      </template>
      <template
        #event="{event, attrs,on}"
      >
        <v-hover>
          <template #default="{ hover }">
            <schedule-event-info
              :key="event.id"
              v-bind="attrs"
              :event="event"
              :hover="hover"
              v-on="on"
            />
          </template>
        </v-hover>
      </template>
    </v-calendar>
    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
    >
      <EventInfoCard
        v-if="selectedEvent"
        :selected-event="selectedEvent"
        :dialog.sync="selectedOpen"
      />
    </v-menu>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import EventInfoCard from '~/components/EventInfoCard.vue'
import ScheduleEventInfo from '~/components/ScheduleEventInfo.vue'

@Component({
  components: {
    ScheduleEventInfo,
    EventInfoCard
  }
}
)
export default class ScheduleViewer extends Vue {
  @Prop({ type: Object })
  schedule!: any

  @Prop({ type: Array, default: () => [1, 2, 3, 4, 5, 6] })
  weekDays!: Array<number>

  hover= false
  focus= ''
  type= 'week'
  intervalFormat (interval: { time: any }) {
    return interval.time
  }

  get start () {
    if (this.schedule.startDate && this.schedule.startDate !== 'Lunes') {
      return this.schedule.startDate
    }
    if (this.schedule.events.length > 0) {
      if (this.schedule.events[0].start.substr(0, 7) === '2020-03') {
        return '2020-03-16'
      }
      if (this.schedule.events[0].start.substr(0, 7) === '2020-11') {
        return '2020-11-09'
      }
    }
    return '2020-03-16'
  }

  selectedEvent= null
  selectedElement= null
  selectedOpen= false
  events= []

  getEventColor (event: { color: any }) {
    return event.color
  }

  showEvent ({ nativeEvent, event } : any) {
    const open = () => {
      this.selectedEvent = event
      this.selectedElement = nativeEvent.target
      setTimeout(() => {
        this.selectedOpen = true
      }, 10)
    }

    if (this.selectedOpen) {
      this.selectedOpen = false
      setTimeout(open, 10)
    } else {
      open()
    }

    nativeEvent.stopPropagation()
  }
}

</script>
