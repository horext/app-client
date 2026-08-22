<template>
  <v-card>
    <v-card-title>Almacenamiento local</v-card-title>
    <v-card-subtitle>
      Controla la protección de los datos guardados en este dispositivo.
    </v-card-subtitle>
    <v-card-text>
      <v-chip :color="statusColor" variant="tonal">
        {{ statusLabel }}
      </v-chip>
      <p class="mt-3">
        La protección reduce el riesgo de que el navegador elimine
        automáticamente tus horarios y preferencias cuando necesite espacio. Aun
        así, puedes borrar los datos manualmente desde el navegador.
      </p>
      <v-alert v-if="requestFailed" class="mt-3" type="warning" variant="tonal">
        <template v-if="isStandalone">
          Chrome decidió no conceder la protección. No existe un permiso manual;
          vuelve a intentarlo después de usar más la aplicación.
        </template>
        <template v-else>
          Chrome decidió no conceder la protección. Instala y abre Horext desde
          el icono de instalación del navegador antes de volver a intentarlo.
        </template>
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        :loading="status === 'checking'"
        :prepend-icon="mdiRefresh"
        variant="text"
        @click="check"
      >
        Comprobar estado
      </v-btn>
      <v-btn
        v-if="status === 'unprotected'"
        color="primary"
        :loading="requesting"
        @click="request"
      >
        Activar protección
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { mdiRefresh } from '@mdi/js'

const { status, isStandalone, requesting, requestFailed, check, request } =
  usePersistentStorage()

const statusLabel = computed(() => {
  switch (status.value) {
    case 'protected':
      return 'Protegido'
    case 'unprotected':
      return 'No protegido'
    case 'unsupported':
      return 'No compatible'
    default:
      return 'Comprobando…'
  }
})
const statusColor = computed(() => {
  if (status.value === 'protected') return 'success'
  if (status.value === 'unprotected') return 'warning'
  return 'default'
})

onMounted(check)
</script>
