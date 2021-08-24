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
      <schedule-favorite-add
        v-if="item"
        :favorites-schedules="schedules"
        :schedule="item"
        @update:favoritesSchedules="updateFavoritesSchedules"
      />
    </template>
    <template #emptyBody>
      <FavoriteBanner/>
    </template>
  </schedules-presentation>
</template>

<script lang="ts">
import Lottie from 'lottie-web'
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import FavoriteBanner from '~/components/FavoriteBanner.vue'
const userConfig = namespace('user/config')
@Component({
  components: { FavoriteBanner }
})
export default class Favorites extends Vue {

  @userConfig.State('favoritesSchedules')
  schedules!: Array<any>

  @userConfig.Action('updateFavoritesSchedules')
  updateFavoritesSchedules!: Function
}
</script>

