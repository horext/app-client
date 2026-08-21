<template>
  <v-card variant="tonal" class="pa-3">
    <div class="text-body-2">
      <span class="text-medium-emphasis">Buscando cursos en:</span>
      <span class="font-weight-medium ml-1">{{ location }}</span>
      <v-chip color="primary" variant="tonal" size="x-small" class="ml-2">
        {{ studyPlanName ? 'Plan de estudios' : 'Especialidad' }}
      </v-chip>
    </div>
    <div v-if="!studyPlanName" class="text-caption text-medium-emphasis mt-1">
      Selecciona un plan de estudios para obtener resultados más precisos.
      <v-btn
        to="/generator/settings"
        variant="plain"
        density="compact"
        size="small"
        class="px-1"
      >
        Seleccionar plan
      </v-btn>
    </div>
    <div v-else-if="reportUrl" class="mt-2">
      <v-btn
        :href="reportUrl"
        target="_blank"
        rel="noopener noreferrer"
        variant="text"
        density="compact"
        size="small"
        prepend-icon="mdi-alert-circle-outline"
        class="px-1"
      >
        Reportar datos incorrectos
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  specialityName: string
  studyPlanName?: string
  reportUrl?: string
}>()

const location = computed(() =>
  props.studyPlanName
    ? `${props.specialityName} · ${props.studyPlanName}`
    : props.specialityName,
)
</script>
