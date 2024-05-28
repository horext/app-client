<template>
  <v-list-item lines="three" density="compact">
    <template v-if="hourlyLoad">
      {{ hourlyLoad.name }}
      <v-list-item-subtitle>
        Actual.: {{ new Date(hourlyLoad.updatedAt).toLocaleString() }}
      </v-list-item-subtitle>
    </template>
    <template v-else>
      <v-list-item-subtitle> Sin carga horaria. </v-list-item-subtitle>
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type { IHourlyLoad } from '~/interfaces/houly-load'
defineProps<{ hourlyLoad?: IHourlyLoad }>()
</script>
