<template>
  <v-row dense>
    <v-col cols="12">
      <v-data-table :headers="headers" :items="mySubjects" class="elevation-1">
        <template #top>
          <v-sheet flat class="pa-2">
            <v-row dense>
              <v-col cols="12">
                <v-autocomplete
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
                  :loading="loadingSubjects"
                  :no-data-text="
                    errorSubjects
                      ? 'Error al buscar cursos'
                      : search
                        ? loadingSubjects
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
                    <v-btn icon variant="text" :loading="loadingSubjects">
                      <v-icon>{{ mdiMagnify }}</v-icon>
                    </v-btn>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12" class="d-flex justify-end">
                <nuxt-link to="/generator"> Generar mis horarios </nuxt-link>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col col="auto">
                <v-toolbar-title> Mis cursos seleccionados </v-toolbar-title>
              </v-col>
              <v-spacer />
              <v-col cols="auto">
                <div>Créditos Necesarios : {{ totalCredits }}</div>
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
        </template>
        <template #no-data>
          <v-row align="center">
            <v-col cols="12" md="6">
              <div class="text-md-h2 text-h4 text-left">
                Busca tus cursos en la parte superior y luego ve al
                <nuxt-link to="/generator"> generador </nuxt-link>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-responsive>
                <div id="noData" />
              </v-responsive>
            </v-col>
          </v-row>
        </template>
        <template #[`item.sections`]="{ item }">
          <v-chip
            v-for="schedule in item.schedules"
            :key="schedule.id"
            theme="dark"
            :color="getColor(schedule.section.id)"
          >
            {{ schedule.section.id }}
          </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon color="blue" v-bind="props" @click="editItem(item)">
                {{ mdiPencil }}
              </v-icon>
            </template>
            <span>Modificar secciones</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon color="red" v-bind="props" @click="deleteItem(item)">
                {{ mdiDelete }}
              </v-icon>
            </template>
            <span>Eliminar</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          ¿Estás segura de que quieres eliminar este curso?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete">
            Cancelar
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="deleteItemConfirm"
          >
            Aceptar
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="succcesAddCourse" color="blue" timeout="3000">
      <v-icon> {{ mdiCheckCircle }} </v-icon>
      Curso Agregado correctamente!
      <template #actions>
        <v-btn
          variant="text"
          size="small"
          icon
          @click="succcesAddCourse = false"
        >
          <v-icon> {{ mdiClose }} </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import Lottie from 'lottie-web'
import SubjectScheduleList from '~/components/subject/ScheduleList.vue'
import { useUserConfigStore } from '~/stores/user-config'
import type { ISelectedSubject, ISubjectSchedule } from '~/interfaces/subject'
import { useApi } from '~/composables/api'
import Animation from '~/assets/lottie/15538-cat-woow.json'
import {
  mdiPencil,
  mdiDelete,
  mdiMagnify,
  mdiCheckCircle,
  mdiClose,
} from '@mdi/js'

export default defineComponent({
  name: 'MySubjects',
  components: {
    SubjectScheduleList,
  },
  async setup() {
    const $api = useApi()
    onMounted(() => {
      Lottie.loadAnimation({
        container: document.getElementById('noData') as Element,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: Animation,
      })
    })

    const configStore = useUserConfigStore()

    const succcesAddCourse = ref(false)

    const availableCourses = computed(() => {
      return subjects.value?.filter(
        (c1) => !mySubjects.value.some((c2) => c1.id === c2.id),
      )
    })

    const getColor = (section: string) => {
      const months = ['blue', 'purple', 'orange', 'indigo', 'teal']
      return months[section.charCodeAt(0) % months.length]
    }

    const mySubjects = computed(() => configStore.subjects)

    const totalCredits = computed(() => {
      return mySubjects.value.reduce((previousValue, currentValue) => {
        return currentValue.credits + previousValue
      }, 0)
    })

    const dialog = ref(false)
    const loading = ref(false)
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

    const deleteItemConfirm = async () => {
      await configStore.deleteSubjectById(editedItem.value?.id!)
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

    const save = async (schedules: ISubjectSchedule[]) => {
      succcesAddCourse.value = false

      if (editedIndex.value > -1 && schedules && schedules.length > 0) {
        await configStore.updateSubject({ ...editedItem.value!, schedules })
        close()
      } else if (schedules && schedules.length > 0) {
        await configStore.saveNewSubject({ ...editedItem.value!, schedules })
        close()
      } else if (editedIndex.value > -1) {
        await configStore.deleteSubjectById(editedItem.value?.id!)
      } else {
        close()
      }

      succcesAddCourse.value = true
    }

    const search = ref('')

    const {
      data: subjects,
      pending: loadingSubjects,
      error: errorSubjects,
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

    const headers = ref([
      {
        title: 'Código',
        value: 'course.id',
        sortable: true,
      },
      {
        title: 'Nombre de curso',
        align: 'start',
        sortable: true,
        value: 'course.name',
      },
      {
        title: 'Secciones',
        value: 'sections',
        sortable: true,
      },
      {
        title: 'Creditos',
        value: 'credits',
        sortable: true,
      },
      {
        title: 'Acciones',
        value: 'actions',
        sortable: false,
      },
    ] as const)

    const myHourlyLoad = computed(() => {
      return configStore.hourlyLoad!
    })

    return {
      mySubjects,
      subjects,
      dialog,
      dialogDelete,
      loading,
      editedIndex,
      editedItem,
      headers,
      search,
      succcesAddCourse,
      getColor,
      deleteItem,
      editItem,
      closeDelete,
      close,
      deleteItemConfirm,
      save,
      availableCourses,
      totalCredits,
      openSearchMenu,
      myHourlyLoad,
      loadingSubjects,
      errorSubjects,
      mdiPencil,
      mdiDelete,
      mdiMagnify,
      mdiCheckCircle,
      mdiClose,
    }
  },
})
</script>

<style scoped></style>
