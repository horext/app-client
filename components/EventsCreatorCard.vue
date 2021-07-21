<template>
  <v-card>
    <v-card-title>
      Crear tu Evento
    </v-card-title>
    <v-card-text>
      <EventsCreator ref="form" :event="event" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="dialog=false">
        Cancelar
      </v-btn>
      <v-btn text @click="save">
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, PropSync, Vue } from 'nuxt-property-decorator'
import EventsCreator from './EventsCreatorForm.vue'
import { convertToDate } from '~/utils/core'
import { VForm } from '~/types'

@Component({
  name: 'EventsCreatorCard',
  components: {
    EventsCreator
  }
})
export default class EventsCreatorCard extends Vue {
    @PropSync('close', { type: Boolean }) dialog!: boolean;

    form (): any {
      return this.$refs.form as VForm
    }

    save () {
      if (!this.form().validated()) {
        return
      }
      this.dialog = true
      this.$store.commit('modules/UserModule/addMyEvent',
        {
          ...this.event,
          id: Date.now().toString(),
          code: '',
          sectionCode: '',
          name: this.event.title,
          start: convertToDate(this.event.day, this.event.startTime),
          end: convertToDate(this.event.day, this.event.endTime),
          typeSchedule: 'myEvent'
        }
      )

      this.dialog = false
    }

    event:any = {
    }
}

</script>
