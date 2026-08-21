<template>
  <v-card
    variant="tonal"
    class="pa-2"
    aria-label="Contexto de búsqueda de cursos"
  >
    <div class="d-flex flex-wrap align-center ga-2">
      <v-icon :icon="mdiMagnify" color="primary" size="small" />
      <span class="text-caption text-medium-emphasis">Buscando en</span>

      <v-chip
        :prepend-icon="mdiSchoolOutline"
        color="primary"
        variant="outlined"
        size="small"
        class="search-context__chip"
      >
        <span class="text-medium-emphasis">Especialidad:</span>
        <span class="font-weight-medium ml-1">{{ specialityName }}</span>
      </v-chip>

      <v-icon
        v-if="studyPlanName"
        :icon="mdiChevronRight"
        size="x-small"
        class="text-medium-emphasis"
      />

      <v-chip
        v-if="studyPlanName"
        :prepend-icon="mdiBookOpenPageVariantOutline"
        color="primary"
        variant="tonal"
        size="small"
        class="search-context__chip"
      >
        <span class="text-medium-emphasis">Plan:</span>
        <span class="font-weight-medium ml-1">{{ studyPlanName }}</span>
      </v-chip>

      <v-btn
        v-if="studyPlanName && reportUrl"
        :href="reportUrl"
        target="_blank"
        rel="noopener noreferrer"
        variant="text"
        density="compact"
        size="small"
        :prepend-icon="mdiFlagOutline"
        :append-icon="mdiOpenInNew"
        class="px-1 ml-auto"
      >
        Informar problema
      </v-btn>

      <v-icon
        v-if="!studyPlanName"
        :icon="mdiInformationOutline"
        size="small"
        class="text-medium-emphasis"
      />
      <span v-if="!studyPlanName" class="text-caption text-medium-emphasis">
        Selecciona un plan para mejorar la precisión.
      </span>
      <v-btn
        v-if="!studyPlanName"
        to="/generator/settings"
        variant="plain"
        density="compact"
        size="small"
        :prepend-icon="mdiTuneVariant"
        class="px-1"
      >
        Seleccionar plan
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import {
  mdiBookOpenPageVariantOutline,
  mdiChevronRight,
  mdiFlagOutline,
  mdiInformationOutline,
  mdiMagnify,
  mdiOpenInNew,
  mdiSchoolOutline,
  mdiTuneVariant,
} from '@mdi/js'

defineProps<{
  specialityName: string
  studyPlanName?: string
  reportUrl?: string
}>()
</script>

<style scoped>
.search-context__chip {
  height: auto;
  min-height: 1.75rem;
  max-width: 100%;
  white-space: normal;
}
</style>
