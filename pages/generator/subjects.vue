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
      >
        <SubjectScheduleList
          :subject="editedItem"
          :hourly-load="myHourlyLoad"
          @save="save"
        />
      </v-dialog>

      <v-data-table
        :headers="headers"
        :items="mySubjects"
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
import { Component, namespace, State, Vue, Watch } from 'nuxt-property-decorator'
import SubjectScheduleList from '~/components/subject/ScheduleList.vue'
const userConfig = namespace('user/config')
@Component({
  components: {
    SubjectScheduleList
  }
})
export default class mySubjects extends Vue {
  get availableCourses () {
    return this.subjects?.filter((c1: any) =>
      this.mySubjects?.findIndex((c2: any) => c1.id === c2.id))
  }

  getColor (section: any) {
    const months = ['blue', 'purple', 'orange', 'indigo', 'teal']
    return months[section.charCodeAt(0) % months.length]
  }

  @State(state => state.user.config.subjects)
  mySubjects!: Array<any>

  @userConfig.Action('deleteSubjectById')
  deleteSubjectById!: Function

  @userConfig.Action('updateSubject')
  updateSubject!: Function

  @userConfig.Action('saveNewSubject')
  saveNewSubject!: Function

  subjects: Array<any> = []
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
    this.editedIndex = this.mySubjects.findIndex((c: any) => c.id === item?.id)
    this.editedItem = Object.assign({}, item)
    this.dialog = true
  }

  deleteItem (item: any) {
    this.editedIndex = this.mySubjects.findIndex((c: any) => c.id === item.id)
    this.editedItem = Object.assign({}, item)
    this.dialogDelete = true
  }

  async deleteItemConfirm () {
    await this.deleteSubjectById(this.editedItem.id)
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

  async save (schedules: string | any[]) {
    if (this.editedIndex > -1 && schedules && schedules.length > 0) {
      await this.updateSubject({ ...this.editedItem, schedules })
      this.close()
    } else if (schedules && schedules.length > 0) {
      await this.saveNewSubject({ ...this.editedItem, schedules })
      this.close()
    } else if (this.editedItem > -1) {
      await this.deleteSubjectById(this.editedItem.id)
    } else {
      this.close()
    }
  }

  search: string = ''

  @Watch('search')
  async onChangeSearch (search: string) {
    if (this.$store.getters['user/config/specialityId'] && this.$store.getters['user/config/hourlyLoadId']) {
      try {
        const response = await this.$api.course.findBySearch(
          search || '',
          this.$store.getters['user/config/specialityId'],
          this.$store.getters['user/config/hourlyLoadId']
        )
        this.subjects = response.data.content
      } catch (e) {
        console.error(e)
      }
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
    return this.$store.state.user.config.hourlyLoad
  }
}
</script>

<style scoped>

</style>
