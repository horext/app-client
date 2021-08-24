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
      <schedule-favorite-add
        :favorites-schedules="myFavoritesSchedules"
        :schedule="item"
        @update:favoritesSchedules="updateFavoritesSchedules"
      />
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
import { Component, namespace, State, Vue } from 'nuxt-property-decorator'
import { getSchedules } from '~/utils/core'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'
import ScheduleFavoriteAdd from '~/components/ScheduleFavoriteAdd.vue'
const userConfig = namespace('user/config')
const userEvents = namespace('user/events')

@Component({
  components: {
    ScheduleFavoriteAdd,
    SchedulesPresentation
  },
  layout: 'app'
})
export default class Generator extends Vue {
  occurrences: Array<any> = []
  openMySchedules = false;

  crossingSubjects = 0;

  @State(state => state.user.config.subjects)
  mySubjects!: Array<any>;

  @userEvents.State('items')
  myEvents!: Array<any>;

  @State(state => state.user.config.favoritesSchedules)
  myFavoritesSchedules!: Array<any>;

  @userConfig.Action('updateFavoritesSchedules')
  updateFavoritesSchedules!: Function

  @State(state => state.user.config.schedules)
  schedules!: Array<any>;

  @userConfig.Action('updateSchedules')
  updateSchedules!: Function

  generateAllUserSchedules () {
    const { occurrences, combinations } = getSchedules(this.mySubjects, this.myEvents, {
      crossingSubjects: this.crossingSubjects
    })
    this.updateSchedules(combinations)
    this.occurrences = occurrences
  }
}
</script>

<style scoped>

</style>
