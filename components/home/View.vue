<template>
  <v-main>
    <slot />
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
})
</script>
