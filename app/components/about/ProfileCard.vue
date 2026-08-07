<template>
  <article
    class="rounded-xl border border-outline/20 bg-surface/70 p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 dark:bg-surface/30"
  >
    <div class="mb-4 flex justify-center">
      <img
        :alt="name"
        :src="imageSrc"
        :srcset="imageSrcset"
        :sizes="imageSizes"
        class="h-32 w-32 rounded-full object-cover shadow-lg ring-4 ring-white/60 dark:ring-white/10"
      />
    </div>
    <h3 class="mb-1 text-center text-lg font-bold text-on-surface">
      {{ name }}
    </h3>
    <p class="text-center text-sm leading-6 text-on-surface/70">
      {{ email }}
    </p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  email: string
  imageSrc: string
  imageSrcset: string
  imageSizes?: string
}>()
</script>
