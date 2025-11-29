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
      :left="visual.left"
      :width="visual.width"
      :first-hour="firstHour"
      :interval-height="intervalHeight"
      :interval-minutes="intervalMinutes"
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
import type { CalendarEventVisual } from '../composables/useCalendarEvents'
import Event from './CalendarEvent.vue'
import DayHour from './CalendarDayHour.vue'
import type { Weekdays } from '../constants/week'

const props = defineProps<{
  weekDay: Weekdays
  day: string
  hours: string[]
  eventVisuals: CalendarEventVisual<T>[]
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
const { hours, internalWidth, intervalHeight } = toRefs(props)

// Derive firstHour once - passed to events as stable value
const firstHour = computed(() => parseInt(hours.value[0] ?? '0'))

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
