<template>
  <v-btn
    variant="outlined"
    @click="addFavoriteCurrentSchedule(existingFavorite)"
  >
    <v-icon :color="existingFavorite ? 'yellow' : undefined">
      {{ mdiStar }}
    </v-icon>
    <span v-if="existingFavorite"> Quitar de Favoritos </span>
    <span v-else> Añadir a Favoritos </span>
  </v-btn>
</template>

<script setup lang="ts">
import { mdiStar } from '@mdi/js'
import type { IBaseScheduleGenerate, IScheduleGenerate } from '~/interfaces/schedule'

const props = defineProps<{
  schedule: IBaseScheduleGenerate
  favoritesSchedules: IScheduleGenerate[]
}>()

const { favoritesSchedules, schedule } = toRefs(props)

const emit = defineEmits<{
  (e: 'click:add-favorite', event: IBaseScheduleGenerate): void
  (e: 'click:remove-favorite', event: IScheduleGenerate['id']): void
}>()

const existingFavorite = computed(() => {
  return favoritesSchedules.value.find(
    (x) => x.scheduleSubjectKey === schedule.value.scheduleSubjectKey,
  )
})

const addFavoriteCurrentSchedule = (
  existingFavorite: IScheduleGenerate | undefined,
) => {
  if (existingFavorite) {
    emit('click:remove-favorite', existingFavorite.id)
  } else {
    emit('click:add-favorite', schedule.value)
  }
}
</script>
