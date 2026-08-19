<template>
  <v-card :loading="loading">
    <v-card-title>Configuración académica</v-card-title>
    <v-card-subtitle>
      Elige una carga oficial o importa una carga personal.
    </v-card-subtitle>

    <v-card-text>
      <v-btn-toggle
        v-model="source"
        mandatory
        color="primary"
        variant="outlined"
        divided
        class="mb-5"
      >
        <v-btn value="official" prepend-icon="mdi-cloud-download">
          Carga oficial
        </v-btn>
        <v-btn value="local" prepend-icon="mdi-file-excel">
          Importar Excel
        </v-btn>
      </v-btn-toggle>

      <v-form
        v-if="source === 'official'"
        ref="form"
        @submit.prevent="submitOfficial"
      >
        <v-autocomplete
          v-model="facultyId"
          :items="faculties"
          :loading="loadingFaculties"
          item-title="name"
          item-value="id"
          label="Facultad"
          :rules="[(value) => !!value || 'Selecciona una facultad']"
        />

        <v-alert
          v-if="facultyId && !loadingHourlyLoads && hourlyLoads.length === 0"
          type="warning"
          variant="tonal"
          class="mb-4"
        >
          No existe una carga oficial publicada para esta facultad. Puedes
          importar la carga que tengas en Excel.
          <template #append>
            <v-btn variant="text" @click="source = 'local'">Importar</v-btn>
          </template>
        </v-alert>

        <v-select
          v-model="hourlyLoadId"
          :items="hourlyLoadOptions"
          :loading="loadingHourlyLoads"
          :disabled="!facultyId || hourlyLoads.length === 0"
          item-title="title"
          item-value="value"
          label="Carga horaria"
          hint="Puedes utilizar una carga de un ciclo anterior"
          persistent-hint
          :rules="[(value) => !!value || 'Selecciona una carga horaria']"
        />

        <v-autocomplete
          v-model="specialityId"
          :items="specialities"
          :loading="loadingSpecialities"
          :disabled="!facultyId"
          item-title="name"
          item-value="id"
          label="Carrera"
          hint="La carrera recomienda cursos, pero no restringe la búsqueda"
          persistent-hint
          :rules="[(value) => !!value || 'Selecciona una carrera']"
        />
        <div class="d-flex justify-end mt-4">
          <v-btn
            type="submit"
            color="primary"
            :loading="loading"
            :disabled="hourlyLoads.length === 0"
          >
            Continuar
          </v-btn>
        </div>
      </v-form>

      <HourlyLoadUploader v-else @activated="submitLocal" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components/VForm'
import type { IOrganization } from '~/interfaces/organization'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { HourlyLoadSelection } from '~/interfaces/hourly-load-selection'
import type { ILocalHourlyLoadDataset } from '#shared/domain/types/local-hourly-load'
import {
  useFacultyApi,
  useHourlyLoadApi,
  useSpecialityApi,
} from '~~/modules/apis/runtime/composables'

defineProps<{ loading?: boolean }>()
const emit = defineEmits<{ submit: [selection: HourlyLoadSelection] }>()

const source = ref<'official' | 'local'>('official')
const form = ref<VForm>()
const store = useUserProfileStore()
const facultyId = ref(store.facultyId)
const specialityId = ref(store.specialityId)
const hourlyLoadId = ref(store.hourlyLoad?.id)
const faculties = ref<IOrganization[]>([])
const specialities = ref<IOrganization[]>([])
const hourlyLoads = ref<IHourlyLoad[]>([])
const loadingFaculties = ref(false)
const loadingSpecialities = ref(false)
const loadingHourlyLoads = ref(false)

const facultyApi = useFacultyApi()
const specialityApi = useSpecialityApi()
const hourlyLoadApi = useHourlyLoadApi()

const hourlyLoadOptions = computed(() =>
  hourlyLoads.value.map((load) => ({
    value: load.id,
    title: `${load.name} · ${new Date(load.publishedAt).toLocaleDateString('es-PE')}`,
  })),
)

onMounted(async () => {
  const localDataset = await useLocalHourlyLoad().ensureLoaded()
  if (localDataset) source.value = 'local'
  loadingFaculties.value = true
  try {
    faculties.value = await facultyApi.getAll()
  } finally {
    loadingFaculties.value = false
  }
})

watch(
  facultyId,
  async (selectedFacultyId) => {
    specialityId.value = undefined
    hourlyLoadId.value = undefined
    specialities.value = []
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
        hourlyLoadId.value =
          availableLoads.find(({ id }) => id === store.hourlyLoad?.id)?.id ??
          availableLoads[0]?.id
      } else {
        hourlyLoadId.value = availableLoads[0]?.id
      }
    } finally {
      loadingSpecialities.value = false
      loadingHourlyLoads.value = false
    }
  },
  { immediate: true },
)

const submitOfficial = async () => {
  const validation = await form.value?.validate()
  if (!validation?.valid || !facultyId.value || !specialityId.value) return
  const hourlyLoad = hourlyLoads.value.find(
    ({ id }) => id === hourlyLoadId.value,
  )
  if (!hourlyLoad) return
  emit('submit', {
    source: 'official',
    facultyId: facultyId.value,
    specialityId: specialityId.value,
    hourlyLoad,
  })
}

const submitLocal = (_dataset: ILocalHourlyLoadDataset) =>
  emit('submit', { source: 'local' })
</script>
