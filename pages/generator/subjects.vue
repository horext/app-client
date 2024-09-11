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
        <v-row dense>
          <v-col cols="12">
            <SubjectSelect
              v-model="selectedSubject"
              v-model:search="search"
              v-model:menu="openSearchMenu"
              :status-subjects="statusSubjects"
              :subjects="availableCourses"
              @update:model-value="addNewSubject"
            />
          </v-col>
        </v-row>
        <v-dialog
          v-model="dialog"
          dense
          max-width="800"
          @click:outside="close"
          @keydown.esc="close"
        >
          <SubjectScheduleList
            v-if="selectedSubject"
            :subject="selectedSubject"
            :schedules="schedules"
            :loading="statusSchedules === 'pending'"
            @save="save(selectedSubject, $event)"
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
        {{ selectedDelete?.course?.name }}?
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
import { ref, computed } from 'vue'
import SubjectScheduleList from '~/components/subject/ScheduleList.vue'
import SubjectTableItemSectionList from '~/components/subject/table/ItemSectionList.vue'
import SubjectTableNoData from '~/components/subject/table/NoData.vue'
import { useUserConfigStore } from '~/stores/user-config'
import type {
  ISelectedSubject,
  ISubjectSchedule,
  ISubject,
} from '~/interfaces/subject'
import { SUBJECT_HEADERS } from '~/constants/subjects'
import SubjectTableItemActions from '~/components/subject/table/ItemActions.vue'
import {
  useClassSessionApi,
  useCourseApi,
  useScheduleSubjectApi,
} from '~/modules/apis/runtime/composables'
import SubjectTotalCredits from '../../components/subject/TotalCredits.vue'
import SubjectSelect from '../../components/subject/Select.vue'
import { useUserSubjects } from '~/composables/user-subjects'

useSeoMeta({
  title: 'Cursos - Generador de Horarios',
  description: 'Administra tus cursos para tener un mejor control de tu tiempo',
})

const courseApi = useCourseApi()

const configStore = useUserConfigStore()
const { mySubjects, deleteSubjectById, updateSubject, saveNewSubject } =
  useUserSubjects()

const succcesAddCourse = ref(false)

const availableCourses = computed(() => {
  return subjects.value?.filter(
    (c1) => !mySubjects.value.some((c2) => c1.id === c2.id),
  )
})
const { specialityId, hourlyLoadId } = storeToRefs(configStore)

const dialog = ref(false)
const dialogDelete = ref(false)

const selectedSubject = ref<ISelectedSubject>()

const openSearchMenu = ref(false)

const addNewSubject = (item?: ISubject) => {
  if (!item) return
  openSearchMenu.value = false
  editItem({ ...item, schedules: [] })
}

const scheduleSubjectApi = useScheduleSubjectApi()
const classSessionsApi = useClassSessionApi()

const {
  data: schedules,
  status: statusSchedules,
  execute: fetchSchedules,
} = useAsyncData<ISubjectSchedule[]>(
  async () => {
    const _hourlyLoadId = hourlyLoadId.value
    const subject = selectedSubject.value
    if (!_hourlyLoadId || !subject) return []

    const schedulesSubject =
      await scheduleSubjectApi.findBySubjectIdAndHourlyLoadId(
        subject.id,
        _hourlyLoadId,
      )
    const scheduleIds = schedulesSubject.map((sb) => sb.schedule.id)

    const sessions = await classSessionsApi.findScheduleIds(scheduleIds)

    return schedulesSubject.map((sb) => ({
      ...sb?.schedule,
      scheduleSubject: {
        id: sb.id,
      },
      sessions: sessions.filter((s) => s.schedule.id === sb.schedule.id),
      subject: subject,
    }))
  },
  {
    default: () => [],
    watch: [hourlyLoadId],
    immediate: false,
  },
)

const editItem = async (item: ISelectedSubject) => {
  selectedSubject.value = item
  fetchSchedules()
  dialog.value = true
}

const selectedDelete = ref<ISelectedSubject>()
const deleteItem = (item: ISelectedSubject) => {
  selectedDelete.value = item
  dialogDelete.value = true
}

const succcesDeleteCourse = ref(false)
const deleteItemConfirm = async (item: ISelectedSubject) => {
  await deleteSubjectById(item.id)
  succcesDeleteCourse.value = true
  closeDelete()
}

const close = () => {
  dialog.value = false
  selectedSubject.value = undefined
}

const closeDelete = () => {
  dialogDelete.value = false
  selectedDelete.value = undefined
}

const succcesUpdateCourse = ref(false)
const save = async (item: ISelectedSubject, schedules: ISubjectSchedule[]) => {
  succcesAddCourse.value = false
  const editedIndex = mySubjects.value.findIndex((c) => c.id === item.id)
  if (editedIndex > -1 && schedules && schedules.length > 0) {
    await updateSubject({ ...item, schedules })
    close()
    succcesUpdateCourse.value = true
  } else if (schedules && schedules.length > 0) {
    await saveNewSubject({ ...item, schedules })
    close()
    succcesAddCourse.value = true
  } else if (editedIndex > -1) {
    deleteItem(item)
  }
}

const search = ref('')

const { data: subjects, status: statusSubjects } = await useAsyncData(
  'search',
  async () => {
    const _search = search.value
    if (!_search) return []
    const _hourlyLoadId = hourlyLoadId.value
    const _specialityId = specialityId.value
    if (!_hourlyLoadId || !_specialityId) return []
    const response = await courseApi.findBySearch(
      _search,
      _specialityId,
      _hourlyLoadId,
    )
    return response.content
  },
  {
    watch: [search],
    default: () => [],
  },
)
</script>
