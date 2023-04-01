<template>
  <div>
    <v-btn
      fab
      outlined
      icon
      :color="isFavorite?'yellow':null"
      @click="changeFavoriteState"
    >
      <v-icon :color="isFavorite?'yellow':null">
        mdi-star
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { useSnackbar } from '~/composables/snackbar'

export default defineComponent({
  name: 'ScheduleFavoriteAdd',
  props: {
    schedule: {
      type: Object as PropType<any>,
      default: null
    },
    favoritesSchedules: {
      type: Array as PropType<Array<any>>,
      default: () => []
    }
  },
  setup (props, { emit }) {
    const currentSchedule = computed<any>({
      get () {
        return props.schedule
      },
      set (schedule) {
        emit('update:schedule', schedule)
      }
    })

    const favoritesSchedulesSync = computed< any[]>({
      get () {
        return props.favoritesSchedules
      },
      set (favoritesSchedules) {
        emit('update:favoritesSchedules', favoritesSchedules)
      }
    })

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
          favoritesSchedulesSync.value = [...favoritesSchedulesSync.value, props.schedule]
        }
        snackbar.showMessage({
          content: !isFavorite.value ? 'Agregado a favoritos' : 'Quitado de Favoritos',
          timeout: 2000,
          color: 'yellow darken-3'
        })
      }
    }

    const isFavorite = computed(() => indexSchedule.value > -1)

    const indexSchedule = computed(() => {
      if (currentSchedule.value) {
        return favoritesSchedulesSync.value.findIndex(
          e => e && e.id === currentSchedule.value.id
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
      indexSchedule
    }
  }
})
</script>

<style scoped>

</style>
