<template>
  <v-layout>
    <!--    <home-system-bar />-->
    <home-app-bar />
    <home-view>
      <slot />
    </home-view>
    <home-footer />
    <!--    <home-settings />-->
  </v-layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import HomeAppBar from '~/components/home/AppBar.vue'
import HomeFooter from '~/components/home/Footer.vue'
import HomeView from '~/components/home/View.vue'
export default defineComponent({
  components: {
    HomeAppBar,
    HomeFooter,
    HomeView,
  },
  data() {
    return {
      listenersStarted: false,
      permissionGranted: false,
      idToken: '',
      loading: false,
    }
  },
})
</script>
