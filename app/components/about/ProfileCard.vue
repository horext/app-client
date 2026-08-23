<template>
  <article
    class="rounded-xl border border-outline/20 bg-surface/70 p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 dark:bg-surface/30 flex flex-col justify-between"
  >
    <div>
      <div class="mb-4 flex justify-center">
        <img
          v-if="imageSrc"
          :alt="name"
          :src="imageSrc"
          :srcset="imageSrcset"
          :sizes="imageSizes"
          class="h-32 w-32 rounded-full object-cover shadow-lg ring-4 ring-white/60 dark:ring-white/10"
        />
        <div
          v-else
          class="h-32 w-32 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-white/60 dark:ring-white/10"
        >
          {{ initials }}
        </div>
      </div>
      <h3 class="mb-1 text-center text-lg font-bold text-on-surface">
        {{ name }}
      </h3>
      <p
        v-if="role"
        class="text-center text-xs font-semibold text-primary mb-1"
      >
        {{ role }}
      </p>
      <p class="text-center text-sm leading-6 text-on-surface/70">
        {{ email }}
      </p>
    </div>
    <div v-if="github" class="mt-4 text-center">
      <a
        :href="github"
        target="_blank"
        rel="noopener noreferrer"
        class="profile-card-link inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
      >
        <span>Perfil de GitHub</span>
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  email: string
  role?: string
  github?: string
  imageSrc?: string
  imageSrcset?: string
  imageSizes?: string
}>()

const initials = computed(() =>
  props.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase(),
)
</script>

<style scoped>
.profile-card-link:visited,
.profile-card-link:active,
.profile-card-link:focus {
  color: inherit !important;
}
</style>
