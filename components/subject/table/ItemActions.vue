<template>
  <v-tooltip location="bottom">
    <template #activator="{ props }">
      <v-icon color="blue" v-bind="props" @click="emit('click:edit', $event)">
        {{ mdiPencil }}
      </v-icon>
    </template>
    <span>Modificar secciones</span>
  </v-tooltip>
  <v-tooltip location="bottom">
    <template #activator="{ props }">
      <v-icon color="red" v-bind="props" @click="emit('click:delete', $event)">
        {{ mdiDelete }}
      </v-icon>
    </template>
    <span>Eliminar</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { mdiPencil, mdiDelete } from '@mdi/js'

const emit = defineEmits<{
  (type: 'click:edit', item: MouseEvent): void
  (type: 'click:delete', item: MouseEvent): void
}>()
</script>
