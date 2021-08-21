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
    <template #emptyBody>
      <div>
        <div id="bm" />
        <div>Agrega tus horario favoritos</div>
      </div>
    </template>
  </schedules-presentation>
</template>

<script lang="ts">
import Lottie from 'lottie-web'
import { Component, Vue } from 'nuxt-property-decorator'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'
@Component({
  layout: 'app',
  components: {
    SchedulesPresentation

  }
})

export default class Favorites extends Vue {
  mounted () {
    const animation = Lottie.loadAnimation({
      container: document.getElementById('bm') as Element,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('~/assets/lottie/156-star-blast.json')
    })
  }

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
