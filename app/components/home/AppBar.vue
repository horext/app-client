<template>
  <v-app-bar id="home-app-bar" elevation="1" height="64" class="px-2">
    <nuxt-link
      to="/"
      class="home-brand d-flex align-center text-decoration-none text-reset ml-2 cursor-pointer"
      title="Ir al inicio"
    >
      <vuetify-logo
        style="max-width: 32px; height: 32px"
        class="mr-2 home-brand__logo"
      />
      <span
        class="text-h5 font-weight-black tracking-tight text-primary"
        style="font-weight: 800 !important"
        >Horext</span
      >
    </nuxt-link>
    <v-spacer />
    <v-btn
      icon
      aria-label="Cambiar modo"
      @click="emit('click:invert-mode', $event)"
    >
      <v-icon>{{ mdiBrightness6 }}</v-icon>
    </v-btn>
    <v-tabs class="hidden-sm-and-down">
      <v-tab
        v-for="(item, i) in items"
        :key="i"
        :to="item.route"
        :ripple="false"
        selected-class="text--primary"
        class="font-weight-bold"
        min-width="96"
        variant="text"
      >
        {{ item.name }}
      </v-tab>
    </v-tabs>

    <v-btn
      v-if="!isLoggedIn"
      color="primary"
      variant="flat"
      rounded="lg"
      size="small"
      class="mr-2 font-weight-bold"
      to="/login"
    >
      Iniciar sesión
    </v-btn>
    <v-app-bar-nav-icon
      class="hidden-md-and-up"
      aria-label="Menu Iziquierdo"
      @click="drawer = !drawer"
    />
  </v-app-bar>

  <lazy-home-drawer v-if="isMobile" v-model="drawer" :items="items" />
</template>

<script setup lang="ts">
import VuetifyLogo from '../VuetifyLogo.vue'
import { mdiBrightness6 } from '@mdi/js'

defineProps<{
  isLoggedIn: boolean
}>()

const emit = defineEmits<{
  (e: 'click:invert-mode', event: MouseEvent): void
}>()

const drawer = ref(false)

const display = useDisplay()

const isMobile = computed(() => display.mobile.value)

const items = [
  { name: 'Inicio', route: '/' },
  { name: 'Generador', route: '/generator' },
  { name: 'Acerca de ', route: '/about' },
]
</script>

<style scoped>
.home-brand {
  user-select: none;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
  color: inherit !important;
}

.home-brand:hover {
  opacity: 0.85;
  transform: scale(1.03);
}

.home-brand:visited,
.home-brand:active,
.home-brand:focus {
  color: inherit !important;
  text-decoration: none !important;
}

.home-brand__logo {
  transition: transform 0.3s ease;
}

.home-brand:hover .home-brand__logo {
  transform: rotate(-5deg);
}
</style>
