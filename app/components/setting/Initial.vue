<template>
  <v-form ref="form" lazy-validation @submit.prevent="ending">
    <v-card :loading="loading">
      <v-card-title> Configuración Básica </v-card-title>
      <v-card-subtitle>
        Selecciona tu facultad para obtener tu carga horaria y selecciona tu
        especialidad para filtrar los cursos.
      </v-card-subtitle>
      <v-card-text>
        <v-autocomplete
          v-model="internalFaculty"
          :items="faculties"
          :loading="loadingFaculties"
          return-object
          item-title="name"
          label="Selecciona tu facultad"
          placeholder="Facultad"
          :rules="[(v) => !!v || 'Facultad es requerida']"
        />
        <v-alert v-if="errorMessage" closable type="error">
          No se ha encontrado la carga horaria de tu facultad
        </v-alert>
        <v-input
          v-model="internalHourlyLoad"
          :disabled="!internalFaculty"
          label="Carga horaria"
          :rules="[(v) => !!v || 'La facultad no tiene carga horaria']"
        />
        <v-autocomplete
          v-model="internalSpeciality"
          :disabled="!internalFaculty"
          return-object
          :loading="loadingSpecialities"
          item-title="name"
          :items="specialities"
          label="Selecciona tu especialidad"
          placeholder="Especialidad"
          :rules="[(v) => !!v || 'Especialidad es requerida']"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn type="submit" variant="text" @click="ending"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
    <base-snackbar v-model="successSave">
      La configuración se ha guardado correctamente
    </base-snackbar>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserConfigStore } from '~/stores/user-config'
import type { IOrganization } from '~/interfaces/organization'
import {
  useFacultyApi,
  useHourlyLoadApi,
  useSpecialityApi,
} from '~~/modules/apis/runtime/composables'
import type { VForm } from 'vuetify/components/VForm'

const hourlyLoadApi = useHourlyLoadApi()
const facultyApi = useFacultyApi()
const specialityApi = useSpecialityApi()
const store = useUserConfigStore()
const { faculty, speciality, hourlyLoad } = storeToRefs(store)

const loading = ref(false)

const internalFaculty = ref<IOrganization | undefined>(
  faculty.value ? { ...faculty.value } : undefined,
)
const internalSpeciality = ref<IOrganization | undefined>(
  speciality.value ? { ...speciality.value } : undefined,
)

const internalHourlyLoad = ref(
  hourlyLoad.value ? { ...hourlyLoad.value } : undefined,
)

watch(faculty, (value) => {
  internalFaculty.value = value ? { ...value } : undefined
})
watch(speciality, (value) => {
  internalSpeciality.value = value ? { ...value } : undefined
})

watch(hourlyLoad, (value) => {
  internalHourlyLoad.value = value ? { ...value } : undefined
})

const internalFacultyId = computed(() => internalFaculty.value?.id)
const { pending: loadingSpecialities, data: specialities } = useAsyncData(
  async () => {
    if (!internalFacultyId.value) {
      return []
    }
    return await specialityApi.getAllByFaculty(internalFacultyId.value)
  },
  {
    default: () => [],
    watch: [internalFacultyId],
  },
)

watch(specialities, (value) => {
  const speciality = value.find((s) => s.id === internalSpeciality.value?.id)
  if (!speciality) {
    internalSpeciality.value = undefined
  }
})

const { data: lastHourlyLoad, error: errorMessage } = useAsyncData(
  async () => {
    if (!internalFacultyId.value) {
      return undefined
    }
    internalHourlyLoad.value = undefined
    return await hourlyLoadApi.getLatestByFaculty(internalFacultyId.value)
  },
  {
    watch: [internalFacultyId],
    immediate: false,
  },
)

watch(lastHourlyLoad, (value) => {
  if (value) {
    internalHourlyLoad.value = { ...value }
  }
})

const { data: faculties, pending: loadingFaculties } = useAsyncData<
  IOrganization[]
>(() => facultyApi.getAll(), {
  default: () => [],
})

const form = ref<VForm>()
const successSave = ref(false)
const ending = async () => {
  const formValue = await form.value?.validate()
  if (!formValue?.valid) {
    return
  }
  successSave.value = false
  loading.value = true
  store.updateFaculty(internalFaculty.value!)
  store.updateSpeciality(internalSpeciality.value!)
  store.updateHourlyLoad(internalHourlyLoad.value!)
  store.updateFirstEntry(false)
  loading.value = false
  successSave.value = true
}
</script>
