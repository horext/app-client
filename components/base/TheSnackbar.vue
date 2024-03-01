<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout">
    {{ message }}
    <template #actions>
      <v-btn variant="text" @click="show = false"> Cerrar </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setupSnackbar } from '~/composables/snackbar'
export default defineComponent({
  name: 'TheSnackbar',
  setup: setupSnackbar,
})
</script>
