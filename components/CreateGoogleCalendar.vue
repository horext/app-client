<template>
  <v-card :loading="loading" :disabled="loading">
    <v-card-title class="headline">
      Crea un nuevo calendario
    </v-card-title>

    <v-card-text>
      <v-form
        ref="form"
      >
        <v-text-field v-model="calendarCurrent.summary" :rules="[(r)=>(!!r||'Requerido')]" />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn
        color="green darken-1"
        text
        @click="$emit('close')"
      >
        Cancelar
      </v-btn>

      <v-btn
        color="green darken-1"
        text
        @click="save"
      >
        Crear
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'nuxt-property-decorator'
@Component
export default class CreateGoogleCalendar extends Vue {
  @PropSync('result', { type: Boolean }) resultSync!: boolean;
  @Prop({ type: Object }) calendar!: any;
   loading: boolean = false;

   calendarCurrent: any = {
     summary: ''
   }

   @Watch('calendar')
   onChangeValue (calendar) {
     this.calendarCurrent = calendar
   }

   save () {
     if (this.$refs.form.validate()) {
       this.$emit('update:calendar', this.calendarCurrent)
     }
   }
}
</script>
