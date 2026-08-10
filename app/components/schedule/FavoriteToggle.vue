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

defineOptions({
  name: 'ScheduleFavoriteAdd',
})

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
  (
    event: 'click:addFavorite' | 'click:removeFavorite',
    value: IScheduleGenerate,
  ): void
}>()

const {
  schedule: currentSchedule,
  favoritesSchedules: favoritesSchedulesSync,
} = toRefs(props)

const favoriteSchedule = computed(() => {
  const current = currentSchedule.value
  return favoritesSchedulesSync.value.find(
    (e) =>
      e &&
      (e.id === current.id ||
        (e.scheduleSubjectKey === current.scheduleSubjectKey &&
          e.events.length === current.events.length)),
  )
})

const isFavorite = computed(() => !!favoriteSchedule.value)
const changeFavoriteState = (isFavorite: boolean) => {
  if (isFavorite) {
    emit('click:addFavorite', currentSchedule.value)
  } else if (favoriteSchedule.value) {
    emit('click:removeFavorite', favoriteSchedule.value)
  }
}
</script>
