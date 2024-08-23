<template>
  <div
    :key="hour"
    ref="dropZoneRef"
    class="h-calendar-day-hour"
    @mouseover="$emit('mouseover', $event)"
    @mousedown="$emit('mousedown', $event)"
    @mouseleave="$emit('mouseleave', $event)"
    @mouseup="$emit('mouseup', $event)"
    @mousemove="$emit('mousemove', $event)"
  >
    <div class="h-calendar-day-hour-slot">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  hour: string
  intervalHeight: number
}>()

defineEmits<{
  (key: 'click', e: MouseEvent): void
  (key: 'mouseover', e: MouseEvent): void
  (key: 'mouseleave', e: MouseEvent): void
  (key: 'mousedown', e: MouseEvent): void
  (key: 'mouseup', e: MouseEvent): void
  (key: 'mousemove', e: MouseEvent): void
}>()

const { intervalHeight } = toRefs(props)

const intervalHeightPx = computed(() => `${intervalHeight.value}rem`)
</script>

<style scoped>
.hour,
.h-calendar-day-hour {
  min-height: v-bind(intervalHeightPx);
  max-height: v-bind(intervalHeightPx);
  height: v-bind(intervalHeightPx);
  width: 100%;
  border-bottom: 1px solid #f5f5f5;
}

.h-calendar-day-hour-slot {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
