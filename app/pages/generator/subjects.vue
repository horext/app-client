<template>
  <v-data-table
    :headers="SUBJECT_HEADERS"
    :items="mySubjects"
    class="elevation-1"
    mobile-breakpoint="md"
    :mobile="null"
  >
    <template #top>
      <v-toolbar density="compact" flat>
        <v-toolbar-title>Cursos Disponibles</v-toolbar-title>
      </v-toolbar>
      <v-divider />
      <v-sheet flat class="pa-2">
        <v-row density="comfortable">
          <v-col cols="12">
            <SubjectSearchLocationPanel
              :faculties="faculties"
              :faculty-id="facultyId"
              :has-custom-context="hasCustomContext"
              :profile-speciality-id="profileSpecialityId"
              :profile-study-plan-id="profileStudyPlanId"
              :close-request-id="closeRequestId"
              :specialities="specialities"
              :study-plans="studyPlans"
              :selected-speciality-id="selectedSpecialityId"
              :selected-study-plan-id="selectedStudyPlanId"
              :loading-specialities="loadingSpecialities"
              :loading-study-plans="loadingStudyPlans"
              :specialities-error="!!specialitiesError"
              :study-plans-error="!!studyPlansError"
              @select-speciality="selectSpeciality"
              @select-study-plan="selectStudyPlan"
              @reset="resetContext"
              @retry="retrySearchOptions"
            />
          </v-col>
          <v-col cols="12">
            <SubjectSelect
              v-model="selectedSubject"
              v-model:search="search"
              v-model:menu="openSearchMenu"
              :status-subjects="subjectSearchStatus"
              :subjects="availableCourses"
              :no-data-text="subjectSearchMessage"
              @update:model-value="addNewSubject"
            />
          </v-col>
        </v-row>
        <v-dialog
          v-model="dialog"
          density="comfortable"
          max-width="800"
          @click:outside="close"
          @keydown.esc="close"
        >
          <SubjectSchedulesEdit
            v-if="subjectSchedules"
            :subject-schedules="subjectSchedules"
            :available-schedules="schedules"
            :loading="statusSchedules === 'pending'"
            @save="save"
            @cancel="close"
          />
        </v-dialog>
      </v-sheet>

      <v-toolbar density="compact" flat>
        <v-toolbar-title>
          <span class="hidden-xs-and-down">Cursos </span> Seleccionados
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
        <v-btn to="/generator" color="primary">
          Generar<span class="hidden-xs-and-down">&nbsp; Horarios</span>
        </v-btn>
      </v-toolbar>
    </template>
    <template #no-data>
      <SubjectTableNoData />
    </template>
    <template #[`item.color`]="{ item }">
      <BaseColorEditor
        :color="item.color"
        :loading="updatingColor"
        title="Color del curso"
        @save="saveColor(item, $event)"
      />
    </template>
    <template #[`item.sections`]="{ item }">
      <SubjectTableItemSectionList :schedules="item.schedules" />
    </template>
    <template #[`item.actions`]="{ item }">
      <SubjectTableItemActions
        @click:edit="editItem(item)"
        @click:delete="deleteItem(item)"
      />
    </template>
    <template #bottom>
      <v-divider />
      <SubjectTotalCredits :subjects="mySubjects" />

      <base-confirm-dialog
        v-if="selectedDelete"
        v-model="dialogDelete"
        @click:confirm="deleteItemConfirm(selectedDelete)"
        @click:reject="closeDelete"
      >
        ¿Estás seguro de eliminar el curso de
        {{ selectedDelete.subject?.course?.name }}?
      </base-confirm-dialog>
      <base-snackbar v-model="succcesAddCourse">
        Curso Agregado correctamente!
      </base-snackbar>
      <base-snackbar v-model="succcesUpdateCourse">
        Curso Actualizado correctamente!
      </base-snackbar>
      <base-snackbar v-model="succcesDeleteCourse">
        Curso Eliminado correctamente!
      </base-snackbar>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { refDebounced } from '@vueuse/core'
import SubjectSchedulesEdit from '~/components/subject/SchedulesEdit.vue'
import SubjectTableItemSectionList from '~/components/subject/table/ItemSectionList.vue'
import SubjectTableNoData from '~/components/subject/table/NoData.vue'
import { useUserProfileStore } from '~/stores/user-profile'
import type {
  ISubjectSchedules,
  ISubjectSchedule,
  ISubject,
  IBaseSubjectSchedules,
  IStudyPlan,
} from '~/interfaces/subject'
import { SUBJECT_HEADERS } from '~/constants/subjects'
import { getNextAvailableEventColor } from '~/constants/event'
import SubjectTableItemActions from '~/components/subject/table/ItemActions.vue'
import {
  useSubjectApi,
  useScheduleSubjectApi,
  useStudyPlanApi,
  useFacultyApi,
  useSpecialityApi,
} from '~~/modules/apis/runtime/composables'
import SubjectTotalCredits from '~/components/subject/TotalCredits.vue'
import SubjectSelect from '~/components/subject/Select.vue'
import { useUserSubjects } from '~/composables/user-subjects'
import type { SubjectSchedules } from '~/models/subject-schedules'
import type { SubjectScheduleId } from '~~/shared/domain'
import type { IOrganization } from '~/interfaces/organization'
import { useSubjectsFilter } from '~/composables/subjects-filter'
import SubjectSearchLocationPanel from '~/components/subject/SearchLocationPanel.vue'
import {
  formatSearchLocation,
} from '~/constants/subject-search'

