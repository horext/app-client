<template>
  <a
    :href="href"
    class="inline-flex items-center gap-3 rounded-xl border border-outline/30 bg-surface px-6 py-4 text-base font-bold text-on-surface no-underline shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
    target="_blank"
    rel="noreferrer"
  >
    <VIcon :icon="icon" size="20" />
    <span>{{ label }}</span>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  href: string
  icon: string
  label: string
}>()
</script>
