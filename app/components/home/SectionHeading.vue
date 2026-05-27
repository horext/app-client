<template>
  <div class="mx-auto mb-10 max-w-3xl text-center md:mb-12">
    <p
      class="mb-2 text-sm font-medium uppercase tracking-[0.24em] text-primary"
    >
      {{ eyebrow }}
    </p>
    <h2 class="mb-3 text-3xl font-bold tracking-tight md:text-5xl">
      {{ title }}
    </h2>
    <p class="text-base leading-7 text-on-surface/70 md:text-lg">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
}>()
</script>
