<template>
  <v-card class="pa-5 pa-md-6 rounded-xl" variant="outlined">
    <v-card-title
      class="text-h6 font-weight-bold d-flex align-center ga-2 px-0 pt-0 mb-1"
    >
      <v-icon color="primary" :icon="mdiFileExcel" />
      Carga horaria personal
    </v-card-title>
    <v-card-subtitle class="px-0 pb-4 text-body-2 text-medium-emphasis">
      El archivo se procesa y guarda únicamente en este navegador.
    </v-card-subtitle>

    <v-card-text class="px-0 py-2">
      <v-alert v-if="activeDataset" type="info" variant="tonal" class="mb-4">
        <strong>{{ activeDataset.name }}</strong
        ><br />
        {{ activeDataset.subjects.length }} cursos,
        {{ sectionCount(activeDataset) }} secciones y
        {{ activeDataset.sessionCount }} sesiones.
      </v-alert>

      <v-file-input
        v-model="selectedFile"
        label="Seleccionar o arrastrar archivo Excel (.xlsx)"
        accept=".xlsx"
        prepend-icon=""
        :prepend-inner-icon="mdiPaperclip"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        show-size
        clearable
        class="mb-3"
        :loading="isParsing"
        :disabled="isParsing || isSaving"
        @update:model-value="draft = undefined"
      />

      <v-btn
        v-if="selectedFile && !draft"
        color="primary"
        variant="tonal"
        :prepend-icon="mdiFileSearch"
        class="mt-2 font-weight-medium text-none"
        :loading="isParsing"
        @click="analyzeFile"
      >
        Analizar archivo
      </v-btn>

      <template v-if="draft">
        <v-divider class="my-4" />
        <div class="text-subtitle-1 font-weight-medium">Vista previa</div>
        <div class="text-body-2 mb-3">
          {{ draft.subjects.length }} cursos,
          {{ sectionCount(draft) }} secciones y
          {{ draft.sessionCount }} sesiones válidas.
        </div>

        <v-alert
          v-if="draft.rejectedRowCount"
          type="warning"
          variant="tonal"
          class="mb-3"
        >
          Se omitieron {{ draft.rejectedRowCount }} filas. Revisa las
          advertencias antes de confirmar.
          <details v-if="draft.warnings.length" class="mt-2">
            <summary>Ver advertencias</summary>
            <ul class="pl-5 mt-2">
              <li
                v-for="warning in draft.warnings.slice(0, 30)"
                :key="`${warning.row}-${warning.message}`"
              >
                <strong>
                  Fila {{ warning.row }}
                  <template v-if="warning.courseCode">
                    · {{ warning.courseCode }}
                  </template>
                  <template v-if="warning.courseName">
                    — {{ warning.courseName }}
                  </template>
                  <template v-if="warning.section">
                    · Sección {{ warning.section }}
                  </template>
                </strong>
                : {{ warning.message }}
                <div
                  v-if="warning.day || warning.startTime || warning.endTime"
                  class="text-caption"
                >
                  Día: {{ warning.day || 'vacío' }} · Inicio:
                  {{ warning.startTime || 'vacío' }} · Fin:
                  {{ warning.endTime || 'vacío' }}
                </div>
              </li>
            </ul>
          </details>
        </v-alert>
      </template>

      <v-alert
        v-if="resultMessage"
        :type="isSuccess ? 'success' : 'error'"
        variant="tonal"
        class="mt-3"
        closable
        @click:close="resultMessage = ''"
      >
        {{ resultMessage }}
      </v-alert>
    </v-card-text>

    <v-card-actions class="px-0 pt-4 pb-0 justify-end">
      <v-btn
        v-if="activeDataset"
        color="error"
        variant="text"
        :disabled="isSaving"
        @click="removeLoad"
      >
        Eliminar carga local
      </v-btn>
      <v-btn
        v-if="activeDataset && !draft"
        color="primary"
        variant="flat"
        :prepend-icon="mdiArrowRight"
        @click="emit('activated', activeDataset)"
      >
        Continuar con esta carga
      </v-btn>
      <v-btn
        v-if="draft"
        color="primary"
        variant="flat"
        :prepend-icon="mdiCheck"
        :loading="isSaving"
        @click="activateDraft"
      >
        {{ activeDataset ? 'Reemplazar y usar' : 'Usar esta carga' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import {
  mdiFileExcel,
  mdiPaperclip,
  mdiFileSearch,
  mdiArrowRight,
  mdiCheck,
} from '@mdi/js'
import type {
  ILocalHourlyLoadDataset,
  ILocalHourlyLoadDraft,
} from '#shared/domain/types/local-hourly-load'
import { parseLocalHourlyLoad } from '~~/modules/hourly-load-import/runtime/utils/parser'

const emit = defineEmits<{
  activated: [dataset: ILocalHourlyLoadDataset]
  removed: []
}>()

const selectedFile = ref<File | null>(null)
const draft = shallowRef<ILocalHourlyLoadDraft>()
const activeDataset = shallowRef<ILocalHourlyLoadDataset>()
const isParsing = ref(false)
const isSaving = ref(false)
const isSuccess = ref(false)
const resultMessage = ref('')

const localHourlyLoad = useLocalHourlyLoad()

const sectionCount = (
  dataset: ILocalHourlyLoadDraft | ILocalHourlyLoadDataset,
) =>
  Object.values(dataset.schedulesBySubject).reduce(
    (total, schedules) => total + schedules.length,
    0,
  )

onMounted(async () => {
  activeDataset.value = await localHourlyLoad.ensureLoaded()
})

const analyzeFile = async () => {
  if (!selectedFile.value) return
  isParsing.value = true
  resultMessage.value = ''
  try {
    draft.value = await parseLocalHourlyLoad(selectedFile.value)
  } catch (error) {
    isSuccess.value = false
    resultMessage.value =
      error instanceof Error ? error.message : 'No se pudo procesar el archivo.'
  } finally {
    isParsing.value = false
  }
}

const activateDraft = async () => {
  if (!draft.value) return
  isSaving.value = true
  try {
    const dataset: ILocalHourlyLoadDataset = draft.value
    await localHourlyLoad.activate(dataset)
    activeDataset.value = dataset
    draft.value = undefined
    selectedFile.value = null
    isSuccess.value = true
    resultMessage.value = 'La carga personal quedó activa en este navegador.'
    emit('activated', dataset)
  } catch (error) {
    isSuccess.value = false
    resultMessage.value =
      error instanceof Error
        ? error.message
        : 'No se pudo guardar la carga personal.'
  } finally {
    isSaving.value = false
  }
}

const removeLoad = async () => {
  await localHourlyLoad.clear()
  activeDataset.value = undefined
  isSuccess.value = true
  resultMessage.value = 'La carga local fue eliminada de este navegador.'
  emit('removed')
}
</script>
