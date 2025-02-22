<template>
  <div class="h-calendar">
    <div class="h-calendar-header">
      <div class="h-calendar-empty-slot" />
      <div
        v-for="day in internalDays"
        :key="day.id"
        class="h-calendar-day-slot"
      >
        {{ day.name }}
      </div>
    </div>
    <div class="h-calendar-content">
      <CalendarTime :hours="hours" :interval-height="internalIntervalHeight" />
      <CalendarDay
        v-for="day in internalDays"
        :key="day.id"
        :week-day="day.id"
        :day="day.name"
        :events="events"
        :hours="hours"
        :interval-minutes="internalIntervalMinutes"
        :interval-height="internalIntervalHeight"
        :internal-width="internalIntervalWidth"
        @click:event="$emit('click:event', $event)"
        @dblclick:event="$emit('dblclick:event', $event)"
        @mousedown:event="$emit('mousedown:event', $event)"
        @mouseenter:event="$emit('mouseenter:event', $event)"
        @mouseleave:event="$emit('mouseleave:event', $event)"
        @mousemove:event="$emit('mousemove:event', $event)"
      >
        <template #event="{ event }">
          <slot name="event" :event="event" />
        </template>
      </CalendarDay>
    </div>
  </div>
</template>

<script lang="ts" setup generic="T extends ICalendarEvent = ICalendarEvent">
import { computed, toRefs } from 'vue'
import {
  END_HOUR,
  INTERVAL_MINUTES,
  START_HOUR,
} from '../constants/schedule-interval'
import type { ICalendarEvent, IEventEmitData } from '../types'
import { getHours } from '../utils/interval'
import {
  INTERVAL_HEIGHT_IN_REM,
  INTERVAL_WIDTH_IN_REM,
} from '../constants/interval'
import { WEEKDAYS, WEEKDAY_NAMES, type Weekdays } from '../constants/week'
import CalendarTime from './CalendarTime.vue'
import CalendarDay from './CalendarDay.vue'

defineOptions({
  name: 'HCalendar',
})

const props = withDefaults(
  defineProps<{
    events?: T[]
    firstInterval?: number | string
    lastInterval?: number | string
    weekdays?: Weekdays[]
    intervalMinutes?: number | string
    intervalHeight?: number | string
    internalWidth?: number | string
  }>(),
  {
    firstInterval: START_HOUR,
    lastInterval: END_HOUR,
    intervalMinutes: INTERVAL_MINUTES,
    intervalHeight: INTERVAL_HEIGHT_IN_REM,
    internalWidth: INTERVAL_WIDTH_IN_REM,
    weekdays: () => WEEKDAYS,
    events: () => [],
  },
)

defineEmits<{
  (key: 'click:event', value: IEventEmitData<T>): void
  (key: 'mouseenter:event', value: IEventEmitData<T>): void
  (key: 'mouseleave:event', value: IEventEmitData<T>): void
  (key: 'mousemove:event', value: IEventEmitData<T>): void
  (key: 'mousedown:event', value: IEventEmitData<T>): void
  (key: 'dblclick:event', value: IEventEmitData<T>): void
}>()

const {
  firstInterval,
  lastInterval,
  intervalMinutes,
  intervalHeight,
  weekdays,
  events,
  internalWidth,
} = toRefs(props)

const internalIntervalHeight = computed(() => {
  return Number(intervalHeight.value)
})

const internalIntervalMinutes = computed(() => {
  return Number(intervalMinutes.value)
})

const internalIntervalWidth = computed(() => {
  return Number(internalWidth.value)
})

const internaFirstInterval = computed(() => {
  return Number(firstInterval.value)
})

const internalLastInterval = computed(() => {
  return Number(lastInterval.value)
})

const hours = computed(() => {
  return getHours(
    internaFirstInterval.value,
    internalLastInterval.value,
    internalIntervalMinutes.value,
  )
})

const internalDays = computed(() => {
  const _weekdays = weekdays.value
  return _weekdays.map((day) => ({
    id: day,
    weekDay: (day % 7) as Weekdays,
    name: WEEKDAY_NAMES[day % 7],
  }))
})

const internalWidthRem = computed(() => internalWidth.value + 'rem')
</script>

<style lang="css">
.h-calendar {
  display: flex;
  flex-direction: column;
}

.h-calendar .h-calendar-header {
  display: flex;
  flex-direction: row;
  min-width: min-content;
}

.h-calendar-content {
  display: flex;
  flex-direction: row;
  min-width: min-content;
}

.h-calendar-day-slot {
  border-left: 1px solid #f5f5f5;
  border-right: 1px solid #f5f5f5;
  height: 2rem;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
  flex: 1 1 auto;
  width: v-bind(internalWidthRem);
}

.h-calendar-empty-slot {
  width: 2.5rem;
}
</style>
