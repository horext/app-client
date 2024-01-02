<template>
  <v-row no-gutters>
    <v-img
      :src="Material"
      gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
    >
      <v-container fill-height>
        <v-row align="center" class="text-white mx-auto" justify="center">
          <v-col class="text-white text-center" cols="12" tag="h1">
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
          </v-col>

          <v-btn
            class="align-self-end"
            variant="outlined"
            theme="dark"
            to="/generator"
          >
            <v-icon>mdi-chevron-double-right</v-icon>
            Generar mis horarios
          </v-btn>
        </v-row>
      </v-container>
    </v-img>
  </v-row>
</template>

<script setup lang="ts">
import Material from '~/assets/material2.jpg'
</script>
