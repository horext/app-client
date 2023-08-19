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
import { computed, defineComponent } from 'vue'
import FavoriteBanner from '~/components/FavoriteBanner.vue'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'
import ScheduleFavoriteAdd from '~/components/ScheduleFavoriteAdd.vue'
import { useUserConfigStore } from '~/stores/user-config'

export default defineComponent({
  components: { FavoriteBanner, SchedulesPresentation, ScheduleFavoriteAdd },
  setup () {
    const store = useUserConfigStore()
    const schedules = computed(() => store.favoritesSchedules)
    const updateFavoritesSchedules = (schedules: any) =>
      store.updateFavoritesSchedules(schedules)
    return { schedules, updateFavoritesSchedules }
  }
})
</script>
