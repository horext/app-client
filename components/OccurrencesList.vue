<template>
  <v-data-table
    :headers="headers"
    :items="itemsSync"
    group-by="type"
    class="elevation-1"
    show-group-by
  >
    <template #item[`elementA.day`]="{ item }">
      <div>{{ item.elementA.start }} - {{ item.elementA.end }}</div>
    </template>
    <template #item[`elementB.day`]="{item}">
      <div>
        {{ item.elementB.start }} - {{ item.elementB.end }}
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useVModel } from '@vueuse/core'
import { weekDays } from '@/utils/core'

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  emits: ['update:items'],
  setup (props, { emit }) {
    const itemsSync = useVModel(props, 'items', emit)
    const headers = [
      {
        text: 'Tipo de Incidencia',
        align: 'start',
        value: 'type'
      },
      {
        text: 'Evento A',
        value: 'elementA.code',
        groupable: false
      },
      {
        text: 'Dia A',
        value: 'elementA.day',
        groupable: false
      },
      {
        text: 'Inicio A',
        value: 'elementA.startTime',
        groupable: false
      },

      {
        text: 'Fin A',
        value: 'elementA.endTime',
        groupable: false
      },
      {
        text: 'Evento B',
        value: 'elementB.code',
        groupable: false
      },
      {
        text: 'Dia',
        value: 'elementB.day',
        groupable: false
      },
      {
        text: 'Inicio B',
        value: 'elementB.startTime',
        groupable: false
      },
      {
        text: 'Fin B',
        value: 'elementB.endTime',
        groupable: false
      }
    ]
    return {
      weekDays,
      headers,
      itemsSync
    }
  }
})
</script>

<style scoped></style>
