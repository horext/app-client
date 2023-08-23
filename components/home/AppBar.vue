<template>
  <div>
    <v-app-bar id="home-app-bar" app elevation="1" height="64">
      <vuetify-logo style="max-width: 48px" />
      <v-toolbar-title class="title"> Horext </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="invertMode">
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>
      <template>
        <v-tabs class="hidden-sm-and-down" optional>
          <v-tab
            v-for="(item, i) in items"
            :key="i"
            :to="item.route"
            :ripple="false"
            active-class="text--primary"
            class="font-weight-bold"
            min-width="96"
            text
          >
            {{ item.name }}
          </v-tab>
        </v-tabs>
      </template>

      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />
    </v-app-bar>

    <home-drawer v-model="drawer" :items="items" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VuetifyLogo from '../VuetifyLogo.vue'
import HomeDrawer from '@/components/home/Drawer.vue'
export default Vue.extend({
  name: 'HomeAppBar',

  components: {
    VuetifyLogo,
    HomeDrawer,
  },
  data: () => ({
    drawer: null,
    items: [
      { name: 'Inicio', route: '/' },
      { name: 'Generador', route: '/generator' },
      { name: 'Acerca de ', route: '/about' },
    ],
  }),
  computed: {
    darkMode: {
      get(): boolean {
        return this.$vuetify.theme.dark
      },
      set(val: boolean) {
        this.$vuetify.theme.dark = val
      },
    },
  },
  watch: {
    darkMode(newVal) {
      localStorage.setItem('darkMode', JSON.stringify(newVal))
    },
  },
  mounted() {
    this.darkMode = JSON.parse(localStorage.getItem('darkMode') || 'false')
  },
  methods: {
    invertMode() {
      this.darkMode = !this.darkMode
    },
  },
})
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
