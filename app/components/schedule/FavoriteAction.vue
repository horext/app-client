<template>
  <v-tooltip location="bottom">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        variant="outlined"
        icon
        :color="isFavorite ? 'yellow' : undefined"
        v-bind="tooltipProps"
        @click="toggleFavorite"
      >
        <v-icon :color="isFavorite ? 'yellow' : undefined">
          {{ mdiStar }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{
      isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
    }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { mdiStar } from '@mdi/js'

const props = defineProps<{
  active: boolean
}>()

const emit = defineEmits<{
  (event: 'update:active', value: boolean): void
}>()

const isFavorite = useVModel(props, 'active', emit)

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}
</script>
