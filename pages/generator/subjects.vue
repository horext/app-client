<template>
  <v-row dense>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
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
                <v-autocomplete
                  id="search-course"
                  v-model="selectedSubject"
                  v-model:search="search"
                  v-model:menu="openSearchMenu"
                  variant="outlined"
                  :items="availableCourses"
                  label="Buscar cursos"
                  return-object
                  no-filter
                  hide-details
                  item-title="course.name"
                  item-value="id"
                  :loading="statusSubjects === 'pending'"
                  :no-data-text="
                    errorSubjects
                      ? 'Error al buscar cursos'
                      : search
                        ? statusSubjects === 'pending'
                          ? 'Buscando cursos...'
                          : 'No se encontraron cursos'
                        : 'Escribe el nombre del curso'
                  "
                  @update:model-value="addNewSubject"
                >
                  <template #selection="{ item }">
                    <v-list-item
                      v-if="item.raw"
                      :title="`${item?.raw?.course?.id} - ${item?.raw?.course?.name}`"
                      :subtitle="`Ciclo: ${item?.raw?.cycle} | ${item?.raw?.type?.name}`"
                    />
                  </template>
                  <template #item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :title="`${item?.raw?.course?.id} - ${item?.raw?.course?.name}`"
                      :subtitle="`Ciclo: ${item?.raw?.cycle} | ${item?.raw?.type?.name}`"
                    />
                  </template>
                  <template #append>
                    <label for="search-course">
                      <v-progress-circular
                        v-if="statusSubjects === 'pending'"
                        size="20"
                        indeterminate
                        color="primary"
                      />
                      <v-icon v-else color="primary">{{ mdiMagnify }}</v-icon>
                    </label>
                  </template>
                </v-autocomplete>
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
                :loading="pending"
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
          <v-row align="center" justify="end" class="pa-2">
            <v-col cols="auto">
              <v-chip color="green" label>
                Total de créditos: {{ totalCredits }}
              </v-chip>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-col>

    <base-confirm-dialog
      v-if="selectedDelete"
      v-model="dialogDelete"
      @click:confirm="deleteItemConfirm(selectedDelete)"
      @click:reject="closeDelete"
    >
      ¿Estás seguro de eliminar el curso?
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
  </v-row>
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
import { mdiMagnify } from '@mdi/js'
import { SUBJECT_HEADERS } from '~/constants/subjects'
import SubjectTableItemActions from '~/components/subject/table/ItemActions.vue'
import {
  useClassSessionApi,
  useCourseApi,
  useScheduleSubjectApi,
} from '~/modules/apis/runtime/composables'

const courseApi = useCourseApi()

const configStore = useUserConfigStore()

const succcesAddCourse = ref(false)

const availableCourses = computed(() => {
  return subjects.value?.filter(
    (c1) => !mySubjects.value.some((c2) => c1.id === c2.id),
  )
})
const {
  subjects: mySubjects,
  specialityId,
  hourlyLoadId,
} = storeToRefs(configStore)

const totalCredits = computed(() => {
  return mySubjects.value.reduce((previousValue, currentValue) => {
    return currentValue.credits + previousValue
  }, 0)
})

const dialog = ref(false)
const dialogDelete = ref(false)

const selectedSubject = ref<ISelectedSubject>()

const openSearchMenu = ref(false)

const addNewSubject = (item: ISubject) => {
  editItem({ ...item, schedules: [] })
}

const scheduleSubjectApi = useScheduleSubjectApi()
const classSessionsApi = useClassSessionApi()

const { data: schedules, pending } = useAsyncData<ISubjectSchedule[]>(
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
    watch: [selectedSubject, hourlyLoadId],
  },
)

const editItem = async (item: ISelectedSubject) => {
  selectedSubject.value = item
  openSearchMenu.value = false
  dialog.value = true
}

const selectedDelete = ref<ISelectedSubject>()
const deleteItem = (item: ISelectedSubject) => {
  selectedDelete.value = item
  dialogDelete.value = true
}

const succcesDeleteCourse = ref(false)
const deleteItemConfirm = async (item: ISelectedSubject) => {
  await configStore.deleteSubjectById(item.id)
  succcesDeleteCourse.value = true
  closeDelete()
}

const close = () => {
  dialog.value = false
  selectedSubject.value = undefined
}

const closeDelete = () => {
  dialogDelete.value = false
  selectedSubject.value = undefined
}

const succcesUpdateCourse = ref(false)
const save = async (item: ISelectedSubject, schedules: ISubjectSchedule[]) => {
  succcesAddCourse.value = false
  const editedIndex = mySubjects.value.findIndex((c) => c.id === item.id)
  if (editedIndex > -1 && schedules && schedules.length > 0) {
    await configStore.updateSubject({ ...item, schedules })
    succcesUpdateCourse.value = true
  } else if (schedules && schedules.length > 0) {
    await configStore.saveNewSubject({ ...item, schedules })
    succcesAddCourse.value = true
  } else if (editedIndex > -1) {
    await configStore.deleteSubjectById(item?.id!)
    succcesDeleteCourse.value = true
  }
  close()
}

const search = ref('')

const {
  data: subjects,
  error: errorSubjects,
  status: statusSubjects,
} = await useAsyncData(
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

const headers = SUBJECT_HEADERS
</script>
