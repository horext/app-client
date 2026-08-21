<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="end">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        icon
        size="small"
        variant="text"
        aria-label="Editar color"
      >
        <v-badge :color="draftColor" />
      </v-btn>
    </template>
    <v-card min-width="260">
      <v-card-title class="text-subtitle-2">{{ title }}</v-card-title>
      <v-card-text class="pt-0">
        <v-color-picker
          v-model="draftColor"
          class="ma-2"
          hide-canvas
          hide-inputs
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="menu = false">Cancelar</v-btn>
        <v-btn color="primary" variant="text" :loading="loading" @click="save">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineOptions({
  name: 'BaseColorEditor',
})

const props = withDefaults(
  defineProps<{
    color: string
    loading?: boolean
    title?: string
  }>(),
  {
    loading: false,
    title: 'Editar color',
  },
)

const emit = defineEmits<{
  save: [color: string]
}>()

const menu = ref(false)
const draftColor = ref(props.color)

watch(
  () => props.color,
  (color) => {
    draftColor.value = color
  },
)

const save = () => {
  emit('save', draftColor.value)
  menu.value = false
}
</script>
