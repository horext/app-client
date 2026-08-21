<template>
  <v-form ref="form" lazy-validation @submit.prevent="ending">
    <v-card :loading="loading">
      <v-card-title> Configuración Básica </v-card-title>
      <v-card-subtitle>
        Selecciona tu facultad para obtener tu carga horaria
      </v-card-subtitle>
      <v-card-text>
        <v-autocomplete
          :model-value="internalFacultyId"
          :items="faculties"
          :loading="loadingFaculties"
          item-title="name"
          item-value="id"
          label="Selecciona tu facultad"
          placeholder="Facultad"
          :rules="[(v) => !!v || 'Facultad es requerida']"
          @update:model-value="selectFaculty"
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
      </v-card-text>
      <v-card-subtitle>
        Selecciona tu especialidad y plan de estudios para un mejor filtrado de
        los cursos. </v-card-subtitle
      ><v-card-text>
        <v-autocomplete
          :model-value="internalSpecialityId"
          :disabled="!internalFacultyId"
          item-value="id"
          :loading="loadingSpecialities"
          item-title="name"
          :items="specialities"
          label="Selecciona tu especialidad"
          placeholder="Especialidad"
          @update:model-value="selectSpeciality"
        />
        <v-autocomplete
          v-model="internalStudyPlanId"
          :disabled="!internalSpecialityId"
          item-value="id"
          :loading="loadingStudyPlans"
          :item-title="studyPlanTitle"
          :items="studyPlans"
          label="Selecciona tu plan de estudios"
          placeholder="Plan de estudios (opcional)"
          clearable
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn type="submit" variant="text"> Guardar </v-btn>
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
  useStudyPlanApi,
} from '~~/modules/apis/runtime/composables'
import { storeToRefs } from 'pinia'
import type { SubmitEventPromise } from 'vuetify'

defineProps<{ loading?: boolean }>()
const emit = defineEmits<{
  submit: [
    {
      facultyId: number
      specialityId: number | null
      hourlyLoad: IHourlyLoad
      studyPlanId: number | null
    },
  ]
}>()

const hourlyLoadApi = useHourlyLoadApi()
const facultyApi = useFacultyApi()
const specialityApi = useSpecialityApi()
const studyPlanApi = useStudyPlanApi()
const store = useUserProfileStore()
const { facultyId, specialityId, hourlyLoad, studyPlanId } = storeToRefs(store)

const internalFacultyId = ref(facultyId.value)
const internalSpecialityId = ref(specialityId.value)
const internalStudyPlanId = ref(studyPlanId.value)

const internalHourlyLoad = shallowRef(
  hourlyLoad.value ? { ...hourlyLoad.value } : undefined,
)

const selectFaculty = (value: number | null) => {
  if (value === internalFacultyId.value) return
  internalFacultyId.value = value ?? undefined
  internalSpecialityId.value = null
  internalStudyPlanId.value = null
}

const selectSpeciality = (value: number | null) => {
  if (value === internalSpecialityId.value) return
  internalSpecialityId.value = value
  internalStudyPlanId.value = null
}

const studyPlanTitle = (plan: { name?: string; code: string }) =>
  plan.name ?? plan.code

watch(facultyId, (value) => {
  internalFacultyId.value = value
})
watch(specialityId, (value) => {
  internalSpecialityId.value = value
})
watch(studyPlanId, (value) => {
  internalStudyPlanId.value = value
})

watch(hourlyLoad, (value) => {
  internalHourlyLoad.value = value ? { ...value } : undefined
})

const { pending: loadingSpecialities, data: specialities } = useAsyncData(
  () => 'setting' + internalFacultyId.value + '-specialities',
  async () => {
    if (!internalFacultyId.value) {
      return []
    }
    const items = await specialityApi.getAllByFaculty(internalFacultyId.value)
    const existsSpeciality = items.some(
      (i) => i.id === internalSpecialityId.value,
    )
    if (!existsSpeciality) {
      internalSpecialityId.value = null
    }
    return items
  },
  {
    default: () => [],
    watch: [internalFacultyId],
  },
)

const { data: lastHourlyLoad, error: errorMessage } = useAsyncData(
  () => 'setting-last-hourly-load' + internalFacultyId.value,
  async () => {
    if (!internalFacultyId.value) {
      return undefined
    }
    internalHourlyLoad.value = undefined
    return hourlyLoadApi.getLatestByFaculty(internalFacultyId.value)
  },
  {
    watch: [internalFacultyId],
    default: () => undefined,
    server: false,
  },
)

const { pending: loadingStudyPlans, data: studyPlans } = useAsyncData(
  () => 'setting' + internalSpecialityId.value + '-study-plans',
  async () => {
    if (!internalSpecialityId.value) {
      return []
    }
    const items = await studyPlanApi.getAllBySpecialityId(
      internalSpecialityId.value,
    )
    const existsStudyPlan = items.some(
      (i) => i.id === internalStudyPlanId.value,
    )
    if (!existsStudyPlan) {
      internalStudyPlanId.value = null
    }
    return items
  },
  {
    default: () => [],
    watch: [internalSpecialityId],
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

const ending = async (e: SubmitEventPromise) => {
  const formValue = await e
  if (!formValue?.valid) return
  emit('submit', {
    facultyId: internalFacultyId.value!,
    specialityId: internalSpecialityId.value,
    hourlyLoad: internalHourlyLoad.value!,
    studyPlanId: internalStudyPlanId.value,
  })
}
</script>
