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
          <v-textarea
            v-model="internalEvent.description"
            label="Descripcion"
            rows="3"
            auto-grow
          />
          <v-checkbox
            v-model="internalEvent.allowOverlap"
            color="primary"
            label="Permitir superposición con otras actividades o sesiones de clases"
            hide-details
          />
          <div
            v-for="(session, index) in internalEvent.sessions"
            :key="index"
            class="mb-4"
          >
            <div class="d-flex align-center">
              <strong>Sesión {{ index + 1 }}</strong>
              <v-spacer />
              <v-btn
                v-if="internalEvent.sessions.length > 1"
                icon="mdi-delete"
                size="small"
                variant="text"
                aria-label="Eliminar sesión"
                @click="removeSession(index)"
              />
            </div>
            <v-autocomplete
              v-model="session.day"
              :items="weekdays"
              item-value="index"
              item-title="value"
              label="Día"
              :rules="[rules.requiredDay]"
            />
            <div class="d-flex ga-3">
              <v-text-field
                v-model="session.startTime"
                label="Hora de Inicio"
                type="time"
                :rules="sessionStartRules(session)"
              />
              <v-text-field
                v-model="session.endTime"
                label="Hora de Fin"
                type="time"
                :rules="sessionEndRules(session)"
              />
            </div>
          </div>
          <v-btn prepend-icon="mdi-plus" variant="tonal" @click="addSession"
            >Agregar sesión</v-btn
          >
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
import type { VForm } from 'vuetify/components/VForm'
import type {
  IActivity,
  IActivitySession,
  IBaseActivity,
} from '~/interfaces/event'
import { ActivityForm } from '~/models/Activity'

const _props = withDefaults(
  defineProps<{
    event: IActivity | null
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)

const emit = defineEmits<{
  (name: 'save:event', event: IBaseActivity & { id?: IActivity['id'] }): void
  (name: 'cancel'): void
}>()

const dialog = defineModel<boolean>()

const { event } = toRefs(_props)

const internalEvent = ref(new ActivityForm())

watch(
  event,
  (newVal) => {
    if (newVal) {
      internalEvent.value = new ActivityForm(newVal)
    } else {
      internalEvent.value = new ActivityForm()
    }
  },
  { immediate: true },
)

const rules = computed(() => ({
  required: (value: unknown) => !!value || 'Requerido.',
  requiredDay: (value: number) => (value >= 0 && value <= 6) || 'Requerido.',
}))

const sessionStartRules = (session: IActivitySession) => [
  (value: unknown) => !!value || 'Requerido.',
  (value: string) =>
    value < session.endTime || 'Tiene que ser menor que el fin',
]

const sessionEndRules = (session: IActivitySession) => [
  (value: unknown) => !!value || 'Requerido.',
  (value: string) =>
    value > session.startTime || 'Tiene que ser mayor que el inicio',
]

const addSession = () => {
  internalEvent.value.sessions.push({
    day: 1,
    startTime: '08:00',
    endTime: '10:00',
  })
}

const removeSession = (index: number) => {
  internalEvent.value.sessions.splice(index, 1)
}

const form = ref<VForm>()

const save = async () => {
  const validate = await form.value?.validate()
  if (!validate?.valid) return
  emit(
    'save:event',
    internalEvent.value.id
      ? internalEvent.value.toUpdateRequest()
      : internalEvent.value.toCreateRequest(),
  )
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
