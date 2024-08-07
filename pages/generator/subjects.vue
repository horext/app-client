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
                  v-model="editedItem"
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
                  @update:model-value="editItem"
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
                v-if="editedItem"
                :subject="editedItem"
                :hourly-load="myHourlyLoad"
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
      v-model="dialogDelete"
      @click:confirm="deleteItemConfirm"
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
import type { ISelectedSubject, ISubjectSchedule } from '~/interfaces/subject'
import { useApi } from '~/composables/api'
import { mdiMagnify } from '@mdi/js'
import { SUBJECT_HEADERS } from '~/constants/subjects'
import SubjectTableItemActions from '~/components/subject/table/ItemActions.vue'

const $api = useApi()

const configStore = useUserConfigStore()

const succcesAddCourse = ref(false)

const availableCourses = computed(() => {
  return subjects.value?.filter(
    (c1) => !mySubjects.value.some((c2) => c1.id === c2.id),
  )
})

const mySubjects = computed(() => configStore.subjects)

const totalCredits = computed(() => {
  return mySubjects.value.reduce((previousValue, currentValue) => {
    return currentValue.credits + previousValue
  }, 0)
})

const dialog = ref(false)
const dialogDelete = ref(false)

const editedItem = ref<ISelectedSubject>()
const editedIndex = ref(-1)

const openSearchMenu = ref(false)
const editItem = async (item: ISelectedSubject) => {
  if (!item) {
    return
  }
  editedIndex.value = mySubjects.value.findIndex((c) => c.id === item?.id)
  editedItem.value = Object.assign({}, item)
  openSearchMenu.value = false
  await nextTick(() => {
    dialog.value = true
  })
}

const deleteItem = (item: ISelectedSubject) => {
  editedIndex.value = mySubjects.value.findIndex((c) => c.id === item.id)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}

const succcesDeleteCourse = ref(false)
const deleteItemConfirm = async () => {
  await configStore.deleteSubjectById(editedItem.value?.id!)
  succcesDeleteCourse.value = true
  closeDelete()
}

const close = () => {
  dialog.value = false
  editedItem.value = undefined
  editedIndex.value = -1
}

const closeDelete = () => {
  dialogDelete.value = false
  editedItem.value = undefined
  editedIndex.value = -1
}

const succcesUpdateCourse = ref(false)
const save = async (schedules: ISubjectSchedule[]) => {
  succcesAddCourse.value = false
  if (editedIndex.value > -1 && schedules && schedules.length > 0) {
    await configStore.updateSubject({ ...editedItem.value!, schedules })
    succcesUpdateCourse.value = true
  } else if (schedules && schedules.length > 0) {
    await configStore.saveNewSubject({ ...editedItem.value!, schedules })
    succcesAddCourse.value = true
  } else if (editedIndex.value > -1) {
    await configStore.deleteSubjectById(editedItem.value?.id!)
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
    if (!search.value) return []
    if (configStore.specialityId && configStore.hourlyLoadId) {
      const response = await $api.course.findBySearch(
        search.value,
        configStore.specialityId,
        configStore.hourlyLoadId,
      )
      return response.content
    }
  },
  {
    watch: [search],
    default: () => [],
  },
)

const headers = SUBJECT_HEADERS

const myHourlyLoad = computed(() => {
  return configStore.hourlyLoad!
})
</script>
