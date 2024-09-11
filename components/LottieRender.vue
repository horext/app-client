<template>
  <div ref="animationEl" />
</template>

<script setup lang="ts" generic="T extends RendererType = 'svg'">
import type { RendererType } from 'lottie-web'
import { ref } from 'vue'
import type { LottieOptions } from '~/composables/lottie'

defineOptions({
  name: 'LottieRender',
})

const props = withDefaults(defineProps<LottieOptions<T>>(), {
  renderer: () => 'svg' as T,
})

const animationEl = ref<HTMLElement | null>(null)
useLottie(animationEl, props)
</script>
