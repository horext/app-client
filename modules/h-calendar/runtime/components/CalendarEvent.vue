<template>
  <div
   class="h-calendar-event-timed"
    @dblclick="$emit('dblclick', $event)"
    @click.stop.prevent="$emit('click', $event)"
    @mousedown="$emit('mousedown', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mouseleave="$emit('mouseleave', $event)"
    @mousemove="$emit('mousemove', $event)"
  >
    <slot>
      <div class="p-2 h-calendar-event">
        <div class="event-name">{{ event.name }}</div>
        <div class="event-time">
          <span>{{ event.start }} </span><span> - </span>
          <span>{{ event.end }}</span>
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import type { ICalendarEvent } from '../types'

defineProps<{
  event: ICalendarEvent
}>()
defineEmits<{
  (key: 'dblclick', value: MouseEvent): void
  (key: 'click', value: MouseEvent): void
  (key: 'mousedown', value: MouseEvent): void
  (key: 'mouseenter', value: MouseEvent): void
  (key: 'mouseleave', value: MouseEvent): void
  (key: 'mousemove', value: MouseEvent): void
}>()
</script>

<style scoped>
.h-calendar-event {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
  color: #222038;
}

.event-name {
  overflow: hidden;
  color: #222038;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 150% */
}

.event-time {
  display: flex;
  color: #222038;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 150% */
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
