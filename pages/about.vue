<template>
  <v-container class="text-center">
    <h2 class="text-h3 font-weight-bold mb-3">ACERCA DE</h2>

    <v-divider />

    <v-responsive
      class="mx-auto text-h6 font-weight-light my-8"
      max-width="720"
    >
      <p>
        Horext es un proyecto Open Source , consiste en una aplicación web donde
        puedes gestionar los horarios de tus cursos, lo cual te permite generar
        todos los horarios posibles de tus cursos, y así poder elegir el que más
        te convenga.
      </p>
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
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            Eres libre de contribuir al proyecto, puedes ver el código fuente
            en:</v-col
          >
          <v-col cols="12">
            <v-btn
              color="orange"
              href="https://gitlab.com/horext-app"
              variant="outlined"
              size="large"
            >
              <v-icon start>mdi-gitlab</v-icon>
              <span class="text-grey-darken-1 font-weight-bold">
                GitLab
              </span>
            </v-btn></v-col
          >
        </v-row>
      </v-col>
      <v-col cols="12">
        <p class="text-h7 font-weight-light">
          Próximamente se publicará la documentación del proyecto y se migrará a
          GitHub.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {}
</script>
