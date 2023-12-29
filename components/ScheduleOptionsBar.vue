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
            <template #activator="{ props }">
              <v-btn color="indigo" theme="dark" v-bind="props">
                Exportar
              </v-btn>
            </template>

            <v-card />
          </v-dialog>
        </v-row>
      </v-col>
      <v-col>
        <v-row align="center" justify="center">
          <v-btn variant="outlined"> Compartir </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useVModel } from '@vueuse/core'

export default defineComponent({
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
})
</script>
