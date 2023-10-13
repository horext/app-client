<template>
  <v-card tile flat>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12">
          <v-autocomplete
            v-model="editedItem"
            shaped
            filled
            :search-input.sync="search"
            :items="availableCourses"
            append-icon="mdi-magnify"
            label="Busca cursos para agregar"
            return-object
            no-filter
            :cache-items="false"
            hide-details
            @input="editItem"
          >
            <template #selection="{ item, on, attrs }">
              <v-list-item dense v-bind="attrs" v-on="on">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.course.id }} - {{ item.course.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Ciclo {{ item.cycle }} |
                    <span v-if="item.type">
                      {{ item.type.name }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template #item="{ item, on, attrs }">
              <v-list-item dense v-bind="attrs" v-on="on">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.course.id }} - {{ item.course.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Ciclo {{ item.cycle }} |
                    <span v-if="item.type">
                      {{ item.type.name }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-spacer />
        <v-col cols="auto">
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
          :subject="editedItem"
          :hourly-load="myHourlyLoad"
          @save="save"
          @cancel="close"
        />
      </v-dialog>

      <v-data-table
        :headers="headers"
        :items="mySubjects"
        sort-by="calories"
        class="elevation-1"
      >
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
            dark
            :color="getColor(schedule.section.id)"
          >
            {{ schedule.section.id }}
          </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-icon color="blue" v-on="on" @click="editItem(item)">
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-icon color="red" v-on="on" @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <span>Eliminar</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          ¿Estás segura de que quieres eliminar este curso?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeDelete">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">
            Aceptar
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="succcesAddCourse" color="blue" app timeout="3000">
      <v-icon> mdi-check </v-icon>
      Curso Agregado correctamente!
      <template #action="{ attrs }">
        <v-btn text small icon v-bind="attrs" @click="succcesAddCourse = false">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref, computed } from 'vue'
import Lottie from 'lottie-web'
import SubjectScheduleList from '~/components/subject/ScheduleList.vue'
import { useUserConfigStore } from '~/stores/user-config'
import { ISelectedSubject, ISubject } from '~/interfaces/subject'
import { useApi } from '~/composables/api'

export default defineComponent({
  name: 'MySubjects',
  components: {
    SubjectScheduleList,
  },
  setup() {
    const $api = useApi()
    onMounted(() => {
      Lottie.loadAnimation({
        container: document.getElementById('noData') as Element,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: require('~/assets/lottie/15538-cat-woow.json'),
      })
    })

    const configStore = useUserConfigStore()

    const succcesAddCourse = ref(false)

    const availableCourses = computed(() => {
      return subjects.value?.filter(
        (c1) => !mySubjects.value.some((c2) => c1.id === c2.id)
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

    const subjects = ref<ISubject[]>([])
    const dialog = ref(false)
    const loading = ref(false)
    const dialogDelete = ref(false)

    const defaultItem = ref<any>(null)
    const editedItem = ref<any>({})
    const editedIndex = ref(-1)

    const editItem = (item: ISelectedSubject) => {
      if (!item) {
        return
      }
      editedIndex.value = mySubjects.value.findIndex((c) => c.id === item?.id)
      editedItem.value = Object.assign({}, item)
      dialog.value = true
    }

    const deleteItem = (item: ISelectedSubject) => {
      editedIndex.value = mySubjects.value.findIndex((c) => c.id === item.id)
      editedItem.value = Object.assign({}, item)
      dialogDelete.value = true
    }

    const deleteItemConfirm = async () => {
      await configStore.deleteSubjectById(editedItem.value.id)
      closeDelete()
    }

    const close = () => {
      dialog.value = false
      editedItem.value = Object.assign({}, defaultItem.value)
      editedIndex.value = -1
    }

    const closeDelete = () => {
      dialogDelete.value = false
      editedItem.value = Object.assign({}, defaultItem.value)
      editedIndex.value = -1
    }

    const save = async (schedules: ISubject[]) => {
      succcesAddCourse.value = false

      if (editedIndex.value > -1 && schedules && schedules.length > 0) {
        await configStore.updateSubject({ ...editedItem.value, schedules })
        close()
      } else if (schedules && schedules.length > 0) {
        await configStore.saveNewSubject({ ...editedItem.value, schedules })
        close()
      } else if (editedIndex.value > -1) {
        await configStore.deleteSubjectById(editedItem.value.id)
      } else {
        close()
      }

      succcesAddCourse.value = true
    }

    const search = ref('')

    const onChangeSearch = async (search: string) => {
      if (configStore.specialityId && configStore.hourlyLoadId) {
        try {
          const response = await $api.course.findBySearch(
            search || '',
            configStore.specialityId,
            configStore.hourlyLoadId
          )
          subjects.value = response.data.content
        } catch (e) {
          console.error(e)
        }
      }
    }
    watch(search, onChangeSearch)

    const headers = ref([
      {
        text: 'Código',
        value: 'course.id',
      },
      {
        text: 'Nombre de curso',
        align: 'start',
        sortable: false,
        value: 'course.name',
      },
      {
        text: 'Secciones',
        value: 'sections',
      },
      {
        text: 'Creditos',
        value: 'credits',
      },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false,
      },
    ])

    const formTitle = computed(() => {
      return editedIndex.value === -1 ? 'New Item' : 'Edit Item'
    })

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
      defaultItem,
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
      onChangeSearch,
      availableCourses,
      totalCredits,
      formTitle,
      myHourlyLoad,
    }
  },
})
</script>

<style scoped></style>
