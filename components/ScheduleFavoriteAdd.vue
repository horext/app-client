<template>
  <div>
    <v-btn
      fab
      outlined
      icon
      :color="isFavorite ? 'yellow' : null"
      @click="changeFavoriteState"
    >
      <v-icon :color="isFavorite ? 'yellow' : null"> mdi-star </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type  PropType, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { useSnackbar } from '~/composables/snackbar'
import type { ISchedule } from '~/interfaces/schedule'

export default defineComponent({
  name: 'ScheduleFavoriteAdd',
  props: {
    schedule: {
      type: Object as PropType<ISchedule>,
      required: true,
    },
    favoritesSchedules: {
      type: Array as PropType<Array<ISchedule>>,
      default: () => [],
    },
  },
  emits: ['update:schedule', 'update:favoritesSchedules'],
  setup(props, { emit }) {
    const currentSchedule = useVModel(props, 'schedule', emit)

    const favoritesSchedulesSync = useVModel(props, 'favoritesSchedules', emit)

    const showMessage = ref(false)
    const message = ref('')
    const snackbar = useSnackbar()
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
        snackbar.showMessage({
          content: !isFavorite.value
            ? 'Agregado a favoritos'
            : 'Quitado de Favoritos',
          timeout: 2000,
          color: 'yellow darken-3',
        })
      }
    }

    const isFavorite = computed(() => indexSchedule.value > -1)

    const indexSchedule = computed(() => {
      if (currentSchedule.value) {
        return favoritesSchedulesSync.value.findIndex(
          (e) => e && e.id === currentSchedule.value.id
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
    }
  },
})
</script>
