<template>
  <v-card
    class="mx-auto"
  >
    <v-toolbar
      :color="selectedEvent.color"
    >
      <v-btn icon @click="dialogSync=false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title class="white--text">
        Información
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
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
          {{ selectedEvent.name }} ({{selectedEvent.typeSchedule}})
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ selectedEvent.courseCode }}-{{ selectedEvent.sectionCode }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-icon>
        <v-btn icon>
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </v-list-item-icon>
    </v-list-item>
    <v-divider inset />
    <v-list-item>
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

    <template  v-if="selectedEvent.teacher">
      <v-divider inset />
      <v-list-item >
        <v-list-item-icon>
          <v-icon :color="selectedEvent.color+' lighten-2'">
            mdi-account
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ selectedEvent.teacher.lastName + ', ' + selectedEvent.teacher.firstName }}
          </v-list-item-title>
          <v-list-item-subtitle>Docente</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-btn @click="moreInfo" icon>
            <v-icon>mdi-information</v-icon>
          </v-btn>
        </v-list-item-icon>
      </v-list-item>

    </template>
    <v-divider inset />
    <v-list-item>
      <v-list-item-icon>
        <v-icon :color="selectedEvent.color+' lighten-2 '">
          mdi-map-marker
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ selectedEvent.aula }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>
<script lang="ts">
import { Vue, Prop, Component, PropSync } from 'nuxt-property-decorator'
import { weekdays } from '~/utils/core'
@Component
export default class EventInfoCard extends Vue {
  @Prop({ type: Object })
  selectedEvent!: any

  @PropSync('dialog', { type: Boolean })
  dialogSync!: boolean

  get selectedDay (): string {
    return this.weekdays[this.selectedEvent.day]
  }

  moreInfo(){

  }

  weekdays = weekdays
}
</script>
