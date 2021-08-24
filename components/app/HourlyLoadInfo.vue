<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-subtitle>
        Actualizado: {{ new Date(hourlyLoad.updatedAt).toLocaleString() }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator'

@Component
export default class AppHourlyLoadInfo extends Vue {
  @State(state => state.user.config.hourlyLoad)
  hourlyLoad!: any;
}
</script>
