<template>
  <v-card
    :loading="loading"
    class="pa-6 pa-md-8 rounded-xl border elevation-1"
    flat
  >
    <v-card-title class="text-h5 font-weight-bold px-0 pt-0 mb-1"
      >Configuración académica</v-card-title
    >
    <v-card-subtitle class="px-0 pb-6 text-body-1 text-medium-emphasis">
      Elige una carga oficial o importa una carga personal.
    </v-card-subtitle>
    <v-card-text class="px-0 py-0">
      <v-btn-toggle
        v-model="source"
        mandatory
        color="primary"
        variant="outlined"
        divided
        class="mb-6 rounded-lg w-100 d-flex"
      >
        <v-btn
          value="official"
          :prepend-icon="mdiCloudDownload"
          class="flex-1 font-weight-medium text-none py-3"
          >Carga oficial</v-btn
        >
        <v-btn
          value="local"
          :prepend-icon="mdiFileExcel"
          class="flex-1 font-weight-medium text-none py-3"
          >Importar Excel</v-btn
        >
      </v-btn-toggle>

      <v-alert
        v-if="source === 'official' && facultyLoadError"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ facultyLoadError }}
        <template #append>
          <v-btn variant="text" @click="loadFaculties">Reintentar</v-btn>
        </template>
      </v-alert>

      <v-form
        v-if="source === 'official'"
        ref="form"
        @submit.prevent="submitOfficial"
      >
        <v-row density="comfortable">
          <v-col cols="12" sm="6">
            <v-autocomplete
              v-model="facultyId"
              :items="faculties"
              :loading="loadingFaculties"
              item-title="name"
              item-value="id"
              label="Facultad"
              variant="outlined"
              density="comfortable"
              :rules="[(value) => !!value || 'Selecciona una facultad']"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-select
              v-model="hourlyLoadId"
              :items="hourlyLoadOptions"
              :loading="loadingHourlyLoads"
              :disabled="!facultyId || hourlyLoads.length === 0"
              item-title="title"
              item-value="value"
              label="Carga horaria"
              variant="outlined"
              density="comfortable"
              hint="Puedes utilizar una carga de un ciclo anterior"
              persistent-hint
              :rules="[(value) => !!value || 'Selecciona una carga horaria']"
            />
          </v-col>

          <v-col
            v-if="facultyId && !loadingHourlyLoads && hourlyLoads.length === 0"
            cols="12"
          >
            <v-alert type="warning" variant="tonal" class="mb-4">
              No existe una carga oficial publicada para esta facultad. Puedes
              importar la carga que tengas en Excel.
              <template #append>
                <v-btn variant="text" @click="source = 'local'">Importar</v-btn>
              </template>
            </v-alert>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              v-model="specialityId"
              :items="specialities"
              :loading="loadingSpecialities"
              :disabled="!facultyId"
              item-title="name"
              item-value="id"
              label="Carrera (opcional)"
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              v-model="studyPlanId"
              :disabled="!specialityId"
              item-value="id"
              :loading="loadingStudyPlans"
              :item-title="studyPlanTitle"
              :items="studyPlans"
              label="Plan de estudios"
              placeholder="Plan de estudios (opcional)"
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>
        </v-row>

        <div class="d-flex justify-end mt-6">
          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            size="large"
            rounded="lg"
            class="font-weight-bold px-8 text-none"
            :loading="loading"
            :disabled="hourlyLoads.length === 0"
            >{{ submitText }}</v-btn
          >
        </div>
      </v-form>
      <HourlyLoadUploader v-else @activated="submitLocal" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { mdiCloudDownload, mdiFileExcel } from '@mdi/js'
import type { VForm } from 'vuetify/components/VForm'
import type { IOrganization } from '~/interfaces/organization'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { HourlyLoadSelection } from '~/interfaces/hourly-load-selection'
import type { ILocalHourlyLoadDataset } from '#shared/domain/types/local-hourly-load'
import {
  useFacultyApi,
  useHourlyLoadApi,
  useSpecialityApi,
  useStudyPlanApi,
} from '~~/modules/apis/runtime/composables'

withDefaults(
  defineProps<{
    loading?: boolean
    submitText?: string
  }>(),
  {
    submitText: 'Guardar',
  },
)
const emit = defineEmits<{ submit: [selection: HourlyLoadSelection] }>()
const source = ref<'official' | 'local'>('official')
const form = ref<VForm>()
const store = useUserProfileStore()
const facultyId = ref(store.facultyId)
const specialityId = ref(store.specialityId)
const studyPlanId = ref(store.studyPlanId)
const hourlyLoadId = ref(store.hourlyLoad?.id)
const faculties = ref<IOrganization[]>([])
const specialities = ref<IOrganization[]>([])
const studyPlans = ref<Array<{ id: number; code: string; name?: string }>>([])
const hourlyLoads = ref<IHourlyLoad[]>([])
const loadingFaculties = ref(false)
const loadingSpecialities = ref(false)
const loadingStudyPlans = ref(false)
const loadingHourlyLoads = ref(false)
const facultyLoadError = ref('')
const facultyApi = useFacultyApi()
const specialityApi = useSpecialityApi()
const studyPlanApi = useStudyPlanApi()
const hourlyLoadApi = useHourlyLoadApi()

