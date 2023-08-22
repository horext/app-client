<template>
  <v-sheet color="transparent">
    <div id="darkMode" class="dark-toggle" @click="toggleDark" />
  </v-sheet>
</template>
<script lang="ts">
import { computed, onMounted, ref, watch, defineComponent } from 'vue'
import Lottie, { AnimationItem } from 'lottie-web'
import { useVuetify } from '~/composables/vuetify'

export default defineComponent({
  setup() {
    const darkMode = ref<AnimationItem>()

    onMounted(() => {
      const darkModeEl = document.getElementById('darkMode')
      darkMode.value = Lottie.loadAnimation({
        container: darkModeEl!,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require('~/assets/lottie/71569-hamster-toggle.json'),
      })
      darkMode.value.setSpeed(2)
    })

    const vuetify = useVuetify()

    const dark = computed({
      get() {
        return vuetify.theme.dark
      },

      set(val: boolean) {
        vuetify.theme.dark = val
      },
    })

    const toggleDark = () => {
      dark.value = !dark.value
    }

    watch(dark, (newVal) => {
      if (!newVal) {
        darkMode.value!.setDirection(1)
        darkMode.value!.play()
      } else {
        darkMode.value!.setDirection(-1)
        darkMode.value!.play()
      }
      localStorage.setItem('darkMode', JSON.stringify(newVal))
    })

    return {
      dark,
      toggleDark,
    }
  },
})
</script>
<style>
.dark-toggle {
  height: 64px;
  cursor: pointer;
}
</style>
