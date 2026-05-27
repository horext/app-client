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
  @apply bg-background py-12 text-on-surface md:py-16;
}

.legal-shell {
  @apply mx-auto max-w-4xl px-6 lg:px-10;
}

.legal-header {
  @apply mb-10 rounded-[2rem] border border-outline/10 bg-surface p-6 shadow-sm md:p-8;
}

.legal-kicker {
  @apply mb-3 text-sm font-medium uppercase tracking-[0.24em] text-primary;
}

.legal-header h1 {
  @apply text-4xl font-black tracking-tight md:text-5xl;
}

.legal-updated {
  @apply mt-3 text-sm leading-6 text-on-surface/70;
}

.legal-card {
  @apply rounded-[2rem] border border-outline/10 bg-surface p-6 shadow-sm;
}

.legal-card :deep(section + section) {
  @apply mt-8;
}

.legal-card :deep(section > h2) {
  @apply mb-4 text-2xl font-bold tracking-tight;
}

.legal-card :deep(section > p),
.legal-card :deep(section > div),
.legal-card :deep(section > ul) {
  @apply text-base leading-7 text-on-surface/80;
}

.legal-card :deep(section > p + p),
.legal-card :deep(section > div > p + p),
.legal-card :deep(section > div > ul + p),
.legal-card :deep(section > div > p + ul) {
  @apply mt-4;
}

.legal-card :deep(ul) {
  @apply list-disc pl-6 marker:text-primary;
}

.legal-card :deep(a) {
  @apply font-medium text-primary underline underline-offset-4;
}
</style>
