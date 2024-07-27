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
      v-if="selectedElement"
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

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import EventInfoCard from '~/components/EventInfoCard.vue'
import ScheduleEventInfo from '~/components/ScheduleEventInfo.vue'
import type { IScheduleGenerate } from '~/interfaces/schedule'

const props = defineProps({
  schedule: {
    type: Object as PropType<IScheduleGenerate>,
    required: true,
  },
  weekDays: {
    type: Array,
    default: () => [1, 2, 3, 4, 5, 6],
  },
})
const { schedule } = toRefs(props)
const selectedEvent = ref(null)
const selectedElement = ref<HTMLElement | null>(null)
const selectedOpen = ref(false)

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
    schedule.value?.events?.map((event) => {
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
</script>
