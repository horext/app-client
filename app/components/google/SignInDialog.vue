<template>
  <v-dialog :model-value="modelValue" max-width="420" @update:model-value="emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="text-center pt-6">
        <v-icon size="48" color="primary">{{ mdiCalendarSync }}</v-icon>
        <div class="text-h6 font-weight-bold mt-2">Exportar a Google Calendar</div>
      </v-card-title>

      <v-card-text>
        <p class="text-body-2 text-center text-medium-emphasis mb-4">
          Para exportar tu horario necesitamos acceso a tu Google Calendar.
          Se te pedirá autorizar los siguientes permisos:
        </p>
        <v-list density="compact" lines="two">
          <v-list-item :prepend-icon="mdiCalendarMultiple">
            <v-list-item-title class="text-body-2 font-weight-medium">Ver tus calendarios</v-list-item-title>
            <v-list-item-subtitle class="text-caption">Para mostrarte la lista de calendarios disponibles</v-list-item-subtitle>
          </v-list-item>
          <v-list-item :prepend-icon="mdiCalendarPlus">
            <v-list-item-title class="text-body-2 font-weight-medium">Crear eventos en tu calendario</v-list-item-title>
            <v-list-item-subtitle class="text-caption">Para agregar los cursos de tu horario generado</v-list-item-subtitle>
          </v-list-item>
          <v-list-item :prepend-icon="mdiCalendarCheck">
            <v-list-item-title class="text-body-2 font-weight-medium">Crear un calendario secundario</v-list-item-title>
            <v-list-item-subtitle class="text-caption">Opcional: un calendario "Horext" separado del principal</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <p class="text-caption text-medium-emphasis text-center mt-3">
          Horext no almacena tu token de acceso. Puedes revocar el permiso en cualquier momento desde
          <a href="https://myaccount.google.com/permissions" target="_blank">myaccount.google.com/permissions</a>.
        </p>
      </v-card-text>

      <v-card-actions class="d-flex flex-column ga-2 pb-6 px-6">
        <v-btn
          color="primary"
          size="large"
          variant="flat"
          rounded
          block
          :prepend-icon="mdiGoogle"
          :loading="isPendingToken"
          @click="handleSignIn"
        >
          Autorizar acceso a Google Calendar
        </v-btn>
        <v-btn
          size="small"
          variant="text"
          block
          @click="emit('update:modelValue', false)"
        >
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { mdiCalendarSync, mdiCalendarMultiple, mdiCalendarPlus, mdiCalendarCheck, mdiGoogle } from '@mdi/js'



defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'signed-in': []
}>()

const { getToken, isSignedIn, isPendingToken } = useGoogleOAuth2()

function handleSignIn() {
  emit('update:modelValue', false)
  getToken()
}

watch(isSignedIn, (value) => {
  if (value) {
    emit('update:modelValue', false)
    emit('signed-in')
  }
})
</script>
