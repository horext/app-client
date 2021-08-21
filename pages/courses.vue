<template>
  <v-card tile flat>
    <v-card-text>
      <v-row>
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
            <template #selection="{item}">
              {{ item.course.id }} -  {{ item.course.name }}
            </template>
            <template #item="{item}">
              {{ item.course.id }} -  {{ item.course.name }}
            </template>
          </v-autocomplete>
        </v-col>
        <v-col col="12">
          <v-toolbar-title>Mis cursos seleccionados</v-toolbar-title>
        </v-col>
      </v-row>
      <v-dialog
        v-model="dialog"
        dense
        max-width="800"
        @click:outside="close"
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
        :items="myCourses"
        sort-by="calories"
        class="elevation-1"
      >
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
          <v-icon
            class="mr-2"
            color="primary"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            color="red"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
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
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import SubjectScheduleList from '~/components/subject/ScheduleList.vue'

@Component({
  layout: 'app',
  components: {
    SubjectScheduleList
  }
})
export default class myCourses extends Vue {
  get availableCourses () {
    return this.courses?.filter((c1: any) =>
      this.myCourses?.findIndex((c2: any) => c1.id === c2.id) === -1)
  }

  getColor (section: any) {
    const months = ['blue', 'purple', 'orange', 'indigo', 'teal']
    return months[section.charCodeAt(0) % months.length]
  }

  courses: Array<any> = []
  dialog = false
  loading = false
  dialogDelete = false

  defaultItem: any = null
  editedItem: any = { }
  editedIndex: number = -1

  editItem (item: any) {
    if (!item) {
      return
    }
    this.editedIndex = this.myCourses.findIndex((c: any) => c.id === item?.id)
    this.editedItem = Object.assign({}, item)
    this.dialog = true
  }

  deleteItem (item: any) {
    this.editedIndex = this.myCourses.findIndex((c: any) => c.id === item.id)
    this.editedItem = Object.assign({}, item)
    this.dialogDelete = true
  }

  deleteItemConfirm () {
    this.deleteMyCourseByIndex(this.editedIndex)
    this.closeDelete()
  }

  close () {
    this.dialog = false
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    })
  }

  closeDelete () {
    this.dialogDelete = false
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    })
  }

  save (schedules: string | any[]) {
    if (this.editedIndex > -1 && schedules && schedules.length > 0) {
      this.$store.commit('modules/MyData/updateMyCourseByIndex',
        {
          course: { ...this.editedItem, schedules },
          index: this.editedIndex
        })
      this.close()
    } else if (schedules && schedules.length > 0) {
      this.saveMyCourse({ ...this.editedItem, schedules })
      this.close()
    } else if (this.editedItem > -1) {
      this.deleteItem(this.editedItem)
    } else {
      this.close()
    }
  }

  saveMyCourse (course: any) {
    this.$store.commit('modules/MyData/addMyCourse', course)
  }

  deleteMyCourseByIndex (index: number) {
    this.$store.commit('modules/MyData/deleteMyCourseByIndex', index)
  }

  search: string = ''

  @Watch('search', { immediate: true })
  async onChangeSearch (search: string) {
    try {
      const response = await this.$api.course.findBySearch(
        search || '',
        this.$storage.getUniversal('mySpeciality')?.id,
        this.$storage.getUniversal('myHourlyLoad')?.id
      )
      this.courses = response.data.content
    } catch (e) {
      console.error(e)
    }
  }

  headers = [
    {
      text: 'Código',
      value: 'course.id'
    },
    {
      text: 'Nombre de curso',
      align: 'start',
      sortable: false,
      value: 'course.name'
    },
    {
      text: 'Secciones',
      value: 'sections'
    },
    {
      text: 'Acciones',
      value: 'actions',
      sortable: false
    }
  ]

  get formTitle () {
    return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
  }

  get myHourlyLoad () {
    return this.$store.state.storage.myHourlyLoad || null
  }

  set myHourlyLoad (hourlyLoad: any) {
    this.$storage.setUniversal('myHourlyLoad', hourlyLoad)
  }

  get myCourses () {
    return this.$store.state.modules.MyData.myCourses
  }

  set myCourses (courses: any) {
    this.$store.commit('modules/MyData/setMyCourses', courses)
  }
}
</script>

<style scoped>

</style>
