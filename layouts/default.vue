<template>
  <!--    <home-system-bar />-->
  <home-app-bar />
  <home-view>
    <slot />
  </home-view>
  <home-footer />
</template>
<script setup lang="ts">
import HomeAppBar from '~/components/home/AppBar.vue'
import HomeFooter from '~/components/home/Footer.vue'
import HomeView from '~/components/home/View.vue'
</script>
