<template>
  <v-card :loading="loading" :disabled="loading">
    <v-card-title class="headline">
      Crea un nuevo calendario
    </v-card-title>

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

      <v-btn color="green darken-1" text @click="$emit('close')">
        Cancelar
      </v-btn>

      <v-btn color="green darken-1" text @click="save">
        Crear
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { VForm } from '~/types'

export default defineComponent({
  props: {
    result: {
      type: Boolean,
      required: true
    },
    calendar: {
      type: Object as PropType<any>,
      required: true
    }
  },
  emits: ['update:calendar', 'update:result'],
  setup (props, { emit }) {
    const resultSync = computed({
      get () {
        return props.result
      },
      set (result) {
        emit('update:result', result)
      }
    })

    const loading = ref(false)
    const calendarCurrent = ref({
      summary: ''
    })

    watch(
      () => props.calendar,
      (calendar) => {
        calendarCurrent.value = calendar
      }
    )

    const form = ref<VForm>()

    const save = () => {
      if (form.value?.validate()) {
        emit('update:calendar', calendarCurrent.value)
      }
    }

    return { resultSync, loading, calendarCurrent, form, save }
  }
})
</script>
