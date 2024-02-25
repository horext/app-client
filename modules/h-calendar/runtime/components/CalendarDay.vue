<template>
  <div
    ref="dayContainer"
    class="h-calendar-day"
    @mouseup="emit('mouseup', $event)"
    @mousemove="emit('mousemove', $event)"
    @mousedown="emit('mousedown', $event)"
  >
    <DayHour
      v-for="hour in hours"
      :key="hour"
      :hour="hour"
      :interval-height="intervalHeight"
      @click="emit('click:hour', hour)"
      @mouseover="emit('mouseover:hour', hour)"
      @mouseleave="emit('mouseleave:hour', hour)"
      @mousedown="emit('mousedown:hour', hour)"
      @mouseup="emit('mouseup:hour', hour)"
      @mousemove="emit('mousemove:hour', hour)"
    />
    <Event
      v-for="(event, index) in internalEvents"
      :key="event.data.id || index"
      :event="event.data"
      :style="{
        top: event.position.top + 'px',
        height: event.position.height + 'px',
        left: event.position.left + '%',
        width: event.position.width + '%',
      }"
      @dblclick="
        $emit('dblclick:event', { event: event.data, nativeEvent: $event })
      "
      @click="
        $emit('click:event', {
          event: event.data,
          nativeEvent: $event,
        })
      "
      @mousedown="
        $emit('mousedown:event', { event: event.data, nativeEvent: $event })
      "
      @mouseenter="
        $emit('mouseenter:event', {
          event: event.data,
          nativeEvent: $event,
        })
      "
      @mouseleave="
        $emit('mouseleave:event', {
          event: event.data,
          nativeEvent: $event,
        })
      "
      @mousemove="
        $emit('mousemove:event', {
          event: event.data,
          nativeEvent: $event,
        })
      "
    >
      <template #default>
        <slot name="event" :event="event.data"> </slot>
      </template>
    </Event>
  </div>
</template>

<script lang="ts" setup generic="T extends ICalendarEvent = ICalendarEvent">
import { ref, computed, toRefs } from 'vue'
import { HOUR_IN_MINUTES } from '../constants/time'
import { WIDTH_FULL } from '../constants/event'
import type { ICalendarEvent, IEventEmitData } from '../types'
import Event from './CalendarEvent.vue'
import DayHour from './CalendarDayHour.vue'

const props = defineProps<{
  day: string
  hours: string[]
  events: T[]
  intervalMinutes: number
  internalWidth: number
  intervalHeight: number
}>()
const emit = defineEmits<{
  (key: 'click:hour', hour: string): void
  (key: 'mouseup:hour', event: string): void
  (key: 'mousedown:hour', event: string): void
  (key: 'mousemove:hour', event: string): void
  (key: 'mouseover:hour', event: string): void
  (key: 'mouseleave:hour', event: string): void
  (key: 'mouseleave:event', event: T): void
  (key: 'mouseup', event: MouseEvent): void
  (key: 'mousemove', event: MouseEvent): void
  (key: 'mousedown', event: MouseEvent): void
  (key: 'click:event', event: IEventEmitData<T>): void
  (key: 'dblclick:event', event: IEventEmitData<T>): void
  (key: 'mousedown:event', event: IEventEmitData<T>): void
  (key: 'mouseenter:event', event: IEventEmitData<T>): void
  (key: 'mouseleave:event', event: IEventEmitData<T>): void
  (key: 'mousemove:event', event: IEventEmitData<T>): void
}>()
const { events, intervalHeight, hours, intervalMinutes } = toRefs(props)

const calculatePosition = (event: ICalendarEvent) => {
  const [startHour, startMinute] = event.start.split(':').map(Number)
  const [endHour, endMinute] = event.end.split(':').map(Number)
  const firstHour = parseInt(props.hours[0])
  const totalHeight = dayContainer.value?.offsetHeight ?? 0
  const intervalHeight = totalHeight / hours.value.length
  const minuteHeight = intervalHeight / intervalMinutes.value
  const startMinutes = (startHour - firstHour) * HOUR_IN_MINUTES + startMinute
  const endMinutes = (endHour - firstHour) * HOUR_IN_MINUTES + endMinute
  const top = startMinutes * minuteHeight
  const bottom = endMinutes * minuteHeight
  const height = bottom - top
  const left = 0
  return {
    top,
    height,
    left,
    bottom,
    width: WIDTH_FULL,
  }
}

const internalEvents = computed(() => {
  return events.value
    .map((event) => {
      return {
        data: event,
        position: calculatePosition(event),
      }
    })
    .sort((a, b) => {
      if (a.position.top < b.position.top) {
        return -1
      }
      if (a.position.top > b.position.top) {
        return 1
      }
      return 0
    })
    .map((event, _index, array) => {
      const collisions = array.filter(
        (otherEvent) =>
          event.position.top < otherEvent.position.bottom &&
          event.position.bottom > otherEvent.position.top,
      )
      const collisionsLength = collisions.length
      if (collisionsLength > 1) {
        const index = collisions.indexOf(event)
        const width = WIDTH_FULL / collisionsLength
        return {
          ...event,
          position: {
            ...event.position,
            left: width * index,
            width: width + (collisionsLength - index - 1) * 15,
          },
        }
      }
      return event
    })
})

const dayContainer = ref<null | HTMLDivElement>(null)
const internalWidthRem = computed(() => props.internalWidth + 'rem')
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
