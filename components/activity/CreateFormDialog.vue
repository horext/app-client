<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="emit('cancel')">
    <template #activator="{ props }">
      <v-btn color="primary" theme="dark" v-bind="props">
        Nueva Actividad
      </v-btn>
    </template>
    <v-card>
      <v-card-title> Crear tu Actividad </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="internalEvent.title"
            label="Titulo del Evento"
            :rules="[rules.required]"
          />
          <v-autocomplete
            v-model="internalEvent.day"
            :items="weekdays"
            item-value="index"
            item-title="value"
            label="Dia"
            :rules="[rules.requiredDay]"
          />
          <v-text-field
            v-model="internalEvent.startTime"
            label="Hora de Inicio"
            type="time"
            :rules="startRules"
          />
          <v-text-field
            v-model="internalEvent.endTime"
            label="Hora de Fin"
            type="time"
            :rules="endRules"
          />
          <v-color-picker
            v-model="internalEvent.color"
            class="ma-2"
            hide-canvas
            hide-inputs
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="emit('cancel')"> Cancelar </v-btn>
        <v-btn variant="text" @click="save"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch, toRefs } from 'vue'
import type { IEvent } from '~/interfaces/event'
import type { VForm } from 'vuetify/components/VForm'

const _props = withDefaults(
  defineProps<{
    event: IEvent
    loading?: boolean
    modelValue: boolean
  }>(),
  {
    modelValue: false,
    loading: false,
  },
)

const emit = defineEmits<{
  (name: 'update:modelValue', value: boolean): void
  (name: 'save:event', event: IEvent): void
  (name: 'cancel'): void
}>()

const dialog = useVModel(_props, 'modelValue', emit)

const { event } = toRefs(_props)

const internalEvent = ref<IEvent>({
  id: event.value.id,
  title: event.value.title,
  day: event.value.day,
  startTime: event.value.startTime,
  endTime: event.value.endTime,
  color: event.value.color,
  type: event.value.type,
})
watch(
  event,
  (newVal) => {
    internalEvent.value = {
      id: newVal.id,
      title: newVal.title,
      day: newVal.day,
      startTime: newVal.startTime,
      endTime: newVal.endTime,
      color: newVal.color,
      type: newVal.type,
    }
  },
  { immediate: true },
)

const startTime = computed(() => {
  return internalEvent.value.startTime
})
const endTime = computed(() => {
  return internalEvent.value.endTime
})
const rules = computed(() => ({
  required: (value: any) => !!value || 'Requerido.',
  requiredDay: (value: any) => (value >= 0 && value <= 6) || 'Requerido.',
  max: (value: any) =>
    value < endTime.value || 'Tiene que ser menor que el fin',
  min: (value: any) =>
    value > startTime.value || 'Tiene que ser mayor que el inicio',
}))

const startRules = computed(() => {
  const rules: any[] = [(value: any) => !!value || 'Requerido.']
  if (endTime.value < startTime.value) {
    rules.push(
      (value: any) => value < endTime.value || 'Tiene que ser menor que el fin',
    )
  }
  return rules
})

const endRules = computed(() => {
  const rules: any[] = [(value: any) => !!value || 'Requerido.']
  if (startTime.value > endTime.value) {
    rules.push(
      (value: any) =>
        value > startTime.value || 'Tiene que ser mayor que el inicio',
    )
  }
  return rules
})

const form = ref<VForm>()

const save = async () => {
  const validate = await form.value?.validate()
  if (!validate?.valid) return
  emit('save:event', internalEvent.value)
}

const weekdays = [
  { index: 0, value: 'Domingo' },
  { index: 1, value: 'Lunes' },
  { index: 2, value: 'Martes' },
  { index: 3, value: 'Miercoles' },
  { index: 4, value: 'Jueves' },
  { index: 5, value: 'Viernes' },
  { index: 6, value: 'Sábado' },
]
</script>
