<template>
  <div>
    <NuxtChild />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
@Component({
  layout: 'app'
})
export default class Generator extends Vue {
  async asyncData ({ store }: Context) {
    await store.dispatch('user/config/fetchFirstEntry')
    await store.dispatch('user/config/fetchFaculty')
    await store.dispatch('user/config/fetchSpeciality')
    await store.dispatch('user/config/fetchHourlyLoad')
  }

  async mounted () {
    await this.$store.dispatch('user/config/fetchSubjects')
    await this.$store.dispatch('user/config/fetchSchedules')
    await this.$store.dispatch('user/config/fetchFavoritesSchedules')
    await this.$store.dispatch('user/events/fetchItems')
  }
}
</script>

<style scoped>

</style>
