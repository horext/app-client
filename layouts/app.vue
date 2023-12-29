<template>
  <v-layout>
    <v-app-bar flat height="72">
      <template #prepend>
        <v-app-bar-nav-icon
          aria-label="Menu Iziquierdo"
          @click.stop="drawer = !drawer"
        />
      </template>

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
    <v-navigation-drawer v-model="drawer" left width="300">
      <v-card rounded="0" variant="outlined" height="70" width="100%">
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
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-bottom-navigation v-if="$vuetify.display.smAndDown" color="primary" grow>
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
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useTheme } from 'vuetify'
import TheSnackbar from '~/components/base/TheSnackbar.vue'
import AppHourlyLoadInfo from '~/components/app/HourlyLoadInfo.vue'
import ThemeDarkToggle from '~/components/ThemeDarkToggle.vue'

export default defineComponent({
  name: 'AppLayout',
  components: {
    ThemeDarkToggle,
    AppHourlyLoadInfo,
    TheSnackbar,
  },
  setup() {
    const theme = useTheme()
    onMounted(() => {
      theme.global.name.value = JSON.parse(
        localStorage.getItem('darkMode') || 'false'
      )
        ? 'dark'
        : 'light'
    })

    const drawer = ref(true)
    const dialog = ref(true)
    const items = [
      {
        title: 'Inicio',
        icon: 'mdi-calendar',
        to: '/',
      },
      {
        title: 'Generador de Horarios',
        icon: 'mdi-calendar',
        to: '/generator',
      },
      {
        title: 'Horarios Favoritos',
        icon: 'mdi-calendar-star',
        to: '/generator/favorites',
      },
      {
        title: 'Mis cursos y secciones',
        icon: 'mdi-book',
        to: '/generator/subjects',
      },
      {
        title: 'Mis actividades',
        icon: 'mdi-calendar-plus',
        to: '/generator/events',
      },
      {
        title: 'Avanzado',
        icon: 'mdi-cog',
        to: '/generator/settings',
      },
    ]

    const denseItems = [
      {
        title: 'Generador',
        icon: 'mdi-calendar',
        to: '/generator',
      },
      {
        title: 'Favoritos',
        icon: 'mdi-calendar-star',
        to: '/generator/favorites',
      },
      {
        title: 'Mis cursos',
        icon: 'mdi-book',
        to: '/generator/subjects',
      },
      {
        title: 'Mis actividades',
        icon: 'mdi-calendar-plus',
        to: '/generator/events',
      },
    ]

    return {
      items,
      drawer,
      dialog,
      denseItems,
    }
  },
})
</script>
