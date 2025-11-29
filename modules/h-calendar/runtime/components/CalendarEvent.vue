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
import { HOUR_IN_MINUTES } from '../constants/time'
import type { ICalendarEvent, MouseEventTypes } from '../types'

const props = defineProps<{
  event: T
  startIntervalHour: number
  intervalMinuteHeight: number
  column: number
  columnCount: number
  left: number
  width: number
}>()
const emit = defineEmits<{
  (key: MouseEventTypes, value: MouseEvent): void
}>()
const { event, startIntervalHour, intervalMinuteHeight, left, width } =
  toRefs(props)

const position = computed(() => {
  const _event = event.value
  const [startHour, startMinute] = _event.start.split(':').map(Number)
  const [endHour, endMinute] = _event.end.split(':').map(Number)
  const firstHour = startIntervalHour.value
  const minuteHeight = intervalMinuteHeight.value
  const startMinutes = (startHour - firstHour) * HOUR_IN_MINUTES + startMinute
  const endMinutes = (endHour - firstHour) * HOUR_IN_MINUTES + endMinute
  const top = startMinutes * minuteHeight
  const height = (endMinutes - startMinutes) * minuteHeight
  return {
    top: top + 'rem',
    height: height + 'rem',
    left: left.value + '%',
    width: width.value + '%',
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
