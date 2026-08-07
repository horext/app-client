<template>
  <div class="d-flex align-self-center ga-3">
    <div class="d-flex align-self-center">Modo:</div>
    <v-radio-group v-model="internalMode" hide-details density="compact" inline>
      <v-radio :value="ViewMode.CALENDAR" color="primary-darken-2">
        <template #label>
          <v-icon size="small" start> {{ mdiCalendar }} </v-icon>Calendario
        </template>
      </v-radio>
      <v-radio :value="ViewMode.LIST" color="primary-darken-2">
        <template #label>
          <v-icon size="small" start>
            {{ mdiTable }}
          </v-icon>
          Lista
        </template>
      </v-radio>
    </v-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ViewMode } from '~/models/ViewMode'
import { mdiCalendar, mdiTable } from '@mdi/js'

const internalMode = defineModel<ViewMode>('mode')
</script>
