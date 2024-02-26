<template>
  <v-row>
    <v-col cols="12" class="text-h4 text-center">
      Agrega tus horarios favoritos
    </v-col>
    <v-col ref="bm" cols="12" />
  </v-row>
</template>
<script setup lang="ts">
import Lottie from 'lottie-web'
import type { VCol } from 'vuetify/components'
import Animation from '~/assets/lottie/156-star-blast.json'

const bm = ref<ComponentPublicInstance  | null>(null)

onMounted(() => {
  Lottie.loadAnimation({
    container: bm.value?.$el,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    animationData: Animation,
  })
})
</script>
