<template>
  <v-data-table
    :headers="headers"
    :items="itemsSync"
    :group-by="[{ key: 'type' }]"
    class="elevation-1"
    show-group-by
  >
    <template #[`item.elementA.day`]="{ item }">
      <div>
        {{ weekDays[item.elementA.day] }}
        {{ item.elementA.startTime }} - {{ item.elementA.endTime }}
      </div>
    </template>
    <template #[`item.elementB.day`]="{ item }">
      <div>
        {{ weekDays[item.elementB.day] }}
        {{ item.elementB.startTime }} - {{ item.elementB.endTime }}
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useVModel } from '@vueuse/core'
import { WEEK_DAYS } from '~/constants/weekdays'
import type { IOccurrence } from '~/interfaces/ocurrences'

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<IOccurrence[]>,
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
        value: 'elementA.code',
        groupable: false,
      },
      {
        title: 'Dia A',
        value: 'elementA.day',
        groupable: false,
      },
      {
        title: 'Inicio A',
        value: 'elementA.startTime',
        groupable: false,
      },

      {
        title: 'Fin A',
        value: 'elementA.endTime',
        groupable: false,
      },
      {
        title: 'Evento B',
        value: 'elementB.code',
        groupable: false,
      },
      {
        title: 'Dia',
        value: 'elementB.day',
        groupable: false,
      },
      {
        title: 'Inicio B',
        value: 'elementB.startTime',
        groupable: false,
      },
      {
        title: 'Fin B',
        value: 'elementB.endTime',
        groupable: false,
      },
    ] as const
    return {
      weekDays: WEEK_DAYS,
      headers,
      itemsSync,
    }
  },
})
</script>

<style scoped></style>
