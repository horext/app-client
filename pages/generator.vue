<template>
  <div>
    <NuxtChild />
    <v-dialog v-if="firstEntry" v-model="firstEntry" max-width="600" persistent>
      <InitialSettings :dialog.sync="firstEntry" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import InitialSettings from '~/components/setting/Initial.vue'
@Component({
  components: { InitialSettings },
  layout: 'app'
})
export default class Generator extends Vue {
  @State(state => state.user.config.firstEntry)
  firstEntry!: any;

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
