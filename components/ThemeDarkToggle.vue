<template>
  <v-sheet color="transparent">
    <div id="darkMode" class="dark-toggle" @click="toggleDark" />
  </v-sheet>
</template>
<script lang="ts">
import { useTheme } from 'vuetify'
import { computed, onMounted, ref, watch, defineComponent } from 'vue'
import Lottie, { type AnimationItem } from 'lottie-web'
import Animation from '~/assets/lottie/71569-hamster-toggle.json'

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
        animationData: Animation,
      })
      darkMode.value.setSpeed(2)
    })

    const theme = useTheme()

    const dark = computed({
      get() {
        return theme.global.current.value.dark
      },

      set(val: boolean) {
        theme.global.name.value = val ? 'dark' : 'light'
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
