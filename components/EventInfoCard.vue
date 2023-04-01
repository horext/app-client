<template>
  <v-card
    max-width="400"
  >
    <v-toolbar
      dense
      :color="selectedEvent.color"
    >
      <v-btn icon>
        <v-icon>mdi-information</v-icon>
      </v-btn>

      <v-toolbar-title class="white--text">
        Información
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="dialogSync=false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list-item>
      <v-list-item-icon>
        <v-icon :color="selectedEvent.color+' lighten-2'">
          mdi-book
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ selectedEvent.title }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn icon>
          <v-icon dense>
            mdi-information
          </v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-divider inset />
    <v-list-item dense three-line>
      <v-list-item-icon>
        <v-icon :color="selectedEvent.color+' lighten-2'">
          mdi-text
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title style="white-space: pre-line">
          {{ selectedEvent.description }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider inset />
    <v-list-item dense>
      <v-list-item-icon>
        <v-icon :color="selectedEvent.color+' lighten-2'">
          mdi-calendar
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ selectedDay }},
          {{ selectedEvent.startTime }}-{{ selectedEvent.endTime }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ selectedEvent.type }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider inset />
    <v-list-item dense>
      <v-list-item-icon>
        <v-icon :color="selectedEvent.color+' lighten-2 '">
          mdi-map-marker
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ selectedEvent.location }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, Ref } from 'vue'
import Event from '~/model/Event'

export default defineComponent({
  props: {
    selectedEvent: {
      type: Object as PropType<Event>,
      required: true
    },
    dialog: {
      type: Boolean as PropType<boolean>,
      required: true
    }
  },
  emits: ['update:dialog'],
  setup (props, { emit }) {
    const dialogSync = computed({
      get () {
        return props.dialog
      },
      set (result) {
        emit('update:dialog', result)
      }
    })

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const selectedDay: Ref<string> = computed(() => weekdays[props.selectedEvent.day])

    const moreInfo = () => {
      // do something
    }

    return {
      selectedDay,
      weekdays,
      moreInfo,
      dialogSync
    }
  }
})
</script>
