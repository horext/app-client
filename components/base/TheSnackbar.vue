
<template>
  <v-snackbar
    v-model="show"
    :color="color"
    :timeout="timeout"
  >
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="show = false"
      >
        Cerrar
      </v-btn>
    </template>

  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
export default class TheSnackbar extends Vue {
  show =false
  message =''
  timeout: number = -1
  color =''

  created () {
    this.$store.subscribe((mutation: { type: string }, state: { modules: { snackbar: { content: string; color: string, timeout: number } } }) => {
      if (mutation.type === 'modules/snackbar/showMessage') {
        this.message = state.modules.snackbar.content
        this.color = state.modules.snackbar.color
        this.timeout = state.modules.snackbar.timeout
        this.show = true
      }
    })
  }
}
</script>
