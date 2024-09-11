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
          <v-img
            :src="img('/octatec-logo.png', { quality: 100 })"
            :lazy-src="img('/octatec-logo.png', { width: 128, quality: 100 })"
            :srcset="octatecLogo.srcset"
            :sizes="octatecLogo.sizes"
         
          />
        </v-avatar>
        <p class="text-h6 text-center">Octatec</p>
        <p class="text-subtitle-1 text-center">Email: octatec.pe@gmail.com</p>
      </v-col>
      <v-col>
        <v-avatar class="elevation-2 mb-4" size="128">
          <v-img
            :lazy-src="img('/me.jpeg', { width: 128, quality: 100 })"
            :src="img('/me.jpeg', { quality: 100 })"
            :srcset="mePhoto.srcset"
            :sizes="mePhoto.sizes"
        
          />
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
            en:
          </v-col>
          <v-col cols="6">
            <v-btn
              color="black"
              href="https://github.com/horext"
              variant="outlined"
              size="large"
            >
              <v-icon start>
                {{ mdiGithub }}
              </v-icon>
              <span class="text-grey-darken-1 font-weight-bold"> GitHub </span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="orange"
              href="https://gitlab.com/horext-app"
              variant="outlined"
              size="large"
            >
              <v-icon start>
                {{ mdiGitlab }}
              </v-icon>
              <span class="text-grey-darken-1 font-weight-bold"> GitLab </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { mdiGitlab, mdiGithub } from '@mdi/js'

useSeoMeta({
  title: 'Acerca de',
})

const img = useImage()

const octatecLogo = computed(() =>
  img.getSizes('/octatec-logo.png', {
    sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw',
    modifiers: {
      format: 'webp',
      quality: 100,
    },
  }),
)

const mePhoto = computed(() =>
  img.getSizes('/me.jpeg', {
    sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw',
    modifiers: {
      format: 'webp',
      quality: 100,
    },
  }),
)
</script>
