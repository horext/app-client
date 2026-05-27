<template>
  <section class="legal-page">
    <div class="legal-shell">
      <header class="legal-header">
        <p class="legal-kicker">Legal</p>
        <h1>{{ title }}</h1>
        <p class="legal-updated">{{ updatedAt }}</p>
      </header>

      <div class="legal-card">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  updatedAt: string
}>()
</script>

<style scoped>
.legal-page {
  @apply bg-background  py-12 md:py-16;
}

.legal-shell {
  @apply mx-auto max-w-4xl px-6 lg:px-10;
}

.legal-header {
  @apply mb-10 rounded-[2rem] border border-surface/10  p-6 shadow-sm md:p-8 bg-surface;
}

.legal-kicker {
  @apply mb-3 text-sm font-medium uppercase tracking-[0.24em] text-primary;
}

.legal-header h1 {
  @apply text-4xl font-black tracking-tight md:text-5xl;
}

.legal-updated {
  @apply mt-3 text-sm leading-6 text-surface-700;
}

.legal-card {
  @apply rounded-[2rem]  p-6 shadow-sm border border-surface/10 bg-surface;
}
</style>
