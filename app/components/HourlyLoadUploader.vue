<template>
  <v-card class="pa-4" variant="outlined" rounded="lg">
    <v-card-title class="text-h6 d-flex align-center ga-2">
      <v-icon color="primary">mdi-file-excel</v-icon>
      Carga horaria personal
    </v-card-title>
    <v-card-subtitle>
      El archivo se procesa y guarda únicamente en este navegador.
    </v-card-subtitle>

    <v-card-text>
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
        prepend-icon="mdi-paperclip"
        variant="outlined"
        show-size
        clearable
        :loading="isParsing"
        :disabled="isParsing || isSaving"
        @update:model-value="draft = undefined"
      />

      <v-btn
        v-if="selectedFile && !draft"
        color="primary"
        variant="tonal"
        prepend-icon="mdi-file-search"
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
                Fila {{ warning.row }}: {{ warning.message }}
              </li>
            </ul>
          </details>
        </v-alert>

        <v-alert
          v-if="inferenceMessage"
          :type="inferredFacultyId ? 'info' : 'warning'"
          variant="tonal"
          class="mb-3"
        >
          {{ inferenceMessage }}
        </v-alert>

        <v-autocomplete
          v-model="selectedFacultyId"
          :items="faculties"
          item-title="name"
          item-value="id"
          label="Facultad"
          :loading="loadingFaculties"
          :rules="[(value) => !!value || 'Selecciona una facultad']"
        />
        <v-autocomplete
          v-model="selectedSpecialityId"
          :items="specialities"
          item-title="name"
          item-value="id"
          label="Carrera"
          :disabled="!selectedFacultyId"
          :loading="loadingSpecialities"
          :rules="[(value) => !!value || 'Selecciona una carrera']"
        />
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

    <v-card-actions class="justify-end">
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
        prepend-icon="mdi-arrow-right"
        @click="emit('activated', activeDataset)"
      >
        Continuar con esta carga
      </v-btn>
      <v-btn
        v-if="draft"
        color="primary"
        variant="flat"
        prepend-icon="mdi-check"
        :loading="isSaving"
        :disabled="!selectedFacultyId || !selectedSpecialityId"
        @click="activateDraft"
      >
        {{ activeDataset ? 'Reemplazar y usar' : 'Usar esta carga' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { IOrganization } from '~/interfaces/organization'
import type {
  ILocalHourlyLoadDataset,
  ILocalHourlyLoadDraft,
} from '#shared/domain/types/local-hourly-load'
import type { ICourseAffiliationResponse } from '~~/modules/apis/runtime/interfaces/subject'
import { parseLocalHourlyLoad } from '~~/modules/hourly-load-import/runtime/utils/parser'
import {
  useCourseApi,
  useFacultyApi,
  useSpecialityApi,
} from '~~/modules/apis/runtime/composables'

const emit = defineEmits<{
  activated: [dataset: ILocalHourlyLoadDataset]
  removed: []
}>()

const selectedFile = ref<File | null>(null)
const draft = shallowRef<ILocalHourlyLoadDraft>()
const activeDataset = shallowRef<ILocalHourlyLoadDataset>()
const affiliations = shallowRef<ICourseAffiliationResponse[]>([])
const selectedFacultyId = ref<number>()
const selectedSpecialityId = ref<number>()
const inferredFacultyId = ref<number>()
const inferenceMessage = ref('')
const faculties = ref<IOrganization[]>([])
const specialities = ref<IOrganization[]>([])
const loadingFaculties = ref(false)
const loadingSpecialities = ref(false)
const isParsing = ref(false)
const isSaving = ref(false)
const isSuccess = ref(false)
const resultMessage = ref('')

const localHourlyLoad = useLocalHourlyLoad()
const facultyApi = useFacultyApi()
const specialityApi = useSpecialityApi()
const courseApi = useCourseApi()

const sectionCount = (
  dataset: ILocalHourlyLoadDraft | ILocalHourlyLoadDataset,
) =>
  Object.values(dataset.schedulesBySubject).reduce(
    (total, schedules) => total + schedules.length,
    0,
  )

onMounted(async () => {
  activeDataset.value = await localHourlyLoad.ensureLoaded()
  loadingFaculties.value = true
  try {
    faculties.value = await facultyApi.getAll()
  } finally {
    loadingFaculties.value = false
  }
})

watch(selectedFacultyId, async (facultyId) => {
  selectedSpecialityId.value = undefined
  specialities.value = []
  if (!facultyId) return
  loadingSpecialities.value = true
  try {
    specialities.value = await specialityApi.getAllByFaculty(facultyId)
    const inferredSpecialityIds = new Set(
      affiliations.value.flatMap((item) =>
        item.specialities.map(({ id }) => id),
      ),
    )
    const matching = specialities.value.filter(({ id }) =>
      inferredSpecialityIds.has(id),
    )
    if (matching.length === 1) selectedSpecialityId.value = matching[0]?.id
  } finally {
    loadingSpecialities.value = false
  }
})

const inferFaculty = (
  items: ICourseAffiliationResponse[],
  courseCount: number,
) => {
  const matches = new Map<number, number>()
  for (const item of items) {
    for (const faculty of item.faculties)
      matches.set(faculty.id, (matches.get(faculty.id) ?? 0) + 1)
  }
  const ranked = [...matches.entries()].sort((a, b) => b[1] - a[1])
  const best = ranked[0]
  if (!best) {
    inferenceMessage.value =
      'No se pudo inferir la facultad con los planes conocidos. Selecciónala manualmente.'
    return
  }
  const tied = ranked.filter(([, count]) => count === best[1]).length > 1
  const coverage = Math.round((best[1] / courseCount) * 100)
  if (tied) {
    inferenceMessage.value = `La facultad es ambigua (${coverage}% de coincidencia máxima). Confírmala manualmente.`
    return
  }
  inferredFacultyId.value = best[0]
  selectedFacultyId.value = best[0]
  inferenceMessage.value = `Facultad sugerida por coincidencia de códigos de curso (${coverage}%). Confirma antes de continuar.`
}

const analyzeFile = async () => {
  if (!selectedFile.value) return
  isParsing.value = true
  resultMessage.value = ''
  inferredFacultyId.value = undefined
  selectedFacultyId.value = undefined
  selectedSpecialityId.value = undefined
  try {
    draft.value = await parseLocalHourlyLoad(selectedFile.value)
    try {
      affiliations.value = await courseApi.getAffiliations(
        draft.value.subjects.map((subject) => subject.course.id),
      )
      inferFaculty(affiliations.value, draft.value.subjects.length)
    } catch {
      affiliations.value = []
      inferenceMessage.value =
        'No se pudo consultar la clasificación de cursos. Selecciona facultad y carrera manualmente.'
    }
  } catch (error) {
    isSuccess.value = false
    resultMessage.value =
      error instanceof Error ? error.message : 'No se pudo procesar el archivo.'
  } finally {
    isParsing.value = false
  }
}

const activateDraft = async () => {
  if (!draft.value || !selectedFacultyId.value || !selectedSpecialityId.value)
    return
  isSaving.value = true
  const affiliationByCourse = new Map(
    affiliations.value.map((item) => [item.courseId, item]),
  )
  try {
    const dataset: ILocalHourlyLoadDataset = {
      ...draft.value,
      facultyId: selectedFacultyId.value,
      specialityId: selectedSpecialityId.value,
      subjects: draft.value.subjects.map((subject) => {
        const specialityCodes =
          affiliationByCourse
            .get(subject.course.id)
            ?.specialities.filter(
              ({ parentId }) => parentId === selectedFacultyId.value,
            )
            .map(({ code }) => code) ?? []
        return {
          ...subject,
          specialityCodes,
          recommended:
            affiliationByCourse
              .get(subject.course.id)
              ?.specialities.some(
                ({ id }) => id === selectedSpecialityId.value,
              ) ?? false,
        }
      }),
    }
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
