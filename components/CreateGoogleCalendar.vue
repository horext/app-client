<template>
  <v-card :loading="loading" :disabled="loading">
    <v-card-title class="text-h5"> Crea un nuevo calendario </v-card-title>

    <v-card-text>
      <v-form ref="form">
        <v-text-field
          v-model="calendarCurrent.summary"
          :rules="[(r) => !!r || 'Requerido']"
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn color="green-darken-1" variant="text" @click="$emit('close')">
        Cancelar
      </v-btn>

      <v-btn color="green-darken-1" variant="text" @click="save"> Crear </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components/VForm';
import type { IGoogleCalendarItem } from '~/interfaces/google/calendar'

const props = defineProps<{
  calendar: Pick<IGoogleCalendarItem, 'summary'>
}>()

const emit = defineEmits<{
  (
    event: 'update:calendar',
    calendar: Pick<IGoogleCalendarItem, 'summary'>,
  ): void
  (event: 'close'): void
}>()

const loading = ref(false)
const calendarCurrent = ref({
  summary: '',
})

watch(
  () => props.calendar,
  (calendar) => {
    calendarCurrent.value = calendar
  },
)

const form = ref<VForm>()

const save = () => {
  if (form.value?.validate()) {
    emit('update:calendar', calendarCurrent.value)
  }
}
</script>
