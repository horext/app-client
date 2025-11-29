<template>
  <div class="h-calendar-time px-1">
    <div v-for="hour in hours" :key="hour" class="h-calendar-time-slot">
      {{ hour }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue'

const props = defineProps<{
  hours: string[]
  intervalHeight: number
}>()

const { intervalHeight } = toRefs(props)

const intervalHeightPx = computed(() => `${intervalHeight.value}rem`)
</script>

<style scoped>
.h-calendar-time {
  display: flex;
  flex-direction: column;
  width: 2.5rem;
  font-size: 0.8rem;
}

.h-calendar-time-slot {
  min-height: v-bind(intervalHeightPx);
  max-height: v-bind(intervalHeightPx);
  height: v-bind(intervalHeightPx);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  color: #a8a8a8;
  padding-right: 0.5rem;
}
</style>