useSeoMeta({
  title: 'Cursos - Generador de Horarios',
  description: 'Administra tus cursos para tener un mejor control de tu tiempo',
})

const subjectApi = useSubjectApi()
const facultyApi = useFacultyApi()
const specialityApi = useSpecialityApi()
const studyPlanApi = useStudyPlanApi()

const configStore = useUserProfileStore()
const {
  mySubjects,
  deleteSubjectById,
  updateSubject,
  updateSubjectColor,
  saveNewSubject,
  refreshSubjectCatalog,
} = useUserSubjects()

const succcesAddCourse = ref(false)

const selectedSubject = shallowRef<ISubject>()
const availableCourses = computed(() => {
  return subjects.value?.filter(
    (c1) => !mySubjects.value.some((c2) => c1.id === c2.subject.id),
  )
})
const {
  facultyId,
  hourlyLoad,
  specialityId: profileSpecialityId,
  studyPlanId: profileStudyPlanId,
} = storeToRefs(configStore)
const {
  context,
  hasCustomContext,
  setSpeciality,
  setStudyPlan,
  resetToProfileDefaults,
} = useSubjectsFilter()
const closeRequestId = ref(0)
const selectedSpecialityId = toRef(() => context.value.specialityId)
const selectedStudyPlanId = toRef(() => context.value.studyPlanId)

const { data: faculties } = useAsyncData<IOrganization[]>(
  'subjects-faculties',
  () => facultyApi.getAll(),
  { default: () => [], server: false },
)
const {
  data: specialities,
  pending: loadingSpecialities,
  error: specialitiesError,
  refresh: refreshSpecialities,
} = useAsyncData<IOrganization[]>(
  'subjects-specialities',
  async () => {
    if (!facultyId.value) return []
    return await specialityApi.getAllByFaculty(facultyId.value)
  },
  {
    default: () => [],
    watch: [facultyId],
    server: false,
  },
)

const {
  data: studyPlans,
  pending: loadingStudyPlans,
  error: studyPlansError,
  refresh: refreshStudyPlans,
} = useAsyncData<IStudyPlan[]>(
  'subjects-study-plans',
  async () => {
    if (!selectedSpecialityId.value) return []
    return await studyPlanApi.getAllBySpecialityId(selectedSpecialityId.value)
  },
  {
    default: () => [],
    watch: [selectedSpecialityId],
    server: false,
  },
)

const selectSpeciality = (value: number | null) => {
  if (
    value !== null &&
    !specialities.value.some((speciality) => speciality.id === value)
  )
    return
  setSpeciality(value)
}

const selectStudyPlan = (value: number | null) => {
  if (value !== null && !studyPlans.value.some((plan) => plan.id === value))
    return
  setStudyPlan(value)
  closeRequestId.value += 1
}

const resetContext = () => {
  resetToProfileDefaults()
  closeRequestId.value += 1
}

const retrySearchOptions = async () => {
  await refreshSpecialities()
  if (selectedSpecialityId.value) await refreshStudyPlans()
}

watch(
  [specialities, loadingSpecialities, facultyId],
  () => {
    const selected = context.value.specialityId
    if (
      loadingSpecialities.value ||
      !!specialitiesError.value ||
      !facultyId.value ||
      selected === null ||
      specialities.value.some((speciality) => speciality.id === selected)
    )
      return
    resetToProfileDefaults()
  },
  { immediate: true },
)

watch(
  [studyPlans, loadingStudyPlans, selectedSpecialityId],
  () => {
    const selected = context.value.studyPlanId
    if (
      loadingStudyPlans.value ||
      !!studyPlansError.value ||
      selected === null ||
      studyPlans.value.some((plan) => plan.id === selected)
    )
      return
    setStudyPlan(null)
  },
  { immediate: true },
)

const refresh = async () => {
  try {
    await refreshSubjectCatalog()
  } catch {
    // IndexedDB remains the offline source of truth.
  }
}

if (mySubjects.value.length > 0) {
  void refresh()
} else {
  watch(
    () => mySubjects.value.length,
    (length) => {
      if (length > 0) void refresh()
    },
    { once: true },
  )
}

