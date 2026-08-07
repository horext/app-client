<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <home-app-bar
    :is-logged-in="authStore.isLoggedIn"
    @click:invert-mode="invertMode"
  />
  <home-view>
    <slot />
  </home-view>
  <home-footer />
</template>

<script setup lang="ts">
import HomeAppBar from '../components/home/AppBar.vue'
import HomeView from '../components/home/View.vue'
import HomeFooter from '../components/home/Footer.vue'

const authStore = useUserAuthStore()

const settingsStore = useSettingsStore()

const invertMode = () => {
  settingsStore.toggleDarkMode()
}
</script>
