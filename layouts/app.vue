<template>
  <v-app>
    <v-app-bar app absolute clipped-right flat height="72">
      <v-app-bar-nav-icon
        aria-label="Menu Iziquierdo"
        @click.stop="drawer = !drawer"
      />
      <v-row justify="center" align="center" no-gutters>
        <v-col cols="9" sm="8">
          <AppHourlyLoadInfo class="mx-0" />
        </v-col>
        <v-spacer />
        <v-col cols="3" sm="4">
          <ThemeDarkToggle />
        </v-col>
      </v-row>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app fixed left width="300">
      <v-card tile outlined height="70" width="100%">
        <v-card-title> Opciones </v-card-title>
      </v-card>

      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          link
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-bottom-navigation
      v-if="$vuetify.breakpoint.smAndDown"
      app
      fixed
      color="primary"
      grow
    >
      <v-btn
        v-for="item in denseItems"
        :key="item.to"
        exact
        tag="div"
        :to="item.to"
      >
        <div>
          {{ item.title }}
        </div>

        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <the-snackbar />
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import TheSnackbar from '~/components/base/TheSnackbar.vue'
import AppHourlyLoadInfo from '~/components/app/HourlyLoadInfo.vue'
import ThemeDarkToggle from '~/components/ThemeDarkToggle.vue'
import { useVuetify } from '~/composables/vuetify'

export default defineComponent({
  components: {
    ThemeDarkToggle,
    AppHourlyLoadInfo,
    TheSnackbar
  },
  setup () {
    const vuetify = useVuetify()
    onMounted(() => {
      vuetify.theme.dark = JSON.parse(
        localStorage.getItem('darkMode') || 'false'
      )
    })

    const drawer = ref(true)
    const dialog = ref(true)
    const items = [
      {
        title: 'Inicio',
        icon: 'mdi-calendar',
        to: '/'
      },
      {
        title: 'Generador de Horarios',
        icon: 'mdi-calendar',
        to: '/generator'
      },
      {
        title: 'Horarios Favoritos',
        icon: 'mdi-calendar-star',
        to: '/generator/favorites'
      },
      {
        title: 'Mis cursos y secciones',
        icon: 'mdi-book',
        to: '/generator/subjects'
      },
      {
        title: 'Mis eventos',
        icon: 'mdi-calendar-plus',
        to: '/generator/events'
      },
      {
        title: 'Avanzado',
        icon: 'mdi-cog',
        to: '/generator/settings'
      }
    ]

    const denseItems = [
      {
        title: 'Generador',
        icon: 'mdi-calendar',
        to: '/generator'
      },
      {
        title: 'Favoritos',
        icon: 'mdi-calendar-star',
        to: '/generator/favorites'
      },
      {
        title: 'Mis cursos',
        icon: 'mdi-book',
        to: '/generator/subjects'
      },
      {
        title: 'Mis eventos',
        icon: 'mdi-calendar-plus',
        to: '/generator/events'
      }
    ]

    return {
      items,
      drawer,
      dialog,
      denseItems
    }
  }
})
</script>
