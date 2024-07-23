<template>
  <v-dialog v-model="internalValue" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5">
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
          @click="emit('update:modelValue', false)"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { mdiAlertCircle } from '@mdi/js'
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
  }>(),
  {
    modelValue: false,
    title: 'Atención',
    closeable: false,
  },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'click:confirm', value: MouseEvent): void
  (event: 'click:reject', value: MouseEvent): void
}>()

const internalValue = useVModel(props, 'modelValue', emit)
</script>
