<template>
  <v-row dense>
    <v-col cols="12">
      <v-data-table :headers="headers" :items="myEvents">
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Mis Actividades</v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
            <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
              <template #activator="{ props }">
                <v-btn color="primary" theme="dark" class="mb-2" v-bind="props">
                  Nueva Actividad
                </v-btn>
              </template>
              <v-card>
                <v-card-title> Crear tu Actividad </v-card-title>
                <v-card-text>
                  <events-creator ref="form" v-model:event="editedItem" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn variant="text" @click="close"> Cancelar </v-btn>
                  <v-btn variant="text" @click="save"> Guardar </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">
                  ¿Está seguro de eliminar esta actividad?
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="closeDelete"
                  >
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
          <v-icon color="red" @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>

      <v-snackbar
        v-model="succcesAddEvent"
        color="blue"
        timeout="3000"
        location="bottom"
      >
        <v-icon> mdi-check </v-icon>
        <span class="mr-4"> Actividad creada correctamente </span>
        <template #actions>
          <v-btn
            variant="text"
            size="small"
            icon
            @click="succcesAddEvent = false"
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar
        v-model="succcesUpdateEvent"
        color="blue"
        timeout="3000"
        location="bottom"
      >
        <v-icon> mdi-check </v-icon>
        <span class="mr-4"> Actividad actualizada correctamente </span>
        <template #actions>
          <v-btn
            variant="text"
            size="small"
            icon
            @click="succcesUpdateEvent = false"
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { defineComponent, ref, nextTick, computed } from 'vue'
import { v4 } from 'uuid'
import EventsCreator from '~/components/EventsCreatorForm.vue'
import Event from '~/model/Event'
import { useUserEventsStore } from '~/stores/user-events'
import type { IEvent } from '~/interfaces/event'
import { WEEK_DAYS } from '~/constants/weekdays'

export default defineComponent({
  components: { EventsCreator },
  setup() {
    const store = useUserEventsStore()

    const myEvents = computed(() => store.items)
    const succcesAddEvent = ref(false)
    const succcesUpdateEvent = ref(false)
    const dialog = ref(false)

    const headers = [
      { text: 'Color', value: 'color' },
      { text: 'titulo', align: 'start', sortable: false, value: 'title' },
      { text: 'Horario', value: 'schedule' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ]

    const defaultItem = ref<IEvent>({
      id: undefined,
      title: '',
      day: undefined,
      color: 'primary',
      type: 'myEvent',
      startTime: undefined,
      endTime: undefined,
    })

    const editedItem = ref<IEvent>({
      id: undefined,
      title: '',
      day: undefined,
      color: 'primary',
      type: 'myEvent',
      startTime: undefined,
      endTime: undefined,
    })

    const editedIndex = ref(-1)

    const dialogDelete = ref(false)

    const editItem = (item: Event) => {
      editedIndex.value = myEvents.value.findIndex((c) => c.id === item.id)
      editedItem.value = Object.assign({}, item)
      dialog.value = true
    }

    const deleteItem = (item: Event) => {
      editedIndex.value = myEvents.value.findIndex((c) => c.id === item.id)
      editedItem.value = Object.assign({}, item)
      dialogDelete.value = true
    }

    const deleteItemConfirm = () => {
      store.deleteItemById(editedItem.value.id!)
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

    const form = ref<typeof EventsCreator>()

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
        'MY_EVENT',
      )
      event.id = item.id || v4()
      if (editedIndex.value > -1) {
        store.updateItem(event)
        succcesUpdateEvent.value = true
      } else {
        store.saveNewItem(event)
        succcesAddEvent.value = true
      }
      close()
    }

    return {
      weekdays: WEEK_DAYS,
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
      form,
      succcesAddEvent,
      succcesUpdateEvent,
    }
  },
})
</script>
