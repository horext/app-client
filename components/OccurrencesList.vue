<template>
  <v-data-table
    :headers="headers"
    :items="itemsSync"
    group-by="type"
    class="elevation-1"
    show-group-by
  >
    <template #item.elementA.day="{item}">
      <div>
        {{ weekDays[item.elementA.day].value }}
      </div>
    </template>
    <template #item.elementB.day="{item}">
      <div>
        {{ weekDays[item.elementB.day].value }}
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { weekDays } from '@/utils/core'
import { Vue, PropSync, Component } from 'nuxt-property-decorator'
@Component
export default class OccurrencesList extends Vue {
  @PropSync('items', { type: Array })
  itemsSync!:Array<any>

  weekDays:any = weekDays
  headers = [
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
}
</script>

<style scoped>

</style>
