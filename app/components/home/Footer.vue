<template>
  <v-footer id="home-footer" class="py-6 border-t bg-background">
    <v-container>
      <div
        class="d-flex flex-wrap align-center justify-center justify-md-space-between ga-4"
      >
        <div class="d-flex flex-wrap align-center justify-center ga-4">
          <a
            v-for="s in social"
            :key="s.name"
            :href="s.link"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-link text-caption text-medium-emphasis font-weight-medium text-decoration-none"
          >
            {{ s.name }}
          </a>
        </div>
        <div class="d-flex flex-wrap align-center justify-center ga-4">
          <nuxt-link
            to="/security"
            class="footer-link text-caption text-medium-emphasis font-weight-medium text-decoration-none"
          >
            Seguridad
          </nuxt-link>
          <nuxt-link
            to="/terms"
            class="footer-link text-caption text-medium-emphasis font-weight-medium text-decoration-none"
          >
            Términos y Condiciones
          </nuxt-link>
          <nuxt-link
            to="/privacy"
            class="footer-link text-caption text-medium-emphasis font-weight-medium text-decoration-none"
          >
            Política de Privacidad
          </nuxt-link>
        </div>
      </div>
      <div class="text-center text-caption text-medium-emphasis mt-4">
        Copyright &copy; {{ new Date().getFullYear() }} Octatec &middot; Lenin
        Castro
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
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

<style scoped>
.footer-link {
  transition:
    opacity 0.2s ease,
    color 0.2s ease;
  color: inherit !important;
  user-select: none;
}

.footer-link:hover {
  opacity: 0.8;
  text-decoration: underline !important;
}

.footer-link:visited,
.footer-link:active,
.footer-link:focus {
  color: inherit !important;
  text-decoration: none !important;
}
</style>
