<template>
  <article
    class="rounded-[2rem] border border-outline/25 bg-surface/70 p-6 shadow-sm dark:bg-surface/30"
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
    <h3 class="text-center text-xl font-bold text-on-surface">
      {{ name }}
    </h3>
    <p class="mt-2 text-center text-sm leading-6 text-on-surface/70">
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
