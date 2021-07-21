<template>
  <v-data-table
    :headers="headers"
    :items="myEvents"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Mis eventos</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        />
        <v-spacer />
        <v-dialog
          v-model="dialog"
          max-width="500px"
          @click:outside="close"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Nuevo evento
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              Crear tu Evento
            </v-card-title>
            <v-card-text>
              <events-creator
                ref="form"
                :event="editedItem"
                @update:event="save"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="close">
                Cancelar
              </v-btn>
              <v-btn text @click="save">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      </v-toolbar>
    </template>
    <template #item.schedule="{item}">
      <div>
        {{ weekdays[item.day] }} : {{ item.startTime }} - {{ item.endTime }}
      </div>
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
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import EventsCreator from '~/components/EventsCreatorForm.vue'
import { VForm } from '~/types'
import { convertToDate, weekdays } from '~/utils/core'

@Component({
  components: { EventsCreator },
  layout: 'app'
})
export default class myEvents extends Vue {
  get weekdays () {
    return weekdays
  }

  dialog = false
  headers = [
    { text: '#', value: 'id' },
    {
      text: 'Nombre',
      align: 'start',
      sortable: false,
      value: 'name'
    },
    { text: 'Horario', value: 'schedule' },
    { text: 'Acciones', value: 'actions', sortable: false }
  ]

  defaultItem: any = {
    id: null,
    title: null,
    day: null,
    color: 'primary',
    typeSchedule: 'myEvent',
    startTime: null,
    endTime: null
  }

  editedItem: any = {
    id: null,
    title: null,
    day: null,
    color: 'primary',
    typeSchedule: 'myEvent',
    startTime: null,
    endTime: null
  }

  editedIndex: number = -1

  dialogDelete = false
  editItem (item: any) {
    this.editedIndex = this.myEvents.findIndex((c:any) => c.id === item.id)
    this.editedItem = Object.assign({}, item)
    this.dialog = true
  }

  deleteItem (item: any) {
    this.editedIndex = this.myEvents.findIndex((c:any) => c.id === item.id)
    this.editedItem = Object.assign({}, item)
    this.dialogDelete = true
  }

  deleteItemConfirm () {
    this.$store.commit('modules/MyData/deleteMyEventByIndex',
      this.editedIndex)
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
    if (!this.form().validated()) {
      return
    }
    if (this.editedIndex > -1) {
      this.$store.commit('modules/MyData/updateMyEventByIndex',
        {
          event: {
            ...this.editedItem,
            id: Date.now().toString(),
            code: '',
            sectionCode: '',
            name: this.editedItem.title,
            start: convertToDate(this.editedItem.day, this.editedItem.startTime),
            end: convertToDate(this.editedItem.day, this.editedItem.endTime),
            typeSchedule: 'myEvent'
          },
          index: this.editedIndex
        })
    } else {
      this.$store.commit('modules/MyData/addMyEvent',
        {
          ...this.editedItem,
          id: Date.now().toString(),
          code: '',
          sectionCode: '',
          name: this.editedItem.title,
          start: convertToDate(this.editedItem.day, this.editedItem.startTime),
          end: convertToDate(this.editedItem.day, this.editedItem.endTime),
          typeSchedule: 'myEvent'
        }
      )
    }
    this.close()
  }

  form (): any {
    return this.$refs.form as VForm
  }

  get myEvents () {
    return this.$store.state.modules.MyData.myEvents
  }

  event:any = {
  }
}
</script>

<style scoped>

</style>
