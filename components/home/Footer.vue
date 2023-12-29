<template>
  <v-footer id="home-footer" >
    <v-container>
      <v-row dense>
        <v-col cols="12" md="6">
          <div
            class="d-flex flex-wrap justify-md-start justify-center justify-md-none"
          >
            <template v-for="(s, i) in social" :key="s.name">
              <a class="pa-1 pa-md-0" :href="s.link" v-text="s.name" />

              <v-responsive
                v-if="i < social.length - 1"
                class="mx-4 shrink hidden-sm-and-down"
                max-height="16"
              >
                <v-divider vertical />
              </v-responsive>
            </template>
          </div>
        </v-col>
        <v-col class="text-center text-md-right" cols="12" md="6">
          <v-row justify-md="end" justify="center" dense>
            <v-col cols="auto">
              <nuxt-link to="/security"> Seguridad </nuxt-link>
            </v-col>
            <v-col cols="auto">
              <nuxt-link to="/terms"> Términos y Condiciones </nuxt-link>
            </v-col>
            <v-col cols="auto">
              <nuxt-link to="/privacy"> Politica de Privacidad </nuxt-link>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="text-center" cols="12">
          Copyright &copy; 2021 Octatec
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeFooter',
  data: () => ({
    social: [
      {
        name: 'Facebook',
        link: 'https://www.facebook.com/OctatecOficial',
      },
      {
        name: 'Linkedin',
        link: 'https://www.linkedin.com/in/franz-antony-bendezu-isidro/',
      },
    ],
  }),
})
</script>

<style>
#home-footer a {
  text-decoration: none;
}
</style>
