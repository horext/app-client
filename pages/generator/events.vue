<template>
  <v-row dense>
    <v-col cols="12">
      <v-data-table :headers="headers" :items="myEvents" mobile>
        <template #top>
          <v-toolbar density="compact" flat>
            <v-toolbar-title>Mis Actividades</v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
              <template #activator="{ props }">
                <v-btn color="primary" theme="dark" v-bind="props">
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
          <v-card flat>
            <v-card-text>
              Añade tus actividades para tener un mejor control de tu tiempo,
              como por ejemplo, estudiar, hacer ejercicio, etc.
            </v-card-text>
          </v-card>
          <v-divider />
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
            {{ mdiPencil }}
          </v-icon>
          <v-icon color="red" @click="deleteItem(item)">
            {{ mdiDelete }}
          </v-icon>
        </template>
      </v-data-table>

      <v-snackbar
        v-model="succcesAddEvent"
        color="blue"
        timeout="3000"
        location="bottom"
      >
        <v-icon>{{ mdiCheck }}</v-icon>
        <span class="mr-4"> Actividad creada correctamente </span>
        <template #actions>
          <v-btn
            variant="text"
            size="small"
            icon
            @click="succcesAddEvent = false"
          >
            <v-icon>{{ mdiClose }}</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar
        v-model="succcesUpdateEvent"
        color="blue"
        timeout="3000"
        location="bottom"
      >
        <v-icon> {{ mdiCheck }} </v-icon>
        <span class="mr-4"> Actividad actualizada correctamente </span>
        <template #actions>
          <v-btn
            variant="text"
            size="small"
            icon
            @click="succcesUpdateEvent = false"
          >
            <v-icon> {{ mdiClose }} </v-icon>
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
import Event from '~/models/Event'
import { useUserEventsStore } from '~/stores/user-events'
import type { IEvent } from '~/interfaces/event'
import { WEEK_DAYS } from '~/constants/weekdays'
import { mdiPencil, mdiDelete, mdiCheck, mdiClose } from '@mdi/js'

export default defineComponent({
  components: { EventsCreator },
  setup() {
    const store = useUserEventsStore()

    const myEvents = computed(() => store.items)
    const succcesAddEvent = ref(false)
    const succcesUpdateEvent = ref(false)
    const dialog = ref(false)

    const headers = [
      { title: 'Color', value: 'color' },
      { title: 'titulo', align: 'start', sortable: false, value: 'title' },
      { title: 'Horario', value: 'schedule' },
      { title: 'Acciones', value: 'actions', sortable: false },
    ] as const

    const editedItem = ref<IEvent>(
      new Event(1, '08:00', '10:00', '', '', '', '#1976d2', 'MY_EVENT'),
    )

    const editedIndex = ref(-1)

    const dialogDelete = ref(false)

    const editItem = (item: IEvent) => {
      editedIndex.value = myEvents.value.findIndex((c) => c.id === item.id)
      editedItem.value = Object.assign({}, item)
      dialog.value = true
    }

    const deleteItem = (item: IEvent) => {
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
        editedItem.value = new Event(
          1,
          '08:00',
          '10:00',
          '',
          '',
          '',
          '#1976d2',
          'MY_EVENT',
        )
        editedIndex.value = -1
      })
    }

    const closeDelete = () => {
      dialogDelete.value = false
      nextTick(() => {
        editedItem.value = new Event(
          1,
          '08:00',
          '10:00',
          '',
          '',
          '',
          '#1976d2',
          'MY_EVENT',
        )
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
        item.day,
        item.startTime,
        item.endTime,
        item.title,
        item.title,
        item.title,
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
      mdiPencil,
      mdiDelete,
      mdiCheck,
      mdiClose,
    }
  },
})
</script>
