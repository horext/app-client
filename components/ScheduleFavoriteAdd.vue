<template>
  <schedule-favorite-action
    :active="isFavorite"
    @update:active="changeFavoriteState"
  />
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import ScheduleFavoriteAction from '~/components/schedule/FavoriteAction.vue'
import type { IScheduleGenerate } from '~/interfaces/schedule'

const props = defineProps({
  schedule: {
    type: Object as PropType<IScheduleGenerate>,
    required: true,
  },
  favoritesSchedules: {
    type: Array as PropType<Array<IScheduleGenerate>>,
    default: () => [],
  },
})

const emit = defineEmits<{
  (event: 'click:addFavorite', value: IScheduleGenerate): void
  (event: 'click:removeFavorite', value: IScheduleGenerate): void
}>()

const {
  schedule: currentSchedule,
  favoritesSchedules: favoritesSchedulesSync,
} = toRefs(props)

const indexSchedule = computed(() => {
  if (currentSchedule.value) {
    return favoritesSchedulesSync.value.findIndex(
      (e) => e && e.id === currentSchedule.value.id,
    )
  } else {
    return -1
  }
})

const isFavorite = computed(() => indexSchedule.value > -1)
const changeFavoriteState = (isFavorite: boolean) => {
  if (isFavorite) {
    emit('click:addFavorite', currentSchedule.value)
  } else {
    emit('click:removeFavorite', currentSchedule.value)
  }
}
</script>
