<template>
  <schedules-presentation
    color="warning"
    title="Horarios Favoritos"
    empty-message="Usted no tiene horarios favoritos"
    :schedules="schedules"
  >
    <template #top-items-right>
      <v-toolbar-title>
        Horarios favoritos
      </v-toolbar-title>
    </template>
    <template #top-items-left="{item}">
      <schedule-favorite-add v-if="item" :favorites-schedules.sync="schedules" :schedule="item" />
    </template>
  </schedules-presentation>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  layout: 'app'
})
export default class Favorites extends Vue {
  get schedules () {
    return this.$store.state.modules.MyData.myFavoritesSchedules
  }

  set schedules (schedules: Array<any>) {
    this.$store.commit('modules/MyData/setMyFavoritesSchedules', schedules)
  }
}
</script>

<style scoped>

</style>
