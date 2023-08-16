<template>
  <v-list>
    <v-list-item>
      <v-btn
        :loading="loadingPdf"
        color="success"
        dark
        class="ma-1"
        @click="downloadPdf"
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
        dark
        class="ma-1"
        @click="downloadImage"
      >
        <v-icon> mdi-download </v-icon>
        Descargar (.png )
        <v-icon>mdi-file-image</v-icon>
      </v-btn>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { exportToPNG, exportToPDF } from '~/utils/exportToPNG'
import { useVuetify } from '~/composables/vuetify'

export default defineComponent({
  setup () {
    const vuetify = useVuetify()

    const loading = ref(false)
    const loadingPdf = ref(false)
    const loadingImage = ref(false)

    function getCalendar (): HTMLElement | null {
      return document.getElementById('calendar')
    }

    async function downloadImage () {
      loadingImage.value = true
      await vuetify.goTo(0)
      await exportToPNG(getCalendar())
      loadingImage.value = false
    }

    async function downloadPdf () {
      loadingPdf.value = true
      await vuetify.goTo(0)
      await exportToPDF(getCalendar())
      loadingPdf.value = false
    }

    return {
      close,
      getCalendar,
      loading,
      loadingPdf,
      loadingImage,
      downloadImage,
      downloadPdf
    }
  }
})
</script>

<style scoped>

</style>
