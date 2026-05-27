<template>
  <article
    class="rounded-3xl bg-surface/65 p-6 text-center shadow-sm ring-1 ring-black/5 dark:bg-surface/30"
  >
    <div class="mb-5 flex justify-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-black text-white shadow-lg shadow-primary/25"
      >
        {{ index }}
      </div>
    </div>
    <h3 class="mb-2 text-xl font-bold text-on-surface">
      {{ title }}
    </h3>
    <p class="text-sm leading-6 text-on-surface/70">
      {{ description }}
    </p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  index: number
  title: string
  description: string
}>()
</script>
