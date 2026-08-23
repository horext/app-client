<template>
  <v-list-item density="compact" class="px-1 py-0" lines="two">
    <template v-if="hourlyLoad">
      <v-list-item-title
        class="text-subtitle-2 font-weight-medium text-truncate"
      >
        {{ hourlyLoad.name }}
      </v-list-item-title>
      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        {{ new Date(hourlyLoad.updatedAt).toLocaleString() }}
      </v-list-item-subtitle>
    </template>
    <template v-else>
      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Sin carga horaria.
      </v-list-item-subtitle>
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type { IHourlyLoad } from '~/interfaces/houly-load'
defineProps<{ hourlyLoad?: Pick<IHourlyLoad, 'name' | 'updatedAt'> }>()
</script>
