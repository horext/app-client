<template>
  <section class="bg-background py-12 text-on-surface md:py-16">
    <div class="mx-auto max-w-6xl px-6 lg:px-10">
      <HomeSectionHeading
        eyebrow="Acerca de"
        title="Horext"
        description="Horext es una aplicación web que permite a los estudiantes de la Universidad Nacional de Ingeniería (UNI) generar sus horarios de clases de manera automática."
      />

      <div class="space-y-12">
        <div class="grid gap-6 md:grid-cols-2">
          <AboutProfileCard
            name="Octatec"
            email="Email: octatec.pe@gmail.com"
            :image-src="img('/octatec-logo.png', { quality: 100 })"
            :image-srcset="octatecLogo.srcset"
            :image-sizes="octatecLogo.sizes"
          />
          <AboutProfileCard
            name="Franz A. Bendezu Isidro"
            email="Email: fbendezui@uni.pe"
            :image-src="img('/me.jpeg', { quality: 100 })"
            :image-srcset="mePhoto.srcset"
            :image-sizes="mePhoto.sizes"
          />
        </div>

        <div
          class="rounded-xl border border-outline/20 bg-surface/70 p-6 shadow-sm md:p-8 dark:bg-surface/30"
        >
          <p class="text-base leading-7 text-on-surface/80">
            Eres libre de contribuir al proyecto, puedes ver el código fuente
            en:
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-4">
            <AboutSourceLinkCard
              href="https://github.com/horext"
              :icon="mdiGithub"
              label="GitHub"
            />
            <AboutSourceLinkCard
              href="https://gitlab.com/horext-app"
              :icon="mdiGitlab"
              label="GitLab"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
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
