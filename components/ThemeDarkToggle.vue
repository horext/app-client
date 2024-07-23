<template>
  <v-tooltip location="bottom">
    <template #activator="{ props }">
      <v-sheet
        color="transparent"
        class="d-flex align-center justify-center"
        v-bind="props"
      >
        <div ref="darkModeEl" class="dark-toggle" @click="toggleDark" />
      </v-sheet>
    </template>
    <span>{{ darkMode ? 'Modo Claro' : 'Modo Oscuro' }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Animation from '~/assets/lottie/71569-hamster-toggle.json'

const props = defineProps<{
  darkMode: boolean
}>()

const emit = defineEmits<{
  (event: 'update:darkMode', value: boolean): void
}>()

const darkMode = useVModel(props, 'darkMode', emit)

const darkModeEl = ref<HTMLElement | null>(null)
const darkModeAnimation = useLottie(darkModeEl, {
  renderer: 'svg',
  loop: false,
  autoplay: false,
  animationData: Animation,
})
onMounted(() => {
  darkModeAnimation.value?.setSpeed(2)
  setAnimationDirection(darkMode.value)
})

onUnmounted(() => {
  darkModeAnimation.value?.destroy()
})

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
</script>
<style>
.dark-toggle {
  height: 64px;
  cursor: pointer;
}
</style>
