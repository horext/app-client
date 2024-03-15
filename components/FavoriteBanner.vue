<template>
  <v-row>
    <v-col cols="12" class="text-h4 text-center">
      Agrega tus horarios favoritos
    </v-col>
    <v-col ref="bm" cols="12" />
  </v-row>
</template>
<script setup lang="ts">
import Animation from '~/assets/lottie/156-star-blast.json'

const bm = ref<ComponentPublicInstance | null>(null)

useLottie(bm, {
  renderer: 'svg',
  loop: false,
  autoplay: true,
  animationData: Animation,
})
</script>
