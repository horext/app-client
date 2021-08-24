<template>
  <v-sheet color="transparent">
    <div id="darkMode" class="dark-toggle" @click="toggleDark" />
  </v-sheet>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import Lottie, { AnimationItem } from 'lottie-web'

@Component
export default class App extends Vue {
  darkToggle: AnimationItem

  mounted () {
    this.darkToggle = Lottie.loadAnimation({
      container: document.getElementById('darkMode') as Element,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: require('~/assets/lottie/71569-hamster-toggle.json')
    })
    this.darkToggle.setSpeed(2)
  }

  toggleDark () {
    this.dark = !this.dark
  }

  get dark () {
    return this.$vuetify.theme.dark
  }

  set dark (val: boolean) {
    this.$vuetify.theme.dark = val
  }

  @Watch('dark')
  darkMode (newVal) {
    if (!newVal) {
      this.darkToggle.setDirection(1)
      this.darkToggle.play()
    } else {
      this.darkToggle.setDirection(-1)
      this.darkToggle.play()
    }
    localStorage.setItem('darkMode', JSON.stringify(newVal))
  }
}
</script>
<style>
.dark-toggle {
  height: 64px;
  cursor: pointer;
}
</style>
