<template>
  <v-card density="compact" class="text-caption" max-width="400">
    <v-toolbar dense :color="selectedEvent.color">
      <v-btn icon>
        <v-icon>{{ mdiInformation }}</v-icon>
      </v-btn>

      <v-toolbar-title class="text-white"> Información </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="dialogSync = false">
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list-item>
      <template #prepend>
        <v-icon :color="selectedEvent.color + ' lighten-2'">
          {{ mdiBook }}
        </v-icon>
      </template>
      <v-list-item-title>
        {{ selectedEvent.title }}
      </v-list-item-title>
    </v-list-item>
    <v-divider inset />
    <v-list-item density="compact" lines="three">
      <template #prepend>
        <v-icon :color="selectedEvent.color + ' lighten-2'">
          {{ mdiText }}
        </v-icon>
      </template>

      <v-list-item-title style="white-space: pre-line">
        {{ selectedEvent.description }}
      </v-list-item-title>
    </v-list-item>
    <v-divider inset />
    <v-list-item density="compact">
      <template #prepend>
        <v-icon :color="selectedEvent.color + ' lighten-2'">
          {{ mdiCalendar }}
        </v-icon>
      </template>

      <v-list-item-title>
        {{ selectedDay }}, {{ selectedEvent.startTime }}-{{
          selectedEvent.endTime
        }}
      </v-list-item-title>
      <v-list-item-subtitle>{{ selectedEvent.type }}</v-list-item-subtitle>
    </v-list-item>

    <v-divider inset />
    <v-list-item density="compact">
      <template #prepend>
        <v-icon :color="selectedEvent.color + ' lighten-2 '">
          {{ mdiMapMarker }}
        </v-icon>
      </template>
      <v-list-item-title>{{ selectedEvent.location }}</v-list-item-title>
    </v-list-item>
  </v-card>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { computed, type Ref } from 'vue'
import type { IEvent } from '~/interfaces/event'
import { WEEK_DAYS_NAMES } from '~/constants/weekdays'
import {
  mdiInformation,
  mdiClose,
  mdiBook,
  mdiText,
  mdiCalendar,
  mdiMapMarker,
} from '@mdi/js'

const props = defineProps<{
  selectedEvent: IEvent
  dialog: boolean
}>()

const emit = defineEmits<{
  (event: 'update:dialog', value: boolean): void
}>()

const dialogSync = useVModel(props, 'dialog', emit)

const selectedDay: Ref<string> = computed(
  () => WEEK_DAYS_NAMES[props.selectedEvent.day],
)
</script>
