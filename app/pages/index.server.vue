<template>
  <div class="overflow-x-hidden bg-background text-on-surface">
    <section class="relative isolate min-h-[90vh] md:min-h-[85vh]">
      <img
        :src="heroImage"
        :srcset="material.srcset"
        :sizes="material.sizes"
        alt="Cover background"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-hero-overlay" />

      <div
        class="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-6 py-20 md:min-h-[85vh] lg:px-10"
      >
        <div class="mx-auto max-w-4xl text-center text-white">
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur"
          >
            <VIcon :icon="mdiStar" size="16" />
            <span>Herramienta para estudiantes UNI</span>
          </div>

          <h1 class="mb-4">
            <span class="mb-2 block text-2xl font-light md:text-4xl">
              Genera tu horario perfecto con
            </span>
            <span
              class="block text-5xl font-black tracking-tight text-primary md:text-7xl"
            >
              Horext
            </span>
          </h1>

          <p
            class="mx-auto mb-8 max-w-[620px] text-lg font-light leading-8 text-white/90 md:text-xl"
          >
            Crea automáticamente combinaciones de horarios sin cruces para tus
            clases universitarias
          </p>

          <div class="flex flex-wrap justify-center gap-3">
            <NuxtLink
              to="/generator"
              class="inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-base font-bold text-white no-underline shadow-lg shadow-primary/30 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
            >
              <VIcon :icon="mdiCalendarClock" size="20" />
              <span>Generar mis horarios</span>
            </NuxtLink>
            <NuxtLink
              to="/about"
              class="inline-flex items-center gap-3 rounded-xl border border-white/35 bg-white/5 px-8 py-4 text-base font-bold text-white no-underline backdrop-blur transition-colors duration-200 hover:bg-white/12"
            >
              <VIcon :icon="mdiInformationOutline" size="20" />
              <span>Conocer más</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <HomeSectionHeading
          eyebrow="Características"
          title="¿Por qué usar Horext?"
          description="Optimiza tu tiempo y olvídate de los cruces de horario."
        />

        <div class="mt-10 grid gap-6 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
          <HomeFeatureCard
            v-for="feature in features"
            :key="feature.title"
            v-bind="feature"
          />
        </div>
      </div>
    </section>

    <section class="bg-surface-variant/30 py-16">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <HomeSectionHeading
          eyebrow="Proceso"
          title="¿Cómo funciona?"
          description="Genera tu horario en 3 simples pasos"
        />

        <div class="mt-10 grid gap-8 md:mt-12 md:grid-cols-3">
          <HomeStepCard
            v-for="(step, index) in steps"
            :key="step.title"
            :index="index + 1"
            v-bind="step"
          />
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <div
          class="mx-auto max-w-5xl rounded-xl bg-gradient-to-br from-primary to-primary/95 px-8 py-12 text-center shadow-xl shadow-primary/25 md:px-12 md:py-16"
        >
          <h2
            class="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            ¿Listo para organizar tu semestre?
          </h2>
          <p class="mb-8 text-lg font-light leading-8 text-white/90 md:text-xl">
            Comienza ahora y genera tu horario ideal en minutos
          </p>
          <NuxtLink
            to="/generator"
            class="inline-flex items-center gap-3 rounded-xl bg-white px-10 py-4 text-base font-bold text-primary no-underline shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
          >
            <VIcon :icon="mdiRocketLaunchOutline" size="20" />
            <span>Comenzar ahora</span>
          </NuxtLink>
        </div>
      </div>
    </section>
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

const heroImage = img('/material2.jpg', {
  quality: 70,
})

const features = [
  {
    icon: mdiCalendarCheck,
    title: 'Generación Automática',
    description:
      'Crea múltiples combinaciones de horarios sin cruces automáticamente a partir de tus cursos seleccionados.',
    badgeClass: 'bg-primary',
  },
  {
    icon: mdiBookOpenPageVariant,
    title: 'Gestión de Cursos',
    description:
      'Agrega tus cursos y selecciona las secciones disponibles. Filtra por docente, horario y más.',
    badgeClass: 'bg-secondary',
  },
  {
    icon: mdiCalendarPlus,
    title: 'Actividades Personales',
    description:
      'Añade tus actividades extracurriculares para que el generador las considere y evite conflictos.',
    badgeClass: 'bg-success',
  },
  {
    icon: mdiStar,
    title: 'Horarios Favoritos',
    description:
      'Guarda tus horarios preferidos para compararlos y decidir cuál te conviene más.',
    badgeClass: 'bg-warning text-black',
  },
  {
    icon: mdiDownload,
    title: 'Exporta tu Horario',
    description:
      'Descarga tu horario en formato PDF o imagen PNG para tenerlo siempre a la mano.',
    badgeClass: 'bg-info',
  },
  {
    icon: mdiGoogleCirclesExtended,
    title: 'Sincroniza con Google',
    description:
      'Exporta tu horario directamente a Google Calendar con notificaciones personalizadas.',
    badgeClass: 'bg-error',
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
