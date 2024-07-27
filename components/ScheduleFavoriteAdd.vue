<template>
  <schedule-favorite-action
    :active="isFavorite"
    @update:active="changeFavoriteState"
  />

  <base-snackbar v-model="showMessage">
    {{ isFavorite ? 'Agregado a favoritos' : 'Quitado de favoritos' }}
  </base-snackbar>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import ScheduleFavoriteAction from '~/components/schedule/FavoriteAction.vue'
import { useVModel } from '@vueuse/core'
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

const emit = defineEmits(['update:schedule', 'update:favoritesSchedules'])

const currentSchedule = useVModel(props, 'schedule', emit)

const favoritesSchedulesSync = useVModel(props, 'favoritesSchedules', emit)

const showMessage = ref(false)
const changeFavoriteState = (isFavorite: boolean) => {
  if (currentSchedule.value) {
    if (isFavorite) {
      const schedules = [...favoritesSchedulesSync.value]
      schedules.splice(indexSchedule.value, 1)
      favoritesSchedulesSync.value = schedules
    } else {
      favoritesSchedulesSync.value = [
        ...favoritesSchedulesSync.value,
        props.schedule,
      ]
    }
    showMessage.value = true
  }
}

const isFavorite = computed(() => indexSchedule.value > -1)

const indexSchedule = computed(() => {
  if (currentSchedule.value) {
    return favoritesSchedulesSync.value.findIndex(
      (e) => e && e.id === currentSchedule.value.id,
    )
  } else {
    return -1
  }
})
</script>
