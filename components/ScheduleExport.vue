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
        <v-icon> mdi-download </v-icon>
        Descargar (.pdf )
        <v-icon>mdi-file-pdf</v-icon>
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
        <v-icon> mdi-download </v-icon>
        Descargar (.png )
        <v-icon>mdi-file-image</v-icon>
      </v-btn>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
defineProps<{
  loadingPdf: boolean
  loadingImage: boolean
}>()

defineEmits<{
  (event: 'download:pdf'): void
  (event: 'download:image'): void
}>()
</script>
