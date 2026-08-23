<template>
  <v-app-bar flat height="64" class="app-bar border-b px-2">
    <template #prepend>
      <div class="d-flex align-center ga-2">
        <v-app-bar-nav-icon
          aria-label="Menu Izquierdo"
          density="comfortable"
          variant="text"
          @click.stop="toggleDrawer"
        />
        <AppHourlyLoadInfo :hourly-load="hourlyLoad" class="pa-0" />
      </div>
    </template>

    <template #title>
      <nuxt-link
        to="/"
        class="app-bar__brand d-flex align-center justify-center text-decoration-none text-reset cursor-pointer"
        title="Ir al inicio"
      >
        <vuetify-logo
          style="max-width: 32px; height: 32px"
          class="mr-2 app-bar__logo"
        />
        <span
          class="text-h5 font-weight-black tracking-tight text-primary"
          style="font-weight: 800 !important"
          >Horext</span
        >
      </nuxt-link>
    </template>

    <template #append>
      <div class="d-flex align-center pr-2">
        <ThemeDarkToggle v-model:dark-mode="darkMode" />
      </div>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import AppHourlyLoadInfo from '~/components/app/BarHourlyLoadInfo.vue'
import ThemeDarkToggle from '~/components/app/ThemeDarkToggle.vue'
import type { IHourlyLoad } from '~/interfaces/houly-load'

defineProps<{
  hourlyLoad?: IHourlyLoad
}>()
const drawer = defineModel<boolean>('drawer', { required: true })
const darkMode = defineModel<boolean>('darkMode', { required: true })

const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>

<style scoped>
.app-bar {
  position: relative;
  transition: all 0.2s ease-in-out;
}

.app-bar__brand {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
  user-select: none;
}

.app-bar__brand:hover {
  opacity: 0.85;
  transform: translate(-50%, -50%) scale(1.04);
}

.app-bar__logo {
  transition: transform 0.3s ease;
}

.app-bar__brand:hover .app-bar__logo {
  transform: rotate(-5deg);
}
</style>
