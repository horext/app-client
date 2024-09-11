<template>
  <v-app-bar id="home-app-bar" elevation="1" height="64">
    <vuetify-logo style="max-width: 48px" />
    <v-toolbar-title class="text-h6"> Horext </v-toolbar-title>
    <v-spacer />
    <v-btn icon aria-label="Cambiar modo" @click="invertMode">
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

const settingsStore = useSettingsStore()

const drawer = ref(false)

const display = useDisplay()

const isMobile = computed(() => display.mobile.value)

const items = [
  { name: 'Inicio', route: '/' },
  { name: 'Generador', route: '/generator' },
  { name: 'Acerca de ', route: '/about' },
]

const invertMode = () => {
  settingsStore.toggleDarkMode()
}
</script>

<style scoped lang="sass">
#home-app-bar
  .v-tabs
    flex: 0 auto
    width: fit-content

  .v-tabs-slider
    max-width: 24px
    margin: 0 auto

  .v-tab
    width: fit-content
    &::before
      display: none
</style>
