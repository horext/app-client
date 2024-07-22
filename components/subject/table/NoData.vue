<template>
  <v-row align="center">
    <v-col cols="12" md="6">
      <div class="text-md-h2 text-h4 text-left">
        Busca tus cursos en la parte superior y luego ve al
        <nuxt-link to="/generator"> generador </nuxt-link>
      </div>
    </v-col>
    <v-col cols="12" md="6">
      <v-responsive>
        <div ref="noDataElement" />
      </v-responsive>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import Animation from '~/assets/lottie/15538-cat-woow.json'
const noDataElement = ref<HTMLElement | null>(null)
useLottie(noDataElement, {
  renderer: 'svg',
  loop: true,
  autoplay: true,
  animationData: Animation,
})
</script>
