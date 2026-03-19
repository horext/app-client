<template>
  <v-text-field
    v-model.number="internalCrossings"
    class="flex-sm-1-1 flex-1-1-100 cross-input"
    label="Cantidad de cruces"
    hide-details
    density="compact"
    max="5"
    min="0"
    type="number"
  >
    <template #append-inner>
      <v-menu bottom>
        <template #activator="{ props: activatorProps }">
          <v-icon v-bind="activatorProps">
            {{ mdiHelpCircle }}
          </v-icon>
        </template>
        <v-card max-width="300" density="compact">
          <v-card-text>
            Solo se contabiliza los cruces entre cursos y los horarios con
            cruces entre Práctica y Práctica no se muestran.
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-text-field>
  <v-btn
    color="success"
    theme="dark"
    rounded
    variant="flat"
    density="comfortable"
    :loading="loadingGenerate"
    @click="onClickGenerate"
  >
    <v-icon> {{ mdiUpdate }} </v-icon>
    Generar
  </v-btn>
</template>

<script setup lang="ts">
import { mdiHelpCircle, mdiUpdate } from '@mdi/js'
const props = defineProps<{
  loadingGenerate: boolean
  crossings: number
}>()
const emit = defineEmits<{
  (event: 'click:generate'): void
  (event: 'update:crossings', value: number): void
}>()

const internalCrossings = useVModel(props, 'crossings', emit)

const onClickGenerate = () => {
  emit('click:generate')
}
</script>
