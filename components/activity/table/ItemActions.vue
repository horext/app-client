<template>
  <v-tooltip location="bottom">
    <template #activator="{ props }">
      <v-btn
        color="blue"
        variant="tonal"
        rounded="full"
        size="small"
        :icon="mdiPencil"
        v-bind="props"
        @click="emit('click:edit', $event)"
      />
    </template>
    <span>Editar Actividad</span>
  </v-tooltip>
  <v-tooltip location="bottom">
    <template #activator="{ props }">
      <v-btn
        color="red"
        variant="tonal"
        rounded="full"
        size="small"
        :icon="mdiDelete"
        v-bind="props"
        @click="emit('click:delete', $event)"
      />
    </template>
    <span>Eliminar Actividad</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { mdiPencil, mdiDelete } from '@mdi/js'

const emit = defineEmits<{
  (type: 'click:edit', item: MouseEvent): void
  (type: 'click:delete', item: MouseEvent): void
}>()
</script>
