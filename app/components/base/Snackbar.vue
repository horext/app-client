<template>
  <v-snackbar
    v-model="internalShow"
    :color="color"
    :timeout="timeout"
    location="bottom"
  >
    <slot name="icon">
      <v-icon v-if="icon" left>{{ icon }}</v-icon>
    </slot>
    <slot></slot>
    <template #actions>
      <v-btn variant="text" size="small" icon @click="internalShow = false">
        <v-icon> {{ mdiClose }} </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import {
  mdiClose,
  mdiCheck,
  mdiAlert,
  mdiCloseCircle,
  mdiInformationOutline,
} from '@mdi/js'

defineOptions({
  name: 'BaseSnackbar',
})
export type SnackbarVariant = 'success' | 'error' | 'warning' | 'info'
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    timeout?: number
    variant?: SnackbarVariant
  }>(),
  {
    modelValue: false,
    timeout: 3000,
    variant: 'success',
  },
)
const { variant } = toRefs(props)
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()
const internalShow = useVModel(props, 'modelValue', emit)

const COLOR_MAP: Record<SnackbarVariant, string> = {
  success: 'green',
  error: 'red',
  warning: 'yellow',
  info: 'blue',
}

const color = computed(() => COLOR_MAP[variant.value])

const ICON_MAP: Record<SnackbarVariant, string> = {
  success: mdiCheck,
  error: mdiCloseCircle,
  warning: mdiAlert,
  info: mdiInformationOutline,
}

const icon = computed(() => ICON_MAP[variant.value])
</script>
