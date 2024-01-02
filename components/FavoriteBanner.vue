<template>
  <v-row>
    <v-col cols="12" class="text-h4 text-center">
      Agrega tus horarios favoritos
    </v-col>
    <v-col id="bm" cols="12" />
  </v-row>
</template>
<script lang="ts">
import Lottie from 'lottie-web'
import { defineComponent } from 'vue'
import Animation from '~/assets/lottie/156-star-blast.json'
export default defineComponent({
  name: 'FavoriteBanner',
  mounted() {
    Lottie.loadAnimation({
      container: document.getElementById('bm')!,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: Animation,
    })
  },
})
</script>
