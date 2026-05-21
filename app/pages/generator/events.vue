<template>
  <v-row density="comfortable">
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="activities"
        class="elevation-1"
        mobile-breakpoint="md"
        :mobile="null"
      >
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
              v-if="selectedDeleteItem"
              v-model="dialogDelete"
              @click:confirm="deleteItemConfirm(selectedDeleteItem)"
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
            {{ WEEK_DAYS_NAMES[item.day] }} : {{ item.startTime }} -
            {{ item.endTime }}
          </div>
        </template>
        <template #[`item.actions`]="{ item }">
          <activity-table-item-actions
            @click:edit="editItem(item)"
            @click:delete="deleteItem(item)"
          />
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
import { ref } from 'vue'
import { WEEK_DAYS_NAMES } from '~/constants/weekdays'
import { EVENT_HEADERS } from '~/constants/event'
import type { Activity } from '~/models/Event'

useSeoMeta({
  title: 'Mis Actividades - Generador de Horarios',
  description:
    'Administra tus actividades para tener un mejor control de tu tiempo',
})

const succcesAddEvent = ref(false)
const succcesUpdateEvent = ref(false)
const dialog = ref(false)

const headers = EVENT_HEADERS

const editedItem = ref<IEventCreated | null>(null)

const dialogDelete = ref(false)

const editItem = (item: IEventCreated) => {
  editedItem.value = item
  dialog.value = true
}

const {
  deleteItemById,
  updateItem,
  createNewItem,
  items: activities,
} = useUserEvents()

const selectedDeleteItem = ref<IEventCreated>()
const deleteItem = (item: IEventCreated) => {
  selectedDeleteItem.value = item
  dialogDelete.value = true
}

const deleteItemConfirm = (selectedItem: IEventCreated) => {
  deleteItemById(selectedItem.id!)
  closeDelete()
}

const close = () => {
  editedItem.value = null
  dialog.value = false
}

const closeDelete = () => {
  dialogDelete.value = false
}

const save = async (event: Activity) => {
  if (event.id) {
    updateItem(event)
    succcesUpdateEvent.value = true
  } else {
    createNewItem(event)
    succcesAddEvent.value = true
  }
  close()
}
</script>
