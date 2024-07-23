<template>
  <div ref="animationEl" />
</template>

<script setup lang="ts" generic="T extends RendererType = 'svg'">
import type { RendererType } from 'lottie-web'
import { ref } from 'vue'
import type { LottieOptions } from '~/composables/lottie'

withDefaults(defineProps<LottieOptions<T>>(), {
  renderer:() => 'svg' as T,
  loop: () => true,
})

defineOptions({
  name: 'LottieRender',
})
const animationEl = ref<HTMLElement | null>(null)
useLottie(animationEl, {
  renderer: 'svg',
  loop: true,
  autoplay: true,
  animationData: Animation,
})
</script>
