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

<script lang="ts">import { defineComponent, PropType, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import { VForm } from '~/types'
import { IEvent } from '~/interfaces/event'

export default defineComponent({
  name: 'EventsCreator',
  props: {
    event: {
      type: Object as PropType<IEvent>,
      required: true
    }
  },
  emits: ['update:event'],
  setup (props, { emit }) {
    const eventSync = useVModel(props, 'event', emit)
    const color = ref(null)

    const onChangeColor = (newVal: any) => {
      emit('update:event', {
        ...props.event,
        color: newVal.hex
      })
    }

    const rules = {
      required: (value: any) => !!value || 'Requerido.',
      requiredDay: (value: any) => (value >= 0 && value <= 6) || 'Requerido.',
      max: (value: any) => value < props.event?.endTime! || 'Tiene que ser menor que el fin',
      min: (value: any) => value > props.event?.startTime! || 'Tiene que ser mayor que el inicio'
    }

    const form = ref<VForm>()

    const validated = () => {
      const validate = form.value?.validate()
      if (validate) {
        return true
      }
      return validate
    }

    watch(color, onChangeColor)

    const weekdays = [
      { index: 0, value: 'Domingo' },
      { index: 1, value: 'Lunes' },
      { index: 2, value: 'Martes' },
      { index: 3, value: 'Miercoles' },
      { index: 4, value: 'Jueves' },
      { index: 5, value: 'Viernes' },
      { index: 6, value: 'Sábado' }
    ]

    const dialog = ref(false)

    return {
      color,
      rules,
      form,
      validated,
      weekdays,
      dialog,
      eventSync
    }
  }
})
</script>
