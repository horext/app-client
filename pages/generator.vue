<template>
  <schedules-presentation
    color="blue"
    title="Generados"
    empty-message="Usted no tiene horarios generados"
    :schedules="schedules"
    :dialog.sync="openMySchedules"
    path="/skd"
  >
    <template #top-items-right>
      <v-toolbar-title>
        Generados
      </v-toolbar-title>

      <v-btn plain class="ml-2" outlined fab small>
        {{ schedules.length }}
      </v-btn>
    </template>
    <template #top-items-left="{item}">
      <schedule-favorite-add :favorites-schedules.sync="myFavoriteSchedules" :schedule="item" />
    </template>
    <template #subtitle-items>
      <v-text-field
        v-model="crossingSubjects"
        label="Cantidad de cruces"
        hide-details
        outlined
        dense
        max="5"
        min="0"
        class="shrink"
        type="number"
      />

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
import { getSchedules } from '~/utils/core'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'
@Component({
  components: {
    SchedulesPresentation
  },
  layout: 'app'
})
export default class Generator extends Vue {
  occurrences: Array<any> = []
  openMySchedules = false

  crossingSubjects = 0;
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
    const { occurrences, combinations } = getSchedules(this.myCourses, this.myEvents, {
      crossingSubjects: this.crossingSubjects
    })
    this.schedules = combinations
    this.occurrences = occurrences
  }
}
</script>

<style scoped>

</style>
