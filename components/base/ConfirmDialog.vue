<template>
  <v-dialog v-model="internalValue" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        <slot name="title"> {{ title }} </slot>
      </v-card-title>
      <v-card-text> <slot></slot> </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue-darken-1"
          variant="flat"
          @click="emit('click:reject', $event)"
        >
          {{ rejectText }}
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="emit('click:confirm', $event)"
        >
          {{ confirmText }}
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="closeable"
          color="blue-darken-1"
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
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    confirmText?: string
    rejectText?: string
    closeable?: boolean
  }>(),
  {
    modelValue: false,
    title: 'Atención',
    confirmText: 'Si',
    rejectText: 'No',
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
