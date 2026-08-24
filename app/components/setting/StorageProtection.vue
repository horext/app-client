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
        Chrome no concedió la protección por ahora. Puedes volver a intentarlo
        más adelante.
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        :loading="status === StorageProtectionStatus.CHECKING"
        :prepend-icon="mdiRefresh"
        variant="text"
        @click="check"
      >
        Comprobar estado
      </v-btn>
      <v-btn
        v-if="status === StorageProtectionStatus.UNPROTECTED"
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
import { StorageProtectionStatus } from '~/models/StorageProtectionStatus'

const { status, requesting, requestFailed, check, request } =
  usePersistentStorage()

const statusLabel = computed(() => {
  switch (status.value) {
    case StorageProtectionStatus.PROTECTED:
      return 'Protegido'
    case StorageProtectionStatus.UNPROTECTED:
      return 'No protegido'
    case StorageProtectionStatus.UNSUPPORTED:
      return 'No compatible'
    default:
      return 'Comprobando…'
  }
})
const statusColor = computed(() => {
  if (status.value === StorageProtectionStatus.PROTECTED) return 'success'
  if (status.value === StorageProtectionStatus.UNPROTECTED) return 'warning'
  return 'default'
})

onMounted(check)
</script>
