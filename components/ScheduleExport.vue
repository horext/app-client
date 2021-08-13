<template>
  <v-card>
    <v-card-text>
      <v-btn
        :loading="loadingPdf"
        color="success"
        dark
        class="ma-1"
        @click="downloadPdf"
      >
        <v-icon>
          mdi-download
        </v-icon>
        Descargar (.pdf )
        <v-icon>mdi-file-pdf</v-icon>
      </v-btn>

      <v-btn
        :loading="loadingImage"
        color="success"
        dark
        class="ma-1"
        @click="downloadImage"
      >
        <v-icon>
          mdi-download
        </v-icon>
        Descargar (.png )
        <v-icon>mdi-file-image</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import Schedule from './ScheduleViewer.vue'
import { exportToPNG, exportToPDF } from '~/utils/exportToPNG'
@Component({
  components: { Schedule }
})
export default class ScheduleExport extends Vue {
  @Prop({ type: Object })
  schedule: any

  @PropSync('dialog', { type: Boolean, default: false })
  dialogSync!: boolean

  close () {
    this.dialogSync = false
  }

  getCalendar () {
    return document.getElementById('calendar')
  }

  loading=false
  loadingPdf=false
  loadingImage=false
  async downloadImage () {
    this.loadingImage = true
    await this.$vuetify.goTo(0)
    await exportToPNG(this.getCalendar())
    this.loadingImage = false
  }

  async downloadPdf () {
    this.loadingPdf = true
    await this.$vuetify.goTo(0)
    await exportToPDF(this.getCalendar())
    this.loadingPdf = false
  }
}
</script>

<style scoped>

</style>
