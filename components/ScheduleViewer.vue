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
      :weekdays="[0, 1, 2, 3, 4, 5, 6]"
      @click:event="showEvent"
    >
      <template #day-label-header>
        <div />
      </template>
      <template #event="{ event, attrs, on }">
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
import { ref } from 'vue'
import EventInfoCard from '~/components/EventInfoCard.vue'
import ScheduleEventInfo from '~/components/ScheduleEventInfo.vue'
import { weekdayToDate } from '~/utils/core'

export default {
  components: {
    ScheduleEventInfo,
    EventInfoCard,
  },
  props: {
    schedule: {
      type: Object,
      required: true,
    },
    weekDays: {
      type: Array,
      default: () => [1, 2, 3, 4, 5, 6],
    },
  },
  setup() {
    const hover = ref(false)
    const focus = ref('')
    const type = ref('week')

    const intervalFormat = (interval: any) => {
      return interval.time
    }

    const start = weekdayToDate(0)

    const selectedEvent = ref(null)
    const selectedElement = ref(null)
    const selectedOpen = ref(false)
    const events = ref([])

    const getEventColor = (event: any) => {
      return event.color
    }

    const showEvent = ({
      nativeEvent,
      event,
    }: {
      nativeEvent: any
      event: any
    }) => {
      const open = () => {
        selectedEvent.value = event
        selectedElement.value = nativeEvent.target
        setTimeout(() => {
          selectedOpen.value = true
        }, 10)
      }

      if (selectedOpen.value) {
        selectedOpen.value = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    }

    return {
      hover,
      focus,
      type,
      selectedEvent,
      selectedElement,
      selectedOpen,
      events,
      intervalFormat,
      start,
      getEventColor,
      showEvent,
    }
  },
}
</script>
