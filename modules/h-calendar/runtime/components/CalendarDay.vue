<template>
  <div ref="dayContainer" class="h-calendar-day">
    <DayHour
      v-for="hour in hours"
      :key="hour"
      :hour="hour"
      :interval-height="intervalHeight"
    />
    <Event
      v-for="visual in eventVisuals"
      :key="visual.event.id"
      :event="visual.event"
      :column="visual.column"
      :column-count="visual.columnCount"
      :left="visual.left"
      :width="visual.width"
      :interval-minute-height="intervalMinuteHeight"
      :start-interval-hour="startIntervalHour"
      @dblclick="
        $emit('dblclick:event', { event: visual.event, nativeEvent: $event })
      "
      @click="
        $emit('click:event', {
          event: visual.event,
          nativeEvent: $event,
        })
      "
      @mousedown="
        $emit('mousedown:event', { event: visual.event, nativeEvent: $event })
      "
      @mouseenter="
        $emit('mouseenter:event', {
          event: visual.event,
          nativeEvent: $event,
        })
      "
      @mouseleave="
        $emit('mouseleave:event', {
          event: visual.event,
          nativeEvent: $event,
        })
      "
      @mousemove="
        $emit('mousemove:event', {
          event: visual.event,
          nativeEvent: $event,
        })
      "
    >
      <slot name="event" :event="visual.event" />
    </Event>
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

const startIntervalHour = computed(() => parseInt(hours.value[0] ?? '0'))

const intervalMinuteHeight = computed(() => {
  const heightPerInterval = intervalHeight.value
  const minuteHeight = heightPerInterval / intervalMinutes.value
  return minuteHeight
})

const weekDayEvents = computed(() => {
  return events.value.filter((event) => event.weekDay % 7 === weekDay.value)
})

const eventVisuals = computed(() => {
  return extractBlocks(weekDayEvents.value)
})

const dayContainer = ref<null | HTMLDivElement>(null)
const internalWidthRem = computed(() => internalWidth.value + 'rem')
const intervalHeightRem = computed(() => intervalHeight.value + 'rem')
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
