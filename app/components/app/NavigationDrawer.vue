<template>
  <v-navigation-drawer v-model="internalDrawer" width="300">
    <v-card-title> Opciones </v-card-title>
    <v-divider />
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        link
        exact
      >
        <template #prepend>
          <v-badge v-if="item.badge" color="blue" :content="item.badge">
            <v-icon>{{ item.icon }}</v-icon>
          </v-badge>

          <v-icon v-else>
            {{ item.icon }}
          </v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <template #append>
      <v-divider />
      <v-list-item
        :href="reportUrl"
        target="_blank"
        rel="noopener noreferrer"
        :prepend-icon="mdiBugOutline"
        :append-icon="mdiOpenInNew"
        title="Informar un problema"
      />
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { mdiBugOutline, mdiOpenInNew } from '@mdi/js'

defineProps<{
  items: { title: string; icon: string; to: string; badge?: number }[]
  reportUrl: string
}>()

const internalDrawer = defineModel<boolean>('drawer')
</script>
