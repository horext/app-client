<template>
  <v-footer>
    <v-container>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-row justify-md="start" justify="center" dense>
            <v-col v-for="s in social" :key="s.name" cols="auto">
              <a class="px-5 py-4" :href="s.link" v-text="s.name" />
            </v-col>
          </v-row>
        </v-col>
        <v-col class="text-center text-md-right" cols="12" md="6">
          <v-row justify-md="end" justify="center" dense>
            <v-col cols="auto">
              <nuxt-link class="px-5 py-4" to="/security">
                Seguridad
              </nuxt-link>
            </v-col>
            <v-col cols="auto">
              <nuxt-link class="px-5 py-4" to="/terms">
                Términos y Condiciones
              </nuxt-link>
            </v-col>
            <v-col cols="auto">
              <nuxt-link class="px-5 py-4" to="/privacy">
                Politica de Privacidad
              </nuxt-link>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="text-center" cols="12">
          Copyright &copy; {{ new Date().getFullYear() }} Octatec
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup="ts">
const social = [
  {
    name: 'Facebook',
    link: 'https://www.facebook.com/OctatecOficial',
  },
  {
    name: 'Linkedin',
    link: 'https://www.linkedin.com/in/franz-antony-bendezu-isidro/',
  },
]
</script>

<style>
#home-footer a {
  text-decoration: none;
}
</style>
