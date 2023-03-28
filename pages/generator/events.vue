<template>
  <v-data-table :headers="headers" :items="myEvents">
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Mis eventos</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
        <v-spacer />
        <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
          <template #activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo evento
            </v-btn>
          </template>
          <v-card>
            <v-card-title> Crear tu Evento </v-card-title>
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
    <template #[`item.color`]="{ item }">
      <v-badge :color="item.color" />
    </template>
    <template #[`item.schedule`]="{ item }">
      <div>
        {{ weekdays[item.day] }} : {{ item.startTime }} - {{ item.endTime }}
      </div>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon class="mr-2" color="primary" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon color="red" @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>
<script lang="ts">
import { defineComponent, ref, nextTick, computed } from 'vue'
import { v4 } from 'uuid'
import { useStore } from '@nuxtjs/composition-api'
import EventsCreator from '~/components/EventsCreatorForm.vue'
import { weekdays } from '~/utils/core'
import Event from '~/model/Event'

interface IEvent {
  id: null | string;
  title: null | string;
  day: null | number;
  color: string;
  type: string;
  startTime: null | string;
  endTime: null | string;
}

export default defineComponent({
  components: { EventsCreator },
  setup () {
    const store = useStore<{
      user: {
        events: {
          items: any[];
        };
      };
    }>()

    const myEvents = computed(() => store.state.user.events.items)

    const deleteEventById = async (id: string) => {
      await store.dispatch('user/events/deleteItemById', id)
    }

    const updateEvent = async (event: IEvent) => {
      await store.dispatch('user/events/updateItem', event)
    }

    const saveNewEvent = async (event: IEvent) => {
      await store.dispatch('user/events/saveNewItem', event)
    }

    const dialog = ref(false)

    const headers = [
      { text: 'Color', value: 'color' },
      { text: 'titulo', align: 'start', sortable: false, value: 'title' },
      { text: 'Horario', value: 'schedule' },
      { text: 'Acciones', value: 'actions', sortable: false }
    ]

    const defaultItem = ref<IEvent>({
      id: null,
      title: null,
      day: null,
      color: 'primary',
      type: 'myEvent',
      startTime: null,
      endTime: null
    })

    const editedItem = ref<IEvent>({
      id: null,
      title: null,
      day: null,
      color: 'primary',
      type: 'myEvent',
      startTime: null,
      endTime: null
    })

    const editedIndex = ref(-1)

    const dialogDelete = ref(false)

    const editItem = (item: any) => {
      editedIndex.value = myEvents.value.findIndex((c: any) => c.id === item.id)
      editedItem.value = Object.assign({}, item)
      dialog.value = true
    }

    const deleteItem = (item: any) => {
      editedIndex.value = myEvents.value.findIndex((c: any) => c.id === item.id)
      editedItem.value = Object.assign({}, item)
      dialogDelete.value = true
    }

    const deleteItemConfirm = () => {
      deleteEventById(editedItem.value.id!)
      closeDelete()
    }

    const close = () => {
      dialog.value = false
      nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
      })
    }

    const closeDelete = () => {
      dialogDelete.value = false
      nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
      })
    }

    const form = ref<EventsCreator>()

    const save = () => {
      if (!form?.value?.validated()) {
        return
      }

      const item = editedItem.value
      const event = new Event(
        item.day || 0,
        item.startTime!,
        item.endTime!,
        item.title!,
        item.title!,
        item.title!,
        item.color,
        'MY_EVENT',
        'MY_EVENT'
      )
      event.id = item.id || v4()
      if (editedIndex.value > -1) {
        updateEvent(editedItem.value)
      } else {
        saveNewEvent(editedItem.value)
      }
      close()
    }

    return {
      weekdays,
      dialog,
      headers,
      defaultItem,
      editedItem,
      editedIndex,
      dialogDelete,
      myEvents,
      editItem,
      deleteItem,
      deleteItemConfirm,
      close,
      closeDelete,
      save,
      form
    }
  }
})
</script>
