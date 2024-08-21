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
        <template #default>
          <slot name="event" :event="event" />
        </template>
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
import type { WeekdaysISO } from '../constants/week'

const props = defineProps<{
  weekDay: WeekdaysISO
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
const { events, intervalHeight, hours, intervalMinutes, weekDay } =
  toRefs(props)

const startIntervalHour = computed(() => parseInt(hours.value[0]))

const intervalMinuteHeight = computed(() => {
  const totalHeight = dayContainer.value?.offsetHeight ?? 0
  const intervalHeight = totalHeight / hours.value.length
  const minuteHeight = intervalHeight / intervalMinutes.value
  return minuteHeight
})

const weekDayEvents = computed(() => {
  return events.value.filter((event) => event.weekDay === weekDay.value)
})

const groupEvents = computed(() => {
  const events = weekDayEvents.value
  return extractBlocks(events)
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
