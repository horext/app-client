<template>
  <v-img
    :lazy-src="img('/material2.jpg', { width: 10, quality: 70 })"
    :src="img('/material2.jpg', { quality: 70 })"
    :srcset="material.srcset"
    :sizes="material.sizes"
    class="fill-height"
    cover
    gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
  >
    <v-container class="fill-height">
      <v-row align="center" class="text-white mx-auto" justify="center">
        <v-col class="text-white text-center" cols="12">
          <h1>
            <span
              :class="[$vuetify.display.smAndDown ? 'display-1' : 'display-2']"
              class="font-weight-light"
            >
              Bienvenido a
            </span>
            <br />
            <span
              :class="[$vuetify.display.smAndDown ? 'display-3' : 'display-4']"
              class="font-weight-black"
            >
              Horext
            </span>
          </h1>
        </v-col>
        <v-col class="text-center" cols="12">
          <v-btn
            class="align-self-end"
            variant="outlined"
            theme="dark"
            to="/generator"
          >
            <v-icon start>mdi-chevron-double-right</v-icon>
            Generar mis horarios
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script setup lang="ts">
const img = useImage()

const material = computed(() =>
  img.getSizes('/material2.jpg', {
    sizes: [1920, 1280, 960, 600],
    modifiers: {
      format: 'webp',
      quality: 100,
    },
  }),
)
</script>
