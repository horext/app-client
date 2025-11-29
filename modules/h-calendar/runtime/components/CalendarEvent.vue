<template>
  <div
    class="h-calendar-event-timed"
    :style="position"
    @dblclick="emit('dblclick', $event)"
    @click.stop.prevent="emit('click', $event)"
    @mousedown="emit('mousedown', $event)"
    @mouseenter="emit('mouseenter', $event)"
    @mouseleave="emit('mouseleave', $event)"
    @mousemove="emit('mousemove', $event)"
  >
    <slot>
      <div class="h-calendar-event">
        <div class="event-name">
          {{ event.name }}
        </div>
        <div class="event-time">
          <span>{{ event.start }} </span><span> - </span>
          <span>{{ event.end }}</span>
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup generic="T extends ICalendarEvent = ICalendarEvent">
import { computed } from 'vue'
import { HOUR_IN_MINUTES } from '../constants/time'
import type { ICalendarEvent, MouseEventTypes } from '../types'

const props = defineProps<{
  event: T
  left: number
  width: number
  firstHour: number
  intervalHeight: number
  intervalMinutes: number
}>()

const emit = defineEmits<{
  (key: MouseEventTypes, value: MouseEvent): void
}>()

// Self-contained position calculation - only recalculates when THIS event's props change
const position = computed(() => {
  const { event, left, width, firstHour, intervalHeight, intervalMinutes } = props
  
  const startParts = event.start.split(':')
  const endParts = event.end.split(':')
  const startHour = Number(startParts[0] ?? 0)
  const startMinute = Number(startParts[1] ?? 0)
  const endHour = Number(endParts[0] ?? 0)
  const endMinute = Number(endParts[1] ?? 0)
  
  const minuteHeight = intervalHeight / intervalMinutes
  const startMinutes = (startHour - firstHour) * HOUR_IN_MINUTES + startMinute
  const endMinutes = (endHour - firstHour) * HOUR_IN_MINUTES + endMinute
  const top = startMinutes * minuteHeight
  const height = (endMinutes - startMinutes) * minuteHeight
  
  return {
    top: `${top}rem`,
    height: `${height}rem`,
    left: `${left}%`,
    width: `${width}%`,
  }
})
</script>

<style scoped>
.h-calendar-event {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
  color: #222038;
  border: 1px solid #e0e0e0;
}

.event-name {
  overflow: hidden;
  color: #222038;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
}

.event-time {
  display: flex;
  color: #222038;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
}

.h-calendar-event-timed {
  position: absolute;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  pointer-events: all;
  display: flex;
  width: 100%;
  overflow: hidden;
}
</style>
