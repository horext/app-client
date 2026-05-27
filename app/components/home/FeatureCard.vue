<template>
  <article
    class="rounded-xl border border-outline/20 bg-surface/70 p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 dark:bg-surface/30"
  >
    <div class="flex items-start gap-4">
      <div
        :class="badgeClass"
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
      >
        <VIcon :icon="icon" size="20" />
      </div>
      <div>
        <h3 class="mb-1 text-lg font-bold text-on-surface">
          {{ title }}
        </h3>
        <p class="text-sm leading-6 text-on-surface/70">
          {{ description }}
        </p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
  badgeClass: string
}>()
</script>
