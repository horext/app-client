<script setup lang="ts">
import { mdiShareVariant, mdiExport, mdiSync } from '@mdi/js'
import { defineEmits } from 'vue'
import { ViewMode } from '~/models/ViewMode'

defineProps<{
  mode: ViewMode
  loadingExportPdf: boolean
  loadingExportImage: boolean
}>()
defineEmits<{
  (event: 'click:share', value: MouseEvent): void
  (event: 'click:export-pdf', value: MouseEvent): void
  (event: 'click:export-image', value: MouseEvent): void
  (event: 'click:sync', value: MouseEvent): void
}>()
</script>

<template>
  <v-menu v-if="mode === ViewMode.CALENDAR" offset-y>
    <template #activator="{ props }">
      <v-btn
        color="purple"
        theme="dark"
        rounded
        variant="outlined"
        class="ma-1"
        density="compact"
        v-bind="props"
      >
        <v-icon start>
          {{ mdiExport }}
        </v-icon>
        Exportar
      </v-btn>
    </template>
    <schedule-export-actions
      :loading-pdf="loadingExportPdf"
      :loading-image="loadingExportImage"
      @download:pdf="$emit('click:export-pdf', $event)"
      @download:image="$emit('click:export-image', $event)"
    />
  </v-menu>
  <v-btn
    color="indigo"
    theme="dark"
    rounded
    variant="outlined"
    class="ma-1"
    density="compact"
    @click="$emit('click:share', $event)"
  >
    <v-icon start>
      {{ mdiShareVariant }}
    </v-icon>
    Compartir
  </v-btn>
  <v-btn
    v-if="false"
    color="indigo"
    theme="dark"
    rounded
    variant="outlined"
    class="ma-1"
    density="compact"
    @click="$emit('click:sync', $event)"
  >
    <v-icon start>
      {{ mdiSync }}
    </v-icon>
    Sincronizar
  </v-btn>
</template>
