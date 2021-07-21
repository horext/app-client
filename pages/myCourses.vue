<template>
  <v-card tile flat>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            v-model="editedItem"
            shaped
            filled
            :items="availableCourses"
            item-text="name"
            append-icon="mdi-magnify"
            label="Busca cursos para agregar"
            return-object
            hide-details
            @input="editItem"
          />
        </v-col>
        <v-col col="12">
          <v-toolbar-title>Mis cursos seleccionados</v-toolbar-title>
        </v-col>
      </v-row>
      <course-schedules
        v-if="dialog"
        :course.sync="editedItem"
        :open.sync="dialog"
        :hourly-load="myHourlyLoad"
        @update:course="save"
      />
    </v-card-text>
    <v-data-table
      :headers="headers"
      :items="myCourses"
      sort-by="calories"
      class="elevation-1"

    >
      <template v-slot:item.sections="{ item }">
        <v-chip
          v-for="schedule in item.sections"
          :key="schedule.id"
          dark
          :color="getColor(schedule.section.id)"
        >
          {{ schedule.section.id }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
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

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Are you sure you want to delete this item?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeDelete">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'

@Component({
  layout: 'app'
})
export default class myCourses extends Vue {
  @Watch('myHourlyLoad', { immediate: true })
  async onChangeHourlyLoad (hourlyLoad: any) {
    if (this.$storage.getUniversal('mySpeciality') && hourlyLoad) {
      const response = await this.$api.get(
        '/subjects', {
          params: {
            speciality: this.$storage.getUniversal('mySpeciality').id,
            hourlyLoad: hourlyLoad.id
          }
        }
      )
      this.courses = response.data
    }
  }

  get availableCourses () {
    return this.courses.filter((c1: any) =>
      this.myCourses
        .findIndex((c2: any) => c1.id === c2.id))
  }

  getColor (section: any) {
    const months = ['blue', 'purple', 'orange', 'indigo', 'teal']
    return months[section.charCodeAt() % months.length]
  }

  courses: Array<any> = []
  dialog = false
  dialogDelete = false

  defaultItem: any = null
  editedItem: any = null
  editedIndex: number = -1

  editItem (item: any) {
    this.editedIndex = this.myCourses.findIndex((c: any) => c.id === item.id)
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

  save () {
    if (this.editedIndex > -1 && this.editedItem.sections && this.editedItem.sections.length > 0) {
      this.$store.commit('modules/MyData/updateMyCourseByIndex',
        { course: this.editedItem, index: this.editedIndex })
      this.close()
    } else if (this.editedItem.sections && this.editedItem.sections.length > 0) {
      this.saveMyCourse(this.editedItem)
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

  headers = [
    { text: 'Código', value: 'code' },
    {
      text: 'Nombre de curso',
      align: 'start',
      sortable: false,
      value: 'name'
    },
    { text: 'Secciones', value: 'sections' },
    { text: 'Acciones', value: 'actions', sortable: false }
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
