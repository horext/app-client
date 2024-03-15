<template>
  <v-sheet color="transparent" class="d-flex align-center justify-center">
    <div ref="darkModeEl" class="dark-toggle" @click="toggleDark" />
  </v-sheet>
</template>
<script lang="ts">
import { onMounted, ref, watch, defineComponent } from 'vue'
import Animation from '~/assets/lottie/71569-hamster-toggle.json'

export default defineComponent({
  setup() {
    const settingsStore = useSettingsStore()
    const darkModeEl = ref<HTMLElement | null>(null)
    const darkModeAnimation = useLottie(darkModeEl, {
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: Animation,
    })
    onMounted(() => {
      darkModeAnimation.value?.setSpeed(2)
      setAnimationDirection(settingsStore.darkMode)
    })

    onUnmounted(() => {
      darkModeAnimation.value?.destroy()
    })

    const { darkMode } = storeToRefs(settingsStore)

    const toggleDark = () => {
      darkMode.value = !darkMode.value
    }

    const setAnimationDirection = (darkMode: boolean) => {
      if (darkMode) {
        darkModeAnimation.value!.setDirection(1)
      } else {
        darkModeAnimation.value!.setDirection(-1)
      }
      darkModeAnimation.value!.play()
    }

    watch(darkMode, setAnimationDirection)
    return {
      toggleDark,
      darkModeEl,
      darkModeAnimation,
      darkMode,
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
