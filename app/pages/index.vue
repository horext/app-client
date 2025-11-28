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
      gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
    >
      <v-container class="fill-height">
        <v-row align="center" class="text-white mx-auto" justify="center">
          <v-col class="text-white text-center" cols="12">
            <h1 class="mb-4">
              <span class="font-weight-light text-h5 text-md-h4 text-lg-h3">
                Genera tu horario perfecto con
              </span>
              <br />
              <span class="font-weight-black text-h3 text-md-h2 text-lg-h1 text-primary">
                Horext
              </span>
            </h1>
            <p class="text-h6 text-md-h5 font-weight-light mb-6 mx-auto hero-subtitle">
              La herramienta inteligente que crea automáticamente combinaciones
              de horarios sin cruces para tus clases
            </p>
          </v-col>
          <v-col class="text-center" cols="12">
            <v-btn
              class="font-weight-bold mr-2 mb-2"
              color="primary"
              size="large"
              to="/generator"
            >
              <v-icon start>{{ mdiCalendarClock }}</v-icon>
              Generar mis horarios
            </v-btn>
            <v-btn
              class="font-weight-bold mb-2"
              variant="outlined"
              theme="dark"
              size="large"
              to="/about"
            >
              <v-icon start>{{ mdiInformationOutline }}</v-icon>
              Conocer más
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-img>

    <!-- Features Section -->
    <v-container class="features-section py-16">
      <v-row justify="center" class="mb-8">
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 text-md-h3 font-weight-bold mb-4">
            ¿Por qué usar Horext?
          </h2>
          <p class="text-body-1 text-medium-emphasis mx-auto" style="max-width: 600px;">
            Optimiza tu tiempo y olvídate de los cruces de horario.
            Nuestra herramienta te ayuda a organizar tus clases de manera eficiente.
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
          <v-card class="feature-card h-100 pa-6" variant="outlined" hover>
            <div class="text-center">
              <v-avatar :color="feature.color" size="64" class="mb-4">
                <v-icon size="32" color="white">{{ feature.icon }}</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h3>
              <p class="text-body-2 text-medium-emphasis">
                {{ feature.description }}
              </p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- How it works Section -->
    <div class="how-it-works-section py-16">
      <v-container>
        <v-row justify="center" class="mb-8">
          <v-col cols="12" class="text-center">
            <h2 class="text-h4 text-md-h3 font-weight-bold mb-4">
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
            <div class="text-center step-item">
              <v-avatar color="primary" size="48" class="mb-4">
                <span class="text-h6 font-weight-bold text-white">{{ index + 1 }}</span>
              </v-avatar>
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
    <v-container class="cta-section py-16">
      <v-row justify="center">
        <v-col cols="12" md="8" class="text-center">
          <v-card class="cta-card pa-8" color="primary" variant="flat">
            <h2 class="text-h4 text-md-h3 font-weight-bold mb-4 text-white">
              ¿Listo para organizar tu semestre?
            </h2>
            <p class="text-h6 font-weight-light mb-6 text-white">
              Comienza ahora y genera tu horario ideal en minutos
            </p>
            <v-btn
              color="white"
              size="x-large"
              class="font-weight-bold"
              to="/generator"
            >
              <v-icon start>{{ mdiRocketLaunchOutline }}</v-icon>
              Comenzar ahora - ¡Es gratis!
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Footer Info -->
    <v-container class="py-8">
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
  mdiShareVariant,
  mdiLightningBolt,
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
  {
    icon: mdiShareVariant,
    title: 'Comparte fácilmente',
    description:
      'Comparte tu horario con amigos por WhatsApp, Facebook, Twitter o Telegram.',
    color: 'purple',
  },
  {
    icon: mdiLightningBolt,
    title: 'Rápido y Eficiente',
    description:
      'Procesamiento en segundo plano que genera cientos de combinaciones en segundos.',
    color: 'orange',
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
  max-width: 600px;
  opacity: 0.9;
}

.features-section {
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 16px;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.how-it-works-section {
  background: rgb(var(--v-theme-surface));
}

.step-item {
  position: relative;
}

.cta-card {
  border-radius: 24px;
}

@media (max-width: 600px) {
  .hero-section {
    min-height: 90vh;
  }
}
</style>
