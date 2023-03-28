<template>
  <v-form
    ref="form"
  >
    <v-text-field

      v-model="eventSync.title"
      label="Titulo del Evento"
      :rules="[rules.required]"
    />
    <v-autocomplete
      v-model="eventSync.day"
      :items="weekdays"
      item-value="index"
      item-text="value"
      label="Dia"
      :rules="[rules.requiredDay]"
    />
    <v-text-field
      v-model="eventSync.startTime"
      label="Hora de Inicio"
      type="time"
      :rules="[rules.required, rules.max]"
    />
    <v-text-field
      v-model="eventSync.endTime"
      label="Hora de Fin"
      type="time"
      :rules="[rules.required, rules.min]"
    />
    <v-color-picker
      v-model="color"
      class="ma-2"
      hide-canvas
      hide-mode-switch
      hide-inputs
    />
  </v-form>
</template>

<script lang="ts">
import { Component, PropSync, Vue, Watch } from 'nuxt-property-decorator'
import { v4 } from 'uuid'
import { VForm } from '~/types'

  @Component({
    name: 'EventsCreator',
    components: { }
  })
export default class EventsCreator extends Vue {
    @PropSync('event', {
      type: Object,
      default: () => ({
        id: v4(),
        title: '',
        day: null,
        color: 'primary',
        type: 'myEvent',
        startTime: '12:00',
        endTime: '14:00'
      })
    })
    eventSync!: any

    color = null

    @Watch('color')
    onChangeColor (newVal: any) {
      this.eventSync.color = newVal.hex
    }

    get rules () {
      return {
        required: (value: any) => !!value || 'Requerido.',
        requiredDay: (value: any) => (value >= 0 && value <= 6) || 'Requerido.',
        max: (value: any) => value < this.eventSync.endTime || 'Tiene que ser menor que el fin',
        min: (value: any) => value > this.eventSync.startTime || 'Tiene que ser mayor que el inicio'
      }
    }

    form (): any {
      return this.$refs.form as VForm
    }

    validated ():boolean {
      const validate = this.form().validate()
      if (validate) {
        return true
      }
      return validate
    }

  weekdays = [
    { index: 0, value: 'Domingo' },
    { index: 1, value: 'Lunes' },
    { index: 2, value: 'Martes' },
    { index: 3, value: 'Miercoles' },
    { index: 4, value: 'Jueves' },
    { index: 5, value: 'Viernes' },
    { index: 6, value: 'Sábado' }
  ]

    dialog=false
}
</script>
