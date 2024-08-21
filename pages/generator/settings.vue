<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <SettingInitial />
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title> Configuración de calendario </v-card-title>
          <v-card-subtitle>
            Seleccione los días de la semana que desea mostrar en el calendario
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-checkbox
                  v-for="day in WEEK_DAYS_NAMES"
                  :key="day"
                  :label="day"
                  multiple
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="save">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SettingInitial from '~/components/setting/Initial.vue'
import { useUserConfigStore } from '~/stores/user-config'
import { WEEK_DAYS_NAMES } from '~/constants/weekdays'

const store = useUserConfigStore()

const save = () => {}
</script>
