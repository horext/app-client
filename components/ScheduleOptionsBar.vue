<template>
  <v-container fluid class="pt-0 pb-0">
    <v-row>
      <v-col>
        <v-row align="center" justify="center">
          <v-dialog
            v-model="dialog"
            :close-on-content-click="false"
            :max-width="500"
          >
            <template #activator="{ on, attrs }">
              <v-btn color="indigo" dark v-bind="attrs" v-on="on">
                Exportar
              </v-btn>
            </template>

            <v-card />
          </v-dialog>
        </v-row>
      </v-col>
      <v-col>
        <v-row align="center" justify="center">
          <v-btn outlined> Compartir </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { useVModel } from '@vueuse/core'

export default {
  name: 'ScheduleOptionsBar',
  props: {
    shareDialog: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:shareDialog'],
  setup(props, { emit }) {
    const dialog = useVModel(props, 'shareDialog', emit)
    return {
      dialog,
    }
  },
}
</script>
