<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <v-img
      :lazy-src="img('/material2.jpg', { width: 10, quality: 70 })"
      :src="img('/material2.jpg', { quality: 70 })"
      :srcset="material.srcset"
      :sizes="material.sizes"
      class="hero-section"
      cover
      alt="Cover background"
      gradient="to bottom, rgba(10,25,60,.88), rgba(20,45,110,.78)"
    >
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-white text-center">
            <v-chip
              color="primary"
              variant="tonal"
              size="small"
              class="mb-6 font-weight-medium"
            >
              <v-icon start size="small">{{ mdiStar }}</v-icon>
              Herramienta para estudiantes UNI
            </v-chip>

            <h1 class="mb-4">
              <span class="font-weight-light text-h5 text-md-h4 d-block mb-1">
                Genera tu horario perfecto con
              </span>
              <span class="font-weight-black text-h2 text-md-h1 text-primary">
                Horext
              </span>
            </h1>

            <p class="text-h6 font-weight-light mb-8 mx-auto hero-subtitle">
              Crea automáticamente combinaciones de horarios sin cruces para tus
              clases universitarias
            </p>

            <div class="d-flex flex-wrap justify-center ga-3">
              <v-btn
                color="primary"
                size="x-large"
                variant="flat"
                rounded="lg"
                to="/generator"
                class="font-weight-bold px-8"
              >
                <v-icon start>{{ mdiCalendarClock }}</v-icon>
                Generar mis horarios
              </v-btn>
              <v-btn
                variant="outlined"
                theme="dark"
                size="x-large"
                rounded="lg"
                to="/about"
                class="font-weight-bold px-8"
              >
                <v-icon start>{{ mdiInformationOutline }}</v-icon>
                Conocer más
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-img>

    <!-- Features Section -->
    <v-container class="py-16">
      <v-row justify="center" class="mb-12">
        <v-col cols="12" md="7" class="text-center">
          <p
            class="text-primary font-weight-medium text-uppercase text-caption section-label mb-2"
          >
            Características
          </p>
          <h2 class="text-h4 text-md-h3 font-weight-bold mb-3">
            ¿Por qué usar Horext?
          </h2>
          <p class="text-body-1 text-medium-emphasis">
            Optimiza tu tiempo y olvídate de los cruces de horario.
          </p>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col
          v-for="feature in features"
          :key="feature.title"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="feature-card h-100 pa-5" border hover>
            <div class="d-flex align-start ga-4">
              <v-avatar
                :color="feature.color"
                size="48"
                rounded="lg"
                class="flex-shrink-0"
              >
                <v-icon size="22" color="white">{{ feature.icon }}</v-icon>
              </v-avatar>
              <div>
                <h3 class="text-subtitle-1 font-weight-bold mb-1">
                  {{ feature.title }}
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- How it works Section -->
    <div class="how-it-works-section py-16">
      <v-container>
        <v-row justify="center" class="mb-12">
          <v-col cols="12" md="7" class="text-center">
            <p
              class="text-primary font-weight-medium text-uppercase text-caption section-label mb-2"
            >
              Proceso
            </p>
            <h2 class="text-h4 text-md-h3 font-weight-bold mb-3">
              ¿Cómo funciona?
            </h2>
            <p class="text-body-1 text-medium-emphasis">
              Genera tu horario en 3 simples pasos
            </p>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col
            v-for="(step, index) in steps"
            :key="step.title"
            cols="12"
            md="4"
          >
            <div class="step-item text-center pa-4">
              <div class="step-number-wrap mb-5">
                <v-avatar color="primary" size="64">
                  <span class="text-h5 font-weight-black text-white">{{
                    index + 1
                  }}</span>
                </v-avatar>
              </div>
              <h3 class="text-h6 font-weight-bold mb-2">{{ step.title }}</h3>
              <p class="text-body-2 text-medium-emphasis">
                {{ step.description }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- CTA Section -->
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="9" class="text-center">
          <v-card
            class="cta-card pa-10 pa-md-14"
            color="primary"
            rounded="xl"
            variant="flat"
          >
            <h2 class="text-h4 text-md-h3 font-weight-bold mb-4 text-white">
              ¿Listo para organizar tu semestre?
            </h2>
            <p
              class="text-h6 font-weight-light mb-8 text-white"
              style="opacity: 0.9"
            >
              Comienza ahora y genera tu horario ideal en minutos
            </p>
            <v-btn
              color="white"
              size="x-large"
              rounded="lg"
              class="font-weight-bold px-10"
              to="/generator"
            >
              <v-icon start>{{ mdiRocketLaunchOutline }}</v-icon>
              Comenzar ahora
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Footer Info -->
    <v-container class="pb-10">
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <p class="text-body-2 text-medium-emphasis">
            Desarrollado con ❤️ para estudiantes de la
            <strong>Universidad Nacional de Ingeniería</strong>
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import {
  mdiCalendarClock,
  mdiInformationOutline,
  mdiRocketLaunchOutline,
  mdiCalendarCheck,
  mdiBookOpenPageVariant,
  mdiCalendarPlus,
  mdiStar,
  mdiDownload,
  mdiGoogleCirclesExtended,
} from '@mdi/js'

const img = useImage()

useSeoMeta({
  title: 'Inicio - Generador de Horarios Universitarios',
  description:
    'Horext es una herramienta gratuita para generar horarios de clases automáticamente. Evita cruces y optimiza tu tiempo universitario.',
})

const material = computed(() =>
  img.getSizes('/material2.jpg', {
    sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw',
    modifiers: {
      format: 'webp',
      quality: 100,
    },
  }),
)

const features = [
  {
    icon: mdiCalendarCheck,
    title: 'Generación Automática',
    description:
      'Crea múltiples combinaciones de horarios sin cruces automáticamente a partir de tus cursos seleccionados.',
    color: 'primary',
  },
  {
    icon: mdiBookOpenPageVariant,
    title: 'Gestión de Cursos',
    description:
      'Agrega tus cursos y selecciona las secciones disponibles. Filtra por docente, horario y más.',
    color: 'secondary',
  },
  {
    icon: mdiCalendarPlus,
    title: 'Actividades Personales',
    description:
      'Añade tus actividades extracurriculares para que el generador las considere y evite conflictos.',
    color: 'success',
  },
  {
    icon: mdiStar,
    title: 'Horarios Favoritos',
    description:
      'Guarda tus horarios preferidos para compararlos y decidir cuál te conviene más.',
    color: 'warning',
  },
  {
    icon: mdiDownload,
    title: 'Exporta tu Horario',
    description:
      'Descarga tu horario en formato PDF o imagen PNG para tenerlo siempre a la mano.',
    color: 'info',
  },
  {
    icon: mdiGoogleCirclesExtended,
    title: 'Sincroniza con Google',
    description:
      'Exporta tu horario directamente a Google Calendar con notificaciones personalizadas.',
    color: 'error',
  },
]

const steps = [
  {
    title: 'Selecciona tus cursos',
    description:
      'Busca y agrega los cursos que llevarás este semestre. Puedes filtrar por código o nombre.',
  },
  {
    title: 'Elige tus secciones',
    description:
      'Para cada curso, selecciona las secciones que te interesan según docente, horario o disponibilidad.',
  },
  {
    title: 'Genera tu horario',
    description:
      '¡Listo! El sistema generará todas las combinaciones posibles sin cruces para que elijas la mejor.',
  },
]
</script>

<style scoped>
.landing-page {
  overflow-x: hidden;
}

.hero-section {
  min-height: 85vh;
}

.hero-subtitle {
  max-width: 620px;
  opacity: 0.92;
}

.section-label {
  letter-spacing: 0.1em;
}

.feature-card {
  transition: transform 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
}

.how-it-works-section {
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.step-item {
  position: relative;
}

.step-number-wrap {
  display: flex;
  justify-content: center;
}

@media (max-width: 600px) {
  .hero-section {
    min-height: 90vh;
  }
}
</style>
