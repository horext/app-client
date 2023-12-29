<template>
  <v-container class="text-center">
    <h2 class="text-h3 font-weight-bold mb-3">ACERCA DE</h2>

    <v-responsive class="mx-auto mb-8" width="56">
      <v-divider class="mb-1" />

      <v-divider />
    </v-responsive>

    <v-responsive class="mx-auto text-h6 font-weight-light mb-8" max-width="720">
      Horext es una aplicación web que se encarga de gestionar los horarios de
      tus curso, para asi generar todos los posibles horarios.
    </v-responsive>
    <v-row align="center" align-content="center" justify="center">
      <v-col align-self="center">
        <v-avatar class="elevation-2 mb-4" size="128">
          <v-img src="/octatec-logo.png" />
        </v-avatar>
        <p class="text-h6 text-center">Octatec</p>
        <p class="text-subtitle-1 text-center">Email: octatec.pe@gmail.com</p>
      </v-col>
      <v-col>
        <v-avatar class="elevation-2 mb-4" size="128">
          <v-img src="/me.jpeg" />
        </v-avatar>
        <p class="text-h6 text-center">Franz A. Bendezu Isidro</p>
        <p class="text-subtitle-1 text-center">Email: fbendezui@uni.pe</p>
      </v-col>
    </v-row>

    <div />

    <v-btn color="grey" href="https://vuetifyjs.com" variant="outlined" size="large">
      <span class="text-grey-darken-1 font-weight-bold">
        Vuetify Documentation
      </span>
    </v-btn>
  </v-container>
</template>

<script>
export default {}
</script>
