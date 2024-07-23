<template>
  <v-row dense>
    <v-col cols="12">
      <v-data-table :headers="headers" :items="myEvents" mobile>
        <template #top>
          <v-toolbar density="compact" flat>
            <v-toolbar-title>Mis Actividades</v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <activity-create-form-dialog
              v-model="dialog"
              :event="editedItem"
              @save:event="save"
              @cancel="close"
            />
            <base-confirm-dialog
              v-model="dialogDelete"
              @click:confirm="deleteItemConfirm"
              @click:reject="closeDelete"
            >
              ¿Está seguro de eliminar esta actividad?
            </base-confirm-dialog>
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
            {{ WEEK_DAYS[item.day] }} : {{ item.startTime }} -
            {{ item.endTime }}
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

      <base-snackbar v-model="succcesAddEvent">
        <span class="mr-4"> Actividad creada correctamente </span>
      </base-snackbar>
      <base-snackbar v-model="succcesUpdateEvent">
        <span class="mr-4"> Actividad actualizada correctamente </span>
      </base-snackbar>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Activity } from '~/models/Event'
import { useUserEventsStore } from '~/stores/user-events'
import type { IEvent } from '~/interfaces/event'
import { WEEK_DAYS } from '~/constants/weekdays'
import { mdiPencil, mdiDelete } from '@mdi/js'
import { EVENT_HEADERS } from '~/constants/event'

const store = useUserEventsStore()

const myEvents = computed(() => store.items)
const succcesAddEvent = ref(false)
const succcesUpdateEvent = ref(false)
const dialog = ref(false)

const headers = EVENT_HEADERS

const editedItem = ref<IEvent>(new Activity())

const DEFAULT_INDEX = -1

const editedIndex = ref(DEFAULT_INDEX)

const dialogDelete = ref(false)

const editItem = (item: IEvent) => {
  editedIndex.value = myEvents.value.findIndex((c) => c.id === item.id)
  editedItem.value = item
  dialog.value = true
}

const deleteItem = (item: IEvent) => {
  editedIndex.value = myEvents.value.findIndex((c) => c.id === item.id)
  editedItem.value = item
  dialogDelete.value = true
}

const deleteItemConfirm = () => {
  store.deleteItemById(editedItem.value.id!)
  closeDelete()
}

const close = () => {
  editedItem.value = new Activity()
  editedIndex.value = DEFAULT_INDEX

  dialog.value = false
}

const closeDelete = () => {
  dialogDelete.value = false
  editedItem.value = new Activity()
  editedIndex.value = DEFAULT_INDEX
}

const save = async (item: IEvent) => {
  const event = Activity.buildFrom(item)
  if (editedIndex.value > -1) {
    store.updateItem(event)
    succcesUpdateEvent.value = true
  } else {
    store.saveNewItem(event)
    succcesAddEvent.value = true
  }
  close()
}
</script>
