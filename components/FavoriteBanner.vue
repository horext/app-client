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

export default {
  name: 'FavoriteBanner',
  mounted () {
    Lottie.loadAnimation({
      container: document.getElementById('bm') as Element,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: require('~/assets/lottie/156-star-blast.json')
    })
  }
}
</script>
