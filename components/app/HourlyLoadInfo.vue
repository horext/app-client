<template>
  <v-list-item three-line dense>
    <v-list-item-content v-if="hourlyLoad">
      {{ name }}
      <v-list-item-subtitle>
        Ult. Actual.: {{ new Date(updatedAt).toLocaleString() }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-content v-else>
      <v-list-item-subtitle> Sin carga horaria. </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator'

@Component
export default class AppHourlyLoadInfo extends Vue {
  @State(state => state.user.config.hourlyLoad)
  hourlyLoad!: any;

  get updatedAt () {
    return this.hourlyLoad?.updatedAt
  }

  get name () {
    return this.hourlyLoad?.name
  }
}
</script>
