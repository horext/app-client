<template>
  <div
    class="d-flex flex-column align-center justify-center py-6 px-4 text-center"
  >
    <div
      ref="bm"
      class="star-animation-container mb-2"
      style="width: 250px; height: 250px; max-width: 100%"
    />
    <h3 class="text-h5 font-weight-bold mb-2">Agrega tus horarios favoritos</h3>
    <p
      class="text-body-2 text-medium-emphasis max-w-md mb-5"
      style="max-width: 440px"
    >
      Guarda las mejores combinaciones de tu horario haciendo clic en la
      estrella para acceder rápidamente a ellos.
    </p>
    <v-btn
      to="/generator"
      color="primary"
      variant="flat"
      size="large"
      rounded="lg"
      class="font-weight-bold elevation-2 text-none"
    >
      Generador
    </v-btn>
  </div>
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

<style scoped>
.star-animation-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
