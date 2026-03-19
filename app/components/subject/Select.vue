<template>
  <v-autocomplete
    id="search-course"
    v-model="selectedSubject"
    v-model:search="search"
    v-model:menu="openSearchMenu"
    variant="outlined"
    :items="subjects"
    label="Buscar cursos"
    return-object
    no-filter
    hide-details
    item-title="course.name"
    item-value="id"
    :loading="statusSubjects === 'pending'"
    :no-data-text="
      statusSubjects === 'error'
        ? 'Error al buscar cursos'
        : search
          ? statusSubjects === 'pending'
            ? 'Buscando cursos...'
            : 'No se encontraron cursos'
          : 'Escribe el nombre del curso'
    "
  >
    <template #selection="{ item }">
      <v-list-item
        v-if="item"
        :title="`${item?.course?.id} - ${item?.course?.name}`"
        :subtitle="`Ciclo: ${item?.cycle} | ${item?.type?.name}`"
      />
    </template>
    <template #item="{ props, item }">
      <v-list-item
        v-bind="props"
        :title="`${item?.course?.id} - ${item?.course?.name}`"
        :subtitle="`Ciclo: ${item?.cycle} | ${item?.type?.name}`"
      />
    </template>
    <template #append>
      <label for="search-course">
        <v-progress-circular
          v-if="statusSubjects === 'pending'"
          size="20"
          indeterminate
          color="primary"
        />
        <v-icon v-else color="primary">{{ mdiMagnify }}</v-icon>
      </label>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'
import type { ISubject } from '~/interfaces/subject'

defineProps<{
  subjects: ISubject[]
  statusSubjects: 'idle' | 'pending' | 'success' | 'error'
}>()
const search = defineModel<string>('search')
const openSearchMenu = defineModel<boolean>('menu')
const selectedSubject = defineModel<ISubject>('modelValue')
</script>
