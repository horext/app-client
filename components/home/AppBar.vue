<template>
  <v-app-bar id="home-app-bar" elevation="1" height="64">
    <vuetify-logo style="max-width: 48px" />
    <v-toolbar-title class="text-h6"> Horext </v-toolbar-title>
    <v-spacer />
    <v-btn icon @click="invertMode">
      <v-icon>mdi-brightness-6</v-icon>
    </v-btn>
    <v-tabs class="hidden-sm-and-down" optional>
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

    <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />
  </v-app-bar>

  <home-drawer v-model="drawer" :items="items" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VuetifyLogo from '../VuetifyLogo.vue'
import HomeDrawer from '@/components/home/Drawer.vue'

export default defineComponent({
  name: 'HomeAppBar',

  components: {
    VuetifyLogo,
    HomeDrawer,
  },
  setup() {
    const theme = useTheme()

    const darkMode = computed({
      get() {
        return theme.global.current.value.dark
      },

      set(val: boolean) {
        theme.global.name.value = val ? 'dark' : 'light'
      },
    })
    const drawer = ref(false)

    return { darkMode, drawer }
  },
  data: () => ({
    items: [
      { name: 'Inicio', route: '/' },
      { name: 'Generador', route: '/generator' },
      { name: 'Acerca de ', route: '/about' },
    ],
  }),
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
