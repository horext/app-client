<template>
  <div ref="dayContainer" class="h-calendar-day">
    <DayHour
      v-for="hour in hours"
      :key="hour"
      :hour="hour"
      :interval-height="intervalHeight"
    />
    <template v-for="group in groupEvents">
      <Event
        v-for="event in group"
        :key="event.id"
        :event="event"
        :events="group"
        :interval-minute-height="intervalMinuteHeight"
        :start-interval-hour="startIntervalHour"
        @dblclick="
          $emit('dblclick:event', { event: event, nativeEvent: $event })
        "
        @click="
          $emit('click:event', {
            event: event,
            nativeEvent: $event,
          })
        "
        @mousedown="
          $emit('mousedown:event', { event: event, nativeEvent: $event })
        "
        @mouseenter="
          $emit('mouseenter:event', {
            event: event,
            nativeEvent: $event,
          })
        "
        @mouseleave="
          $emit('mouseleave:event', {
            event: event,
            nativeEvent: $event,
          })
        "
        @mousemove="
          $emit('mousemove:event', {
            event: event,
            nativeEvent: $event,
          })
        "
      >
        <slot name="event" :event="event" />
      </Event>
    </template>
  </div>
</template>

<script lang="ts" setup generic="T extends ICalendarEvent = ICalendarEvent">
import { ref, computed, toRefs } from 'vue'
import type { ICalendarEvent, IEventEmitData } from '../types'
import Event from './CalendarEvent.vue'
import DayHour from './CalendarDayHour.vue'
import { extractBlocks } from '../utils/block'
import type { Weekdays } from '../constants/week'

const props = defineProps<{
  weekDay: Weekdays
  day: string
  hours: string[]
  events: T[]
  intervalMinutes: number
  internalWidth: number
  intervalHeight: number
}>()
defineEmits<{
  (
    key:
      | 'click:event'
      | 'dblclick:event'
      | 'mousedown:event'
      | 'mouseenter:event'
      | 'mouseleave:event'
      | 'mousemove:event',
    event: IEventEmitData<T>,
  ): void
}>()
const {
  events,
  intervalHeight,
  hours,
  intervalMinutes,
  weekDay,
  internalWidth,
} = toRefs(props)

const startIntervalHour = computed(() => parseInt(hours.value[0]))

const intervalMinuteHeight = computed(() => {
  const totalHeight = dayContainer.value?.offsetHeight ?? 0
  const intervalHeight = totalHeight / hours.value.length
  const minuteHeight = intervalHeight / intervalMinutes.value
  return minuteHeight
})

const weekDayEvents = computed(() => {
  return events.value.filter((event) => event.weekDay % 7 === weekDay.value)
})

const groupEvents = computed(() => {
  const events = weekDayEvents.value
  return extractBlocks(events)
})
const dayContainer = ref<null | HTMLDivElement>(null)
const internalWidthRem = computed(() => internalWidth.value + 'rem')
</script>

<style scoped>
.h-calendar-day {
  position: relative;
  display: flex;
  flex-direction: column;
  width: v-bind(internalWidthRem);
  border-left: 1px solid #f5f5f5;
  border-right: 1px solid #f5f5f5;
  flex: 1 1 auto;
}
</style>
