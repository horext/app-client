<template>
  <v-container class="py-8 px-4 mx-auto" style="max-width: 1200px">
    <v-row justify="center" density="comfortable">
      <v-col cols="12" class="mb-4">
        <SettingInitial
          ref="initialRef"
          :loading="savingBasic"
          @submit="saveBasicSettings"
        />
        <base-snackbar v-model="successSave">
          La configuración se ha guardado correctamente
        </base-snackbar>
      </v-col>
      <v-col cols="12" class="mb-4">
        <v-card class="pa-4 pa-md-6 rounded-xl border elevation-1" flat>
          <v-card-title class="text-h5 font-weight-bold px-0 pt-0 mb-1">
            Configuración de calendario
          </v-card-title>
          <v-card-subtitle class="px-0 pb-4 text-body-1 text-medium-emphasis">
            Seleccione los días de la semana que desea mostrar en el calendario
          </v-card-subtitle>
          <v-card-text class="px-0 py-2">
            <div class="d-flex flex-wrap ga-3">
              <v-checkbox
                v-for="(day, index) in WEEK_DAYS_NAMES"
                :key="day"
                v-model="internalWeekDays"
                :label="day"
                :value="index"
                multiple
                hide-details
                density="comfortable"
                class="mr-3"
              />
            </div>
          </v-card-text>
          <v-card-actions class="px-0 pt-6 pb-0 justify-end">
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              rounded="lg"
              class="font-weight-bold px-6 text-none"
              @click="save"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12">
        <SettingStorageProtection />
      </v-col>
    </v-row>

    <!-- Modal de confirmación de cambios sin guardar -->
    <v-dialog v-model="showUnsavedDialog" max-width="520" persistent>
      <v-card class="pa-6 rounded-xl">
        <v-card-title
          class="text-h6 font-weight-bold d-flex align-center ga-2 px-0 pt-0"
        >
          <v-icon color="warning" :icon="mdiAlertCircle" />
          Cambios sin guardar
        </v-card-title>
        <v-card-text class="text-body-1 text-medium-emphasis px-0 py-3">
          Has realizado cambios en la configuración que aún no has guardado.
          ¿Qué deseas hacer antes de salir?
        </v-card-text>
        <v-card-actions class="px-0 pt-4 pb-0 justify-end ga-2 flex-wrap">
          <v-btn
            variant="text"
            color="default"
            class="font-weight-medium text-none"
            :disabled="isSavingAndLeaving"
            @click="cancelLeave"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="tonal"
            rounded="lg"
            class="font-weight-bold text-none px-4"
            :disabled="isSavingAndLeaving"
            @click="confirmLeave"
          >
            Salir sin guardar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            rounded="lg"
            class="font-weight-bold text-none px-5"
            :loading="isSavingAndLeaving"
            @click="saveAndLeave"
          >
            Guardar y salir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { mdiAlertCircle } from '@mdi/js'
import SettingInitial from '~/components/setting/Initial.vue'
import SettingStorageProtection from '~/components/setting/StorageProtection.vue'
import { useUserPreferencesStore } from '~/stores/user-preferences'
import { WEEK_DAYS_NAMES } from '~/constants/weekdays'
import type { HourlyLoadSelection } from '~/interfaces/hourly-load-selection'
import type { Weekdays } from '~/interfaces/event'

useSeoMeta({
  title: 'Configuración - Generador de Horarios',
  description:
    'Configura tu generador de horarios para tener una mejor experiencia',
})

const initialRef = ref<InstanceType<typeof SettingInitial> | null>(null)
const store = useUserPreferencesStore()
const { updateBasicSettings } = useUserProfile()
const localHourlyLoad = useLocalHourlyLoad()
const { weekDays } = storeToRefs(store)
const initialWeekDays = ref<Weekdays[]>([...(weekDays.value || [])])
const internalWeekDays = ref<Weekdays[]>([...(weekDays.value || [])])
const isCalendarUserEdited = ref(false)

const isCalendarDirty = computed(() => {
  const current = [...(internalWeekDays.value || [])].sort((a, b) => a - b)
  const saved = [...(initialWeekDays.value || [])].sort((a, b) => a - b)
  return JSON.stringify(current) !== JSON.stringify(saved)
})

watch(
  internalWeekDays,
  () => {
    if (isCalendarDirty.value) {
      isCalendarUserEdited.value = true
    }
  },
  { deep: true },
)

watch(
  weekDays,
  (value) => {
    if (!isCalendarUserEdited.value) {
      initialWeekDays.value = [...(value || [])]
      internalWeekDays.value = [...(value || [])]
    }
  },
  { immediate: true },
)

const isPageDirty = computed(() => {
  return isCalendarDirty.value || (initialRef.value?.isDirty ?? false)
})

const showUnsavedDialog = ref(false)
const isSavingAndLeaving = ref(false)
let resolveNavigation: ((shouldNavigate: boolean) => void) | null = null

onBeforeRouteLeave((_to, _from, next) => {
  if (isPageDirty.value) {
    showUnsavedDialog.value = true
    resolveNavigation = (shouldNavigate: boolean) => {
      showUnsavedDialog.value = false
      next(shouldNavigate)
    }
  } else {
    next()
  }
})

const saveAndLeave = async () => {
  isSavingAndLeaving.value = true
  try {
    if (isCalendarDirty.value) {
      await saveWeekDays(internalWeekDays.value)
    }
    if (initialRef.value?.isDirty) {
      await initialRef.value.submitOfficial()
    }
    successSave.value = true
    if (resolveNavigation) {
      resolveNavigation(true)
      resolveNavigation = null
    }
  } catch {
    if (resolveNavigation) {
      resolveNavigation(false)
      resolveNavigation = null
    }
  } finally {
    isSavingAndLeaving.value = false
  }
}

const confirmLeave = () => {
  if (resolveNavigation) {
    resolveNavigation(true)
    resolveNavigation = null
  }
}

const cancelLeave = () => {
  if (resolveNavigation) {
    resolveNavigation(false)
    resolveNavigation = null
  }
}

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (isPageDirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
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
  initialWeekDays.value = [...internalWeekDays.value]
  isCalendarUserEdited.value = false
}
</script>
