<template>
  <v-main>
    <v-fade-transition mode="out-in">
      <slot></slot>
    </v-fade-transition>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
})
</script>
