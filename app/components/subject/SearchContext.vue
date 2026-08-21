<template>
  <v-card
    variant="tonal"
    class="pa-2"
    aria-label="Contexto de búsqueda de cursos"
  >
    <div class="d-flex flex-wrap align-center ga-2">
      <v-icon icon="mdi-magnify" color="primary" size="small" />
      <span class="text-caption text-medium-emphasis">Buscando en</span>

      <v-chip
        prepend-icon="mdi-school-outline"
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
        icon="mdi-chevron-right"
        size="x-small"
        class="text-medium-emphasis"
      />

      <v-chip
        v-if="studyPlanName"
        prepend-icon="mdi-book-open-page-variant-outline"
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
        prepend-icon="mdi-flag-outline"
        append-icon="mdi-open-in-new"
        class="px-1 ml-auto"
      >
        Informar problema
      </v-btn>

      <v-icon
        v-if="!studyPlanName"
        icon="mdi-information-outline"
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
        prepend-icon="mdi-tune-variant"
        class="px-1"
      >
        Seleccionar plan
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
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
