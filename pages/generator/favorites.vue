<template>
  <schedules-presentation
    color="warning"
    title="Horarios Favoritos"
    empty-message="Usted no tiene horarios favoritos"
    :schedules="schedules"
    path="/skd"
  >
    <template #top-items-right>
      <v-toolbar-title> Horarios favoritos </v-toolbar-title>
    </template>
    <template #top-items-left="{ item }">
      <schedule-favorite-add
        v-if="item"
        :favorites-schedules="schedules"
        :schedule="item"
        @update:favoritesSchedules="updateFavoritesSchedules"
      />
    </template>
    <template #emptyBody>
      <FavoriteBanner />
    </template>
  </schedules-presentation>
</template>

<script lang="ts">
import { useStore } from '@nuxtjs/composition-api'
import { computed, defineComponent } from 'vue'
import FavoriteBanner from '~/components/FavoriteBanner.vue'

export default defineComponent({
  components: { FavoriteBanner },
  setup () {
    const store = useStore<any>()
    const schedules = computed(
      () => store.state.user.config.favoritesSchedules
    )
    const updateFavoritesSchedules = (schedules: any) =>
      store.dispatch('user/config/updateFavoritesSchedules', schedules)
    return { schedules, updateFavoritesSchedules }
  }
})
</script>
