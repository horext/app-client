<template>
  <v-data-table
    :headers="headers"
    :items="itemsSync"
    :group-by="[{ key: 'name' }]"
    class="elevation-1"
    show-group-by
  >
    <template #[`item.eventTarget.day`]="{ item }">
      <div>
        {{ item.eventTarget.type }}
        {{ weekDays[item.eventTarget.day] }}
        {{ item.eventTarget.startTime }} - {{ item.eventTarget.endTime }}
      </div>
    </template>
    <template #[`item.eventSource.day`]="{ item }">
      <div>
        {{ item.eventSource.type }}
        {{ weekDays[item.eventSource.day] }}
        {{ item.eventSource.startTime }} - {{ item.eventSource.endTime }}
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useVModel } from '@vueuse/core'
import { WEEK_DAYS_NAMES } from '~/constants/weekdays'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<IIntersectionOccurrence[]>,
      required: true,
    },
  },
  emits: ['update:items'],
  setup(props, { emit }) {
    const itemsSync = useVModel(props, 'items', emit)
    const headers = [
      {
        title: 'Tipo de Incidencia',
        align: 'start',
        value: 'type',
      },
      {
        title: 'Evento A',
        value: 'eventTarget.title',
        groupable: false,
      },
      {
        title: 'Dia A',
        value: 'eventTarget.day',
        groupable: false,
      },
      {
        title: 'Evento B',
        value: 'eventSource.title',
        groupable: false,
      },
      {
        title: 'Dia',
        value: 'eventSource.day',
        groupable: false,
      },
    ] as const
    return {
      weekDays: WEEK_DAYS_NAMES,
      headers,
      itemsSync,
    }
  },
})
</script>

<style scoped></style>
