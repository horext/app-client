<template>
  <v-tooltip location="bottom">
    <template #activator="{ props }">
      <v-btn
        variant="outlined"
        icon
        :color="isFavorite ? 'yellow' : undefined"
        v-bind="props"
        @click="changeFavoriteState"
      >
        <v-icon :color="isFavorite ? 'yellow' : undefined">
          {{ mdiStar }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{
      isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
    }}</span>
  </v-tooltip>
  <v-snackbar v-model="showMessage" :timeout="2000" color="success">
    {{ isFavorite ? 'Agregado a favoritos' : 'Quitado de favoritos' }}
    <template #actions>
      <v-btn variant="text" size="small" icon @click="showMessage = false">
        <v-icon> {{ mdiClose }} </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import { mdiStar, mdiClose } from '@mdi/js'

export default defineComponent({
  name: 'ScheduleFavoriteAdd',
  props: {
    schedule: {
      type: Object as PropType<IScheduleGenerate>,
      required: true,
    },
    favoritesSchedules: {
      type: Array as PropType<Array<IScheduleGenerate>>,
      default: () => [],
    },
  },
  emits: ['update:schedule', 'update:favoritesSchedules'],
  setup(props, { emit }) {
    const currentSchedule = useVModel(props, 'schedule', emit)

    const favoritesSchedulesSync = useVModel(props, 'favoritesSchedules', emit)

    const message = ref('')

    const showMessage = ref(false)
    const changeFavoriteState = () => {
      if (currentSchedule.value) {
        if (isFavorite.value) {
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

    return {
      favoritesSchedulesSync,
      currentSchedule,
      showMessage,
      message,
      changeFavoriteState,
      isFavorite,
      indexSchedule,
      mdiStar,
      mdiClose,
    }
  },
})
</script>
