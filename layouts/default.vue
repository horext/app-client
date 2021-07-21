<template>
  <v-app>
    <!--    <home-system-bar />-->
    <home-app-bar />
    <home-view />
    <home-footer />
    <!--    <home-settings />-->
  </v-app>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import HomeAppBar from '~/components/home/AppBar.vue'
import HomeFooter from '~/components/home/Footer.vue'
import HomeView from '~/components/home/View.vue'
export default Vue.extend({
  components: {
    HomeAppBar,
    HomeFooter,
    HomeView
  },
  data () {
    return {
      listenersStarted: false,
      permissionGranted: false,
      idToken: '',
      loading: false
    }
  }

})
</script>
