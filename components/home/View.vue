<template>
  <v-main>
    <v-fade-transition mode="out-in">
      <nuxt />
    </v-fade-transition>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HomeView',
})
</script>
