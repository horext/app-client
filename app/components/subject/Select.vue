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
      >
        <template #subtitle>
          <span v-if="item.cycle">Ciclo: {{ item.cycle }}</span>
          <span v-if="item.type?.name"> · {{ item.type.name }}</span>
          <span v-if="item.specialityCodes?.length" class="ml-2">
            <v-chip
              v-for="code in item.specialityCodes"
              :key="code"
              size="x-small"
              variant="tonal"
              class="mr-1"
            >
              {{ code }}
            </v-chip>
          </span>
          <v-chip
            v-if="item.recommended === false"
            size="x-small"
            color="warning"
            variant="tonal"
          >
            Fuera de tu malla
          </v-chip>
        </template>
      </v-list-item>
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
