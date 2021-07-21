<template>
  <v-card>
    <v-card-title>
      Exporta tu horario
      <v-spacer />
      <v-btn
        class="mx-0"
        icon
        @click="close"
      >
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-btn
        :loading="loadingPdf"
        color="success"
        dark
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
        @click="downloadImage"
      >
        <v-icon>
          mdi-download
        </v-icon>
        Descargar (.png )
        <v-icon>mdi-file-image</v-icon>
      </v-btn>
    </v-card-text>
    <v-card-text>
      <v-dialog
        max-width="500"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="indigo"
            dark
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-calendar
            </v-icon>
            Google Calendar
          </v-btn>
        </template>
        <GoogleAuth :events="schedule.eventos" />
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import Schedule from './ScheduleViewer.vue'
import GoogleAuth from './GoogleAuth.vue'
import { exportToPNG, exportToPDF } from '~/utils/exportToPNG'
@Component({
  components: { Schedule, GoogleAuth }
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
