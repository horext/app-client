<template>
  <v-card>
    <v-card-title>
      <span class="headline">Bienvenido</span>
      <v-spacer />
      <v-btn text @click="close">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-btn
              fab
              outlined
              color="yellow"
              small
            >
              <v-icon color="yellow"> mdi-star</v-icon>
            </v-btn>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span>Añadir a favoritos</span>
            </v-list-item-title>
            <v-list-item-subtitle>
              Guarda tus horarios preferidos.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item three-line>
          <v-list-item-action>
            <v-btn
              color="blue darken-2"
              dark
              fab
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <span>Opciones</span>
            </v-list-item-title>
            <v-list-item-subtitle>
              Presiona el botón para desplegar las siguientes opciones:
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar>
            <v-btn
              fab
              dark
              small
              color="green"
            >
              <v-icon> mdi-update</v-icon>
            </v-btn>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span>Actualizar</span>
            </v-list-item-title>
            <v-list-item-subtitle>
              Genera nuevos horarios manualmente.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar>
            <v-btn
              fab
              dark
              small
              color="indigo"
            >
              <v-icon> mdi-share-variant</v-icon>
            </v-btn>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span>Compartir</span>
            </v-list-item-title>
            <v-list-item-subtitle>
              Comparte el enlace tu horario preferido a tus amigos!
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item three-line>
          <v-list-item-avatar>
            <v-btn
              fab
              dark
              small
              color="pink"
            >
              <v-icon>mdi-calendar-export</v-icon>
            </v-btn>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span>Exportar</span>
            </v-list-item-title>
            <v-list-item-subtitle>
              Ya tienes tu horario, exportalo a tu calendario a Gcalendar o descargala como imagen o PDF.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-checkbox
        v-model="showWelcomeSync"
        label="No volver a mostrar mensaje"
        color="info"
      />
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { Component, PropSync, Vue } from 'nuxt-property-decorator'

  @Component({
    name: 'SchedulesWelcome'
  })
export default class SchedulesWelcome extends Vue {
  close () {
    this.$emit('close')
  }

    @PropSync('showWelcome', { type: Boolean }) showWelcomeSync!: boolean;
}
</script>
