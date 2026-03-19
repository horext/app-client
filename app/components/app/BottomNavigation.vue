<template>
  <v-bottom-navigation color="primary" grow>
    <v-btn
      v-for="item in items"
      :key="item.to"
      exact
      tag="div"
      :to="item.to"
      stacked
    >
      <v-badge color="blue" :content="item.badge" overlap>
        <v-icon>{{ item.icon }}</v-icon>
      </v-badge>
      <span class="hidden-xs">
        {{ item.shortTitle }}
      </span>
      <span class="hidden-sm-and-up">
        {{ item.denseTitle }}
      </span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
defineProps<{
  items: {
    shortTitle: string
    denseTitle: string
    icon: string
    to: string
    badge: number
  }[]
}>()
</script>
