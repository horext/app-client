<template>
  <v-list>
    <v-list-item>
      <v-btn
        :loading="loadingPdf"
        color="success"
        theme="dark"
        class="ma-1"
        @click="$emit('download:pdf')"
      >
        <v-icon> {{ mdiDownload }} </v-icon>
        Descargar (.pdf )
        <v-icon> {{ mdiFilePdfBox }} </v-icon>
      </v-btn>
    </v-list-item>
    <v-list-item>
      <v-btn
        :loading="loadingImage"
        color="success"
        theme="dark"
        class="ma-1"
        @click="$emit('download:image')"
      >
        <v-icon> {{ mdiDownload }} </v-icon>
        Descargar (.png )
        <v-icon>{{ mdiFileImage }} </v-icon>
      </v-btn>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { mdiDownload, mdiFilePdfBox, mdiFileImage } from '@mdi/js'

defineProps<{
  loadingPdf: boolean
  loadingImage: boolean
}>()

defineEmits<{
  (event: 'download:pdf'): void
  (event: 'download:image'): void
}>()
</script>
