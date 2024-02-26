<template>
  <v-sheet>
    <h-calendar
      id="calendar"
      first-interval="7"
      interval-count="16"
      interval-width="40"
      :events="internalEvents"
      :weekdays="[0, 1, 2, 3, 4, 5, 6]"
      @click:event="showEvent"
    >
      <template #event="{ event }">
        <schedule-event-info :key="event.id" :event="event" />
      </template>
    </h-calendar>
    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      location="bottom left"
    >
      <EventInfoCard
        v-if="selectedEvent"
        v-model:dialog="selectedOpen"
        :selected-event="selectedEvent"
      />
    </v-menu>
  </v-sheet>
</template>

<script lang="ts">
import { ref } from 'vue'
import EventInfoCard from '~/components/EventInfoCard.vue'
import ScheduleEventInfo from '~/components/ScheduleEventInfo.vue'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import { weekdayToDate } from '~/utils/core'

export default {
  components: {
    ScheduleEventInfo,
    EventInfoCard,
  },
  props: {
    schedule: {
      type: Object as PropType<IScheduleGenerate>,
      required: true,
    },
    weekDays: {
      type: Array,
      default: () => [1, 2, 3, 4, 5, 6],
    },
  },
  setup(props) {
    const hover = ref(false)
    const focus = ref()
    const type = ref('week')
    const start = weekdayToDate(0)

    const selectedEvent = ref(null)
    const selectedElement = ref<HTMLElement | null>(null)
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

    const internalEvents = computed(
      () =>
        props.schedule?.events?.map((event) => {
          return {
            ...event,
            start: event.startTime,
            end: event.endTime,
            weekDay: event.day,
            id: event.id!,
            name: event.title,
          }
        }) ?? [],
    )

    return {
      hover,
      focus,
      type,
      selectedEvent,
      selectedElement,
      selectedOpen,
      events,
      start,
      getEventColor,
      showEvent,
      internalEvents,
    }
  },
}
</script>
