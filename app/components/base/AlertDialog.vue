<template>
  <v-dialog v-model="internalValue" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-headline-medium">
        <slot name="title">
          <v-icon color="red">{{ mdiAlertCircle }}</v-icon>
          {{ title }}
        </slot>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card-text> <slot></slot> </v-card-text>
      <v-card-actions>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="internalValue = false"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { mdiAlertCircle } from '@mdi/js'
withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: 'Atención',
    closeable: false,
  },
)
defineEmits<{
  (event: 'click:confirm' | 'click:reject', value: MouseEvent): void
}>()

const internalValue = defineModel<boolean>('modelValue', {
  default: false,
})
</script>
