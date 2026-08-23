<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <SettingInitial :loading="savingBasic" @submit="saveBasicSettings" />
        </v-card>
        <base-snackbar v-model="successSave">
          La configuración se ha guardado correctamente
        </base-snackbar>
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
                  v-for="(day, index) in WEEK_DAYS_NAMES"
                  :key="day"
                  v-model="internalWeekDays"
                  :label="day"
                  :value="index"
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
      <v-col cols="12">
        <SettingStorageProtection />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SettingInitial from '~/components/setting/Initial.vue'
import SettingStorageProtection from '~/components/setting/StorageProtection.vue'
import { useUserPreferencesStore } from '~/stores/user-preferences'
import { WEEK_DAYS_NAMES } from '~/constants/weekdays'
import type { HourlyLoadSelection } from '~/interfaces/hourly-load-selection'

useSeoMeta({
  title: 'Configuración - Generador de Horarios',
  description:
    'Configura tu generador de horarios para tener una mejor experiencia',
})

const store = useUserPreferencesStore()
const { updateBasicSettings } = useUserProfile()
const localHourlyLoad = useLocalHourlyLoad()
const { weekDays } = storeToRefs(store)
const internalWeekDays = ref(weekDays.value)
watch(weekDays, (value) => {
  internalWeekDays.value = value
})

const savingBasic = ref(false)
const successSave = ref(false)
const saveBasicSettings = async (selection: HourlyLoadSelection) => {
  savingBasic.value = true
  try {
    if (selection.source === 'local') {
      await navigateTo('/generator/subjects')
      return
    }
    await localHourlyLoad.clear()
    await updateBasicSettings(
      selection.facultyId,
      selection.specialityId,
      selection.hourlyLoad,
      selection.studyPlanId,
    )
    successSave.value = true
  } finally {
    savingBasic.value = false
  }
}

const { saveWeekDays } = useUserPreferences()
const save = async () => {
  await saveWeekDays(internalWeekDays.value)
}
</script>
