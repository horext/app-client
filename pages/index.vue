<template>
  <v-img
    :lazy-src="img('/material2.jpg', { width: 10, quality: 70 })"
    :src="img('/material2.jpg', { quality: 70 })"
    :srcset="material.srcset"
    :sizes="material.sizes"
    class="fill-height responsive-img"
    cover
    alt="Cover background"
    gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
  >
    <v-container class="fill-height">
      <v-row align="center" class="text-white mx-auto" justify="center">
        <v-col class="text-white text-center" cols="12">
          <h1>
            <span
              class="font-weight-light text-h5 text-md-4 text-lg-h3"
            >
              Bienvenido a
            </span>
            <br />
            <span
              class="font-weight-black text-h6 text-md-3 text-lg-h2"
            >
              Horext
            </span>
          </h1>
        </v-col>
        <v-col class="text-center" cols="12">
          <v-btn
            class="align-self-end font-weight-bold"
            variant="outlined"
            theme="dark"
            to="/generator"
          >
            <v-icon start>
              {{ mdiChevronDoubleRight }}
            </v-icon>
            Generar mis horarios
          </v-btn>
        </v-col>
        <v-col class="text-center" cols="12">
          <v-btn
            class="align-self-end font-weight-bold"
            variant="outlined"
            theme="dark"
            to="/login"
          >
            <v-icon start>
              {{ mdiChevronDoubleRight }}
            </v-icon>
            Iniciar sesión (próximamente)
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script setup lang="ts">
import { mdiChevronDoubleRight } from '@mdi/js'
const img = useImage()
useSeoMeta({
  title: 'Inicio',
})
const material = computed(() =>
  img.getSizes('/material2.jpg', {
    sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw',
    modifiers: {
      format: 'webp',
      quality: 100,
    },
  }),
)
</script>

<style scoped>
@media (max-width: 640px) {
  .responsive-img {
    height: 90vh !important;
  }
}

@media (max-width: 768px) {
  .responsive-img {
    height: 75vh !important;
  }
}

@media (max-width: 1024px) {
  .responsive-img {
    height: 75vh !important;
  }
}

@media (max-width: 1280px) {
  .responsive-img {
    height: 75vh !important;
  }
}

.responsive-img {
  height: 85vh !important;
}
</style>
