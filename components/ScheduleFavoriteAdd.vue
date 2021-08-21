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
import { Component, PropSync, Vue } from 'nuxt-property-decorator'

@Component
export default class ScheduleFavoriteAdd extends Vue {
  @PropSync('schedule', { default: () => (null) })
  currentSchedule!:any

  @PropSync('favoritesSchedules', { default: () => ([]) })
  favoritesSchedulesSync!:Array<any>

  showMessage= false
  message= ''

  changeFavoriteState () {
    if (this.currentSchedule) {
      if (this.isFavorite) {
        const schedules = [...this.favoritesSchedulesSync]
        schedules.splice(this.indexSchedule, 1)
        this.favoritesSchedulesSync = schedules
      } else {
        this.favoritesSchedulesSync = [...this.favoritesSchedulesSync, this.currentSchedule]
      }
      this.$snackbar({
        content: this.isFavorite ? 'Agregado a favoritos' : 'Quitado de Favoritos',
        timeout: 2000,
        color: 'yellow darken-3'
      })
    }
  }

  get isFavorite () {
    return this.indexSchedule > -1
  }

  get indexSchedule () {
    if (this.currentSchedule) {
      return this.favoritesSchedulesSync
        .findIndex(e => e && (e.id === this.currentSchedule.id))
    } else {
      return -1
    }
  }
}
</script>

<style scoped>

</style>
