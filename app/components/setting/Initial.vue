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
          v-model="internalFacultyId"
          :items="faculties"
          :loading="loadingFaculties"
          item-title="name"
          item-value="id"
          label="Selecciona tu facultad"
          placeholder="Facultad"
          :rules="[(v) => !!v || 'Facultad es requerida']"
        />
        <v-alert v-if="errorMessage" closable type="error">
          No se ha encontrado la carga horaria de tu facultad
        </v-alert>
        <v-input
          v-model="internalHourlyLoad"
          :disabled="!internalFacultyId"
          label="Carga horaria"
          :rules="[(v) => !!v || 'La facultad no tiene carga horaria']"
        />
        <v-autocomplete
          v-model="internalSpecialityId"
          :disabled="!internalFacultyId"
          item-value="id"
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
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserProfileStore } from '~/stores/user-profile'
import type { IOrganization } from '~/interfaces/organization'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import {
  useFacultyApi,
  useHourlyLoadApi,
  useSpecialityApi,
} from '~~/modules/apis/runtime/composables'
import type { VForm } from 'vuetify/components/VForm'
import { storeToRefs } from 'pinia'

defineProps<{ loading?: boolean }>()
const emit = defineEmits<{
  submit: [facultyId: number, specialityId: number, hourlyLoad: IHourlyLoad]
}>()

const hourlyLoadApi = useHourlyLoadApi()
const facultyApi = useFacultyApi()
const specialityApi = useSpecialityApi()
const store = useUserProfileStore()
const { facultyId, specialityId, hourlyLoad } = storeToRefs(store)

const internalFacultyId = ref(facultyId.value)
const internalSpecialityId = ref(specialityId.value)

const internalHourlyLoad = ref(
  hourlyLoad.value ? { ...hourlyLoad.value } : undefined,
)

watch(facultyId, (value) => {
  internalFacultyId.value = value
})
watch(specialityId, (value) => {
  internalSpecialityId.value = value
})

watch(hourlyLoad, (value) => {
  internalHourlyLoad.value = value ? { ...value } : undefined
})

const { pending: loadingSpecialities, data: specialities } = useAsyncData(
  'setting-specialities',
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
  const speciality = value.find((s) => s.id === internalSpecialityId.value)
  if (!speciality) {
    internalSpecialityId.value = undefined
  }
})

const { data: lastHourlyLoad, error: errorMessage } = useAsyncData(
  'setting-last-hourly-load',
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
    server: false,
  },
)

watch(lastHourlyLoad, (value) => {
  if (value) {
    internalHourlyLoad.value = { ...value }
  }
})

const { data: faculties, pending: loadingFaculties } = useAsyncData<
  IOrganization[]
>('setting-faculties', () => facultyApi.getAll(), {
  default: () => [],
})

const form = ref<VForm>()
const ending = async () => {
  const formValue = await form.value?.validate()
  if (!formValue?.valid) return
  emit(
    'submit',
    toRaw(internalFacultyId.value)!,
    toRaw(internalSpecialityId.value)!,
    toRaw(internalHourlyLoad.value)!,
  )
}
</script>
