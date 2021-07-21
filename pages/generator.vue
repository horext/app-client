<template>
  <schedules-presentation
    color="blue"
    title="Horarios Generados"
    empty-message="Usted no tiene horarios generados"
    :schedules="schedules"
    :dialog.sync="openMySchedules"
    path="/beta/schedules"
  >
    <template #top-items-right>
      <v-toolbar-title>
        Horarios generados
      </v-toolbar-title>

      <v-btn plain class="ml-2" outlined fab small>
        {{ schedules.length }}
      </v-btn>
    </template>
    <template #top-items-left="{item}">
      <schedule-favorite-add :favorites-schedules.sync="myFavoriteSchedules" :schedule="item" />
    </template>
    <template #subtitle-items>
      <v-btn
        color="success"
        dark
        rounded
        shaped
        class="ma-1 "
        @click="generateAllUserSchedules"
      >
        <v-icon>mdi-update</v-icon>
        Generar
      </v-btn>
    </template>

    <template #emptyBody>
      <v-container>
        <v-alert
          prominent
          type="error"
        >
          <v-row align="center">
            <v-col class="grow">
              Lo sentimos, no hemos encontrados horarios :(
            </v-col>
          </v-row>
        </v-alert>
        <occurrences-list :items="occurrences" />
      </v-container>
    </template>
  </schedules-presentation>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { generate } from '~/utils/core'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'
@Component({
  components: {
    SchedulesPresentation
  },
  layout: 'app',
  head: {
    script: [
      { src: 'https://apis.google.com/js/api.js', crossorigin: true }
    ]
  }
})
export default class Generator extends Vue {
  occurrences: Array<any> = []
  openMySchedules = false

  dialogShare = false;
  dialogExport = false;

  get myCourses () {
    return this.$store.state.modules.MyData.myCourses
  }

  get schedules () {
    return this.$store.state.modules.MyData.mySchedules
  }

  get myEvents () {
    return this.$store.state.modules.MyData.myEvents
  }

  set schedules (newValue) {
    this.$store.commit('modules/MyData/setMySchedules', newValue)
  }

  get myFavoriteSchedules () {
    return this.$store.state.modules.MyData.myFavoritesSchedules
  }

  set myFavoriteSchedules (schedules: Array<any>) {
    this.$store.commit('modules/MyData/setMyFavoritesSchedules', schedules)
  }

  generateAllUserSchedules () {
    const { schedules, ocurrences } = generate(this.myCourses, this.myEvents, 0, false)
    this.schedules = schedules
    this.occurrences = ocurrences
  }
}
</script>

<style scoped>

</style>
