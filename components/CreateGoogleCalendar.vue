<template>
  <v-card :loading="loading" :disabled="loading">
    <v-card-title class="headline">
      Crea un nuevo calendario
    </v-card-title>

    <v-card-text>
      <v-text-field v-model="itemSync.name" />
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn
        color="green darken-1"
        text
        @click="dialogSync = false"
      >
        Cancelar
      </v-btn>

      <v-btn
        color="green darken-1"
        text
        @click="save()"
      >
        Crear
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, PropSync, Vue } from 'nuxt-property-decorator'
@Component
export default class CreateGoogleCalendar extends Vue {
  @PropSync('dialog', { type: Boolean }) dialogSync!: boolean;
  @PropSync('result', { type: Boolean }) resultSync!: boolean;
  @PropSync('item', { type: Object }) itemSync!: any;
   loading: boolean = false;

   async save () {
     this.loading = true
     this.resultSync = await this.createCalendar(this.itemSync.name)
     this.loading = false
     this.dialogSync = false
   }

   async createCalendar (summary: any) {
     try {
       const response = await window.gapi.client.calendar.calendars.insert({
         resource: {
           summary,
           etag: 'Created by Octatec'
         }
       })
       // Handle the results here (response.result has the parsed body).
       console.log('Response', response)
       return response.result
     } catch (e) {
       console.error('Execute error', e)
     }
   }
}
</script>
