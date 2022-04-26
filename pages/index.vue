<template>
  <div>
    <v-img
      :src="require('~/assets/material2.jpg')"
      max-height="350"
      gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
    >
      <v-container fill-height>
        <v-row align="center" class="white--text mx-auto" justify="center">
          <v-col class="white--text text-center" cols="12" tag="h1">
            <br>
            <span class="font-weight-black display-3 text-sm-display-4">
              Horext
            </span>
          </v-col>

          <v-btn class="align-self-end" outlined dark to="/generator">
            <v-icon>mdi-chevron-double-right</v-icon>
            Generar mis horarios
          </v-btn>
        </v-row>
      </v-container>
    </v-img>
    <v-container>
      <v-row
        no-gutters
        align="center"
        justify="center"
        class="fill-height mx-auto"
      >
        <v-col cols="12">
          <h2 class="text-center">
            Funcionalidades
          </h2>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card  class="text-center"  dark color="success" outlined>
            <v-card-title>
              <v-icon class="mx-auto text-h3">
                mdi-calendar-clock
              </v-icon>
            </v-card-title>
            <v-card-title class="text-center">
              Generar tus Horarios
            </v-card-title>
            <v-card-text>
              <p>Selecciona tus cursos y genera todos tus horarios posibles</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card height="200" outlined>
            <v-card-title>
              <h3 class="headline mb-0">
                <v-icon>mdi-account-multiple</v-icon>
                Usuarios
              </h3>
            </v-card-title>
            <v-card-text>
              <p>Administrar usuarios y roles.</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card height="200" outlined>
            <v-card-title>
              <h3 class="headline mb-0">
                <v-icon>mdi-account-multiple-plus</v-icon>
                Crear usuarios
              </h3>
            </v-card-title>
            <v-card-text>
              <p>Crear usuarios para administrar el sistema.</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  components: {}
}
</script>
<style>
</style>