const dialog = ref(false)
const dialogDelete = ref(false)

const subjectSchedules = shallowRef<IBaseSubjectSchedules | ISubjectSchedules>()

const openSearchMenu = ref(false)

const addNewSubject = (item?: ISubject) => {
  if (!item) return
  const color = getNextAvailableEventColor(
    mySubjects.value.map((subject) => subject.color),
  )
  openSearchMenu.value = false
  editItem({
    subject: item,
    schedules: [],
    color,
  })
}

const scheduleSubjectApi = useScheduleSubjectApi()

const {
  data: schedules,
  status: statusSchedules,
  execute: fetchSchedules,
} = useAsyncData<ISubjectSchedule[]>(
  'generator-subject-schedules',
  async () => {
    const _hourlyLoadId = hourlyLoad.value?.id
    const subject = subjectSchedules.value?.subject
    if (!_hourlyLoadId || !subject) return []

    const schedulesSubject =
      await scheduleSubjectApi.findBySubjectIdAndHourlyLoadId(
        subject.id,
        _hourlyLoadId,
      )

    return schedulesSubject.map((sb) => ({
      ...sb.schedule,
      scheduleSubject: {
        id: sb.id,
      },
    }))
  },
  {
    default: () => [],
    watch: [hourlyLoad],
    immediate: false,
    server: false,
  },
)

const editItem = (item: ISubjectSchedules | IBaseSubjectSchedules) => {
  subjectSchedules.value = item
  fetchSchedules()
  dialog.value = true
}

const selectedDelete = ref<ISubjectSchedules>()
const deleteItem = (item: ISubjectSchedules) => {
  selectedDelete.value = item
  dialogDelete.value = true
}

const succcesDeleteCourse = ref(false)
const deleteItemConfirm = async (item: ISubjectSchedules) => {
  await deleteSubjectById(item.id)
  succcesDeleteCourse.value = true
  closeDelete()
}

const close = () => {
  dialog.value = false
  subjectSchedules.value = undefined
  selectedSubject.value = undefined
}

const closeDelete = () => {
  dialogDelete.value = false
  selectedDelete.value = undefined
}

const succcesUpdateCourse = ref(false)
const updatingColor = ref(false)

const saveColor = async (item: ISubjectSchedules, color: string) => {
  updatingColor.value = true
  try {
    await updateSubjectColor(item.id, color)
    succcesUpdateCourse.value = true
  } finally {
    updatingColor.value = false
  }
}

const save = async (
  data: SubjectSchedules<SubjectScheduleId> | SubjectSchedules<undefined>,
) => {
  succcesAddCourse.value = false
  if (data.id) {
    if (data.schedules && data.schedules.length > 0) {
      await updateSubject(data.toUpdateRequest())
      close()
      succcesUpdateCourse.value = true
    } else {
      deleteItem(data)
    }
  } else {
    await saveNewSubject(data.toCreateRequest())
    close()
    succcesAddCourse.value = true
  }
}

const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const normalizedSearch = computed(() => debouncedSearch.value?.trim() ?? '')
const searchIsSettling = computed(
  () => search.value.trim() !== normalizedSearch.value,
)
const subjectSearchStatus = computed(() =>
  searchIsSettling.value ? 'pending' : statusSubjects.value,
)

const subjectSearchMessage = computed(() => {
  if (subjectSearchStatus.value === 'error')
    return 'No pudimos cargar las asignaturas. Intenta nuevamente.'
  if (!facultyId.value || !hourlyLoad.value) {
    return 'Configura tu perfil académico para buscar cursos'
  }
  if (!search.value)
    return 'Escribe el nombre o código de una asignatura para comenzar.'
  if (subjectSearchStatus.value === 'pending') return 'Buscando cursos...'
  const specialityName = specialities.value.find(
    (speciality) => speciality.id === context.value.specialityId,
  )?.name
  const plan = studyPlans.value.find(
    (studyPlan) => studyPlan.id === context.value.studyPlanId,
  )
  const location = formatSearchLocation(
    specialityName,
    plan?.name ?? plan?.code,
  )
  return `No encontramos cursos para “${search.value}” en ${location}.`
})

const { data: subjects, status: statusSubjects } = await useAsyncData(
  'search',
  async () => {
    const _search = normalizedSearch.value
    if (!_search) return []
    const _hourlyLoadId = hourlyLoad.value?.id
    const _facultyId = facultyId.value
    if (!_hourlyLoadId || !_facultyId) return []
    const response = await subjectApi.findPageBySpeciality({
      search: _search,
      hourlyLoadId: _hourlyLoadId,
      specialityId: context.value.specialityId!,
    })
    return response.content
  },
  {
    watch: [normalizedSearch, context, facultyId, hourlyLoad],
    default: () => [],
  },
)
</script>
