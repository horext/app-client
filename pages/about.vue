<template>
  <v-container class="text-center">
    <v-row align="center" align-content="center" justify="center">
      <v-col cols="12">
        <h1 class="display-1 font-weight-light">Acerca de</h1>
      </v-col>
    </v-row>
    <v-row align="center" align-content="center" justify="center">
      <v-col cols="12">
        <p class="text-h6 font-weight-light">
          Horext es una aplicación web que permite a los estudiantes de la
          Universidad Nacional de Ingeniería (UNI) generar sus horarios de
          clases de manera automática.
        </p>
      </v-col>
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
              <v-icon start>{{ mdiGitlab }} </v-icon>
              <span class="text-grey-darken-1 font-weight-bold"> GitLab </span>
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

<script lang="ts" setup>
import { mdiGitlab } from '@mdi/js'

useSeoMeta({
  title: 'Acerca de',
})
</script>
