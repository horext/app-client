<template>
  <v-app>
    <v-app-bar
      app
      absolute
      clipped-right
      flat
      height="72"
    >
      <v-app-bar-nav-icon
        aria-label="Menu Iziquierdo"
        @click.stop="drawer = !drawer"
      />
      <v-list-item v-if="hourlyLoad">
        <v-list-item-content>
          <v-list-item-subtitle>
            Ultima Actualización: {{ new Date(hourlyLoad.updatedAt).toLocaleString() }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-spacer />
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
      left
      width="300"
    >
      <v-card
        tile
        outlined
        height="70"

        width="100%"
      >
        <v-card-title>
          Opciones
        </v-card-title>
      </v-card>

      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          link
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
      <v-btn v-for="item in denseItems" :key="item.to" tag="div" :to="item.to">
        <div>
          {{ item.title }}
        </div>

        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <the-snackbar />
    <v-dialog v-if="firstEntry" v-model="firstEntry" max-width="600" persistent>
      <initial-settings :dialog.sync="firstEntry" />
    </v-dialog>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import TheSnackbar from '~/components/base/TheSnackbar.vue'
import InitialSettings from '~/components/InitialSettings.vue'

export default Vue.extend({
  components: {
    TheSnackbar,
    InitialSettings
  },
  data: () => ({
    firstEntry: false,
    drawerLeft: true,
    drawer: true,
    dialog: true,
    items: [
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
        to: '/favorites'
      },
      {
        title: 'Mis cursos y secciones',
        icon: 'mdi-book',
        to: '/courses'
      },
      {
        title: 'Mis events',
        icon: 'mdi-calendar-plus',
        to: '/events'
      }
    ],
    denseItems: [
      {
        title: 'Generador',
        icon: 'mdi-calendar',
        to: '/generator'
      },
      {
        title: 'Favoritos',
        icon: 'mdi-calendar-star',
        to: '/favorites'
      },
      {
        title: 'Mis cursos',
        icon: 'mdi-book',
        to: '/courses'
      },
      {
        title: 'Mis events',
        icon: 'mdi-calendar-plus',
        to: '/events'
      }
    ]
  }),
  computed: {
    hourlyLoad () {
      return this.$store.state.storage.myHourlyLoad || null
    }
  },
  mounted () {
    if (typeof (JSON.parse(localStorage.getItem('firstEntry') || 'null')) !== 'boolean') {
      localStorage.setItem('mySpeciality', 'null')
      localStorage.setItem('myFaculty', 'null')
      this.$storage.setState('myHourlyLoad', 'null')
      localStorage.setItem('firstEntry', 'true')
    }
    this.firstEntry = JSON.parse(localStorage.getItem('firstEntry') || 'null')
  }
})
</script>

<style scoped>

</style>
