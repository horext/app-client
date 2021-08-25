<template>
  <v-data-table
    :headers="headers"
    :items="myEvents"
  >
    <template #top>
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
          <template #activator="{ on, attrs }">
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
              ¿Está seguro de eliminar este evento?
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
      </v-toolbar>
    </template>
    <template #item.color="{item}">
      <v-badge :color="item.color" />
    </template>
    <template #item.schedule="{item}">
      <div>
        {{ weekdays[item.day] }} : {{ item.startTime }} - {{ item.endTime }}
      </div>
    </template>
    <template #item.actions="{ item }">
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
import { Component, namespace, State, Vue } from 'nuxt-property-decorator'
import EventsCreator from '~/components/EventsCreatorForm.vue'
import { VForm } from '~/types'
import { weekdays } from '~/utils/core'
import Event from '~/model/Event'
import { v4 } from 'uuid'
const userEvents = namespace('user/events')

@Component({
  components: { EventsCreator }
})
export default class myEvents extends Vue {
  @State(state => state.user.events.items)
  myEvents!: Array<any>

  @userEvents.Action('deleteItemById')
  deleteEventById!: Function

  @userEvents.Action('updateItem')
  updateEvent!: Function

  @userEvents.Action('saveNewItem')
  saveNewEvent!: Function

  get weekdays () {
    return weekdays
  }

  dialog = false
  headers = [
    { text: 'Color', value: 'color' },
    {
      text: 'titulo',
      align: 'start',
      sortable: false,
      value: 'title'
    },
    { text: 'Horario', value: 'schedule' },
    { text: 'Acciones', value: 'actions', sortable: false }
  ]

  defaultItem: any = {
    id: null,
    title: null,
    day: null,
    color: 'primary',
    type: 'myEvent',
    startTime: null,
    endTime: null
  }

  editedItem: any = {
    id: null,
    title: null,
    day: null,
    color: 'primary',
    type: 'myEvent',
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
    this.deleteEventById(this.editedItem.id)
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
    const event = new Event(
      this.editedItem.day || 0,
      this.editedItem.startTime,
      this.editedItem.endTime,
      this.editedItem.title,
      this.editedItem.title,
      this.editedItem.title,
      this.editedItem.color,
      'MY_EVENT',
      ''
    )
    event.id = this.editedItem.id||v4()
    if (this.editedIndex > -1) {
      this.updateEvent(event)
    } else {
      this.saveNewEvent(event)
    }
    this.close()
  }

  form (): any {
    return this.$refs?.form as VForm
  }
}
</script>

<style scoped>

</style>