const initialSource = ref<'official' | 'local'>('official')
const initialFacultyId = ref<number | undefined>(undefined)
const initialSpecialityId = ref<number | undefined>(undefined)
const initialStudyPlanId = ref<number | undefined>(undefined)
const initialHourlyLoadId = ref<number | undefined>(undefined)
const isInitializing = ref(true)

function captureInitialState() {
  initialSource.value = source.value
  initialFacultyId.value = facultyId.value
  initialSpecialityId.value = specialityId.value ?? undefined
  initialStudyPlanId.value = studyPlanId.value ?? undefined
  initialHourlyLoadId.value = hourlyLoadId.value ?? undefined
}

const hourlyLoadOptions = computed(() =>
  hourlyLoads.value.map((load) => ({
    value: load.id,
    title: `${load.name} · ${new Date(load.publishedAt).toLocaleDateString('es-PE')}`,
  })),
)
const studyPlanTitle = (plan: { name?: string; code: string }) =>
  plan.name ?? plan.code

const loadFaculties = async () => {
  loadingFaculties.value = true
  facultyLoadError.value = ''
  try {
    faculties.value = await facultyApi.getAll()
  } catch {
    faculties.value = []
    facultyLoadError.value =
      'No se pudieron cargar las facultades. Comprueba tu conexión y vuelve a intentarlo.'
  } finally {
    loadingFaculties.value = false
  }
}

onMounted(() => {
  void loadFaculties()
  void useLocalHourlyLoad()
    .ensureLoaded()
    .then((localDataset) => {
      if (localDataset) source.value = 'local'
      captureInitialState()
    })
    .catch(() => {
      captureInitialState()
    })
})

watch(
  facultyId,
  async (selectedFacultyId) => {
    specialityId.value = undefined
    studyPlanId.value = undefined
    hourlyLoadId.value = undefined
    specialities.value = []
    studyPlans.value = []
    hourlyLoads.value = []
    if (!selectedFacultyId) return
    loadingSpecialities.value = true
    loadingHourlyLoads.value = true
    try {
      const [availableSpecialities, availableLoads] = await Promise.all([
        specialityApi.getAllByFaculty(selectedFacultyId),
        hourlyLoadApi.getAllByFaculty(selectedFacultyId),
      ])
      specialities.value = availableSpecialities
      hourlyLoads.value = availableLoads
      if (selectedFacultyId === store.facultyId) {
        specialityId.value = store.specialityId
        studyPlanId.value = store.studyPlanId
        hourlyLoadId.value =
          availableLoads.find(({ id }) => id === store.hourlyLoad?.id)?.id ??
          availableLoads[0]?.id
      } else hourlyLoadId.value = availableLoads[0]?.id
    } finally {
      loadingSpecialities.value = false
      loadingHourlyLoads.value = false
      if (isInitializing.value) {
        captureInitialState()
        isInitializing.value = false
      }
    }
  },
  { immediate: true },
)

watch(specialityId, async (selectedSpecialityId) => {
  studyPlans.value = []
  if (!selectedSpecialityId) return
  loadingStudyPlans.value = true
  try {
    studyPlans.value =
      await studyPlanApi.getAllBySpecialityId(selectedSpecialityId)
    if (!studyPlans.value.some(({ id }) => id === studyPlanId.value))
      studyPlanId.value = undefined
  } finally {
    loadingStudyPlans.value = false
    if (isInitializing.value) {
      captureInitialState()
    }
  }
})

const submitOfficial = async () => {
  const validation = await form.value?.validate()
  if (!validation?.valid || !facultyId.value) return
  const hourlyLoad = hourlyLoads.value.find(
    ({ id }) => id === hourlyLoadId.value,
  )
  if (!hourlyLoad) return
  captureInitialState()
  emit('submit', {
    source: 'official',
    facultyId: facultyId.value,
    specialityId: specialityId.value,
    studyPlanId: studyPlanId.value,
    hourlyLoad,
  })
}
const submitLocal = (_dataset: ILocalHourlyLoadDataset) => {
  captureInitialState()
  emit('submit', { source: 'local' })
}

const normalize = (val: number | null | undefined) => val ?? undefined

const isDirty = computed(() => {
  if (
    isInitializing.value ||
    loadingFaculties.value ||
    loadingHourlyLoads.value
  )
    return false
  if (source.value !== initialSource.value) return true
  if (source.value === 'local') return false

  return (
    normalize(facultyId.value) !== normalize(initialFacultyId.value) ||
    normalize(specialityId.value) !== normalize(initialSpecialityId.value) ||
    normalize(studyPlanId.value) !== normalize(initialStudyPlanId.value) ||
    normalize(hourlyLoadId.value) !== normalize(initialHourlyLoadId.value)
  )
})

defineExpose({ isDirty, submitOfficial })
</script>
