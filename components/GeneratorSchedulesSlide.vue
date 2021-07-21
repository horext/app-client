<template>
  <v-card-text>
    <v-list-item-title>
      Horarios
    </v-list-item-title>
    <v-badge
      bordered
      class="ma-1"
      color="error"
      :content="schedules.length"
      icon="mdi-lock"
      overlap
    >
      <v-btn color="success" rounded @click="showSchedules">
        Ver horarios Generados
      </v-btn>
    </v-badge>
    <v-badge
      class="ma-1"
      bordered
      color="error"
      :content="myFavoritesSchedules.length"
      icon="mdi-lock"
      overlap
    >
      <v-btn color="warning" rounded @click="openMyFavoritesSchedules=true">
        Horarios Favoritos
      </v-btn>
    </v-badge>
    <v-row>
      <v-col align-self="center">
        <v-text-field
          v-model.number="maxIntersections"
          label="# Cruces  máx."
          messages="Según reglamento máximo 2 "
          type="number"
        />
      </v-col>
      <v-col>
        <v-checkbox v-model="intersectEvents" dense label="Cruzar con mis eventos" />
      </v-col>
    </v-row>

    <v-list-item-title>
      Mis cursos seleccionados
    </v-list-item-title>
    <CoursesList :courses="myCourses" :add-courses="addCourses" @update:courses="updateCourses">
      <template v-slot:lasItem>
        <v-btn
          small
          tile
          depressed
          rounded
          @click="addCourses"
        >
          Añadir cursos
        </v-btn>
      </template>
    </CoursesList>
    <v-list-item-title>
      Mis Eventos
    </v-list-item-title>
    <EventsList :events="myEvents" :edit-events="editEvents" @delete="deleteMyEvent" />
    <v-dialog v-model="dialog" max-width="800">
      <SelectCoursesCard :close.sync="dialog" />
    </v-dialog>
    <v-dialog v-model="openEventsCreator" max-width="800">
      <EventsCreatorCard :close.sync="openEventsCreator" />
    </v-dialog>

    <v-dialog v-model="openMySchedules" fullscreen>
      <schedules-presentation
        color="success"
        title="Horarios Generados"
        empty-message="Usted no tiene horarios generados"
        :schedules="schedules"
        :dialog.sync="openMySchedules"
      >
        <template #emptyBody>
          <v-container>
            <v-alert
              prominent
              type="error"
            >
              <v-row align="center">
                <v-col class="grow">
                  Lo sentimos, no hemos encontrados horarios :(
                </v-col>
                <!--                <v-col class="shrink">-->
                <!--                  <v-btn>Take action</v-btn>-->
                <!--                </v-col>-->
              </v-row>
            </v-alert>
            <occurrences-list :items="occurrences" />
          </v-container>
        </template>
        <template #options>
          <v-tooltip left>
            <template v-slot:activator="{on, attrs}">
              <v-btn
                fab
                dark
                small
                color="green"
                v-bind="attrs"
                v-on="on"
                @click="generarTodosMisHorarios"
              >
                <v-icon> mdi-update</v-icon>
              </v-btn>
            </template>
            <span>Actualizar</span>
          </v-tooltip>
        </template>
        <template #emptyOptions>
          <v-tooltip left>
            <template v-slot:activator="{on, attrs}">
              <v-btn
                fab
                dark
                small
                color="green"
                v-bind="attrs"
                v-on="on"
                @click="generarTodosMisHorarios"
              >
                <v-icon> mdi-update</v-icon>
              </v-btn>
            </template>
            <span>Actualizar</span>
          </v-tooltip>
        </template>
      </schedules-presentation>
      <v-dialog
        v-model="openWelcome"
        persistent
        max-width="500"
      >
        <schedules-welcome :show-welcome.sync="showWelcome" @close="closeWelcome()" />
      </v-dialog>
      <v-dialog
        v-model="openAlert"
        persistent
        max-width="500"
      >
        <v-card>
          <v-card-title>
            Atención
            <v-spacer />
            <v-btn icon @click="closeAlert()">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row align="center">
              <v-col class="shrink center" align-self="center">
                <v-btn color="success" depressed fab>
                  <v-icon>mdi-update</v-icon>
                </v-btn>
              </v-col>
              <v-col class="healine">
                Se ha detectado un cambio en sus cursos o eventos.
                ¿Desea que se actualice automáticamente?
                Si no lo marca tendrá que generar actualizaciones manualmente
                <v-checkbox
                  v-model="automaticUpdateSync"
                  color="success"
                  messages="Puede modificar la configuración más tarde"
                  label="Generar automáticamente mis horarios"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-dialog>
    <v-dialog v-model="openMyFavoritesSchedules" fullscreen>
      <SchedulesPresentation
        color="warning"
        title="Horarios Favoritos"
        empty-message="Usted no tiene horarios favoritos"
        :current-schedule.sync="currentSchedule"
        :schedules="myFavoritesSchedules"
        :dialog.sync="openMyFavoritesSchedules"
      />
    </v-dialog>
  </v-card-text>
</template>

<script lang="ts">
import { Component, getModule, namespace, Vue, Watch } from 'nuxt-property-decorator'
import { generate } from '~/utils/core'

import { Course, Event } from '~/types'

import UserModule from '~/store/modules/UserModule'
import SelectCoursesCard from '~/components/SelectCoursesCard.vue'
import OccurrencesList from '~/components/OccurrencesList.vue'
import EventsList from '~/components/EventsList.vue'
import SelectSections from '~/components/SelectSections.vue'
import CoursesList from '~/components/CoursesList.vue'
import EventsCreator from '~/components/EventsCreatorForm.vue'
import EventsCreatorCard from '~/components/EventsCreatorCard.vue'

import SchedulesWelcome from '~/components/SchedulesWelcome.vue'

import SelectCourses from '~/components/SelectCoursesForm.vue'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'

const userModule = namespace('modules/UserModule')

interface Schedule {
  id: any
}

@Component({
  name: 'SchedulesGenerator',
  components: {
    SchedulesPresentation,
    SelectSections,
    SchedulesWelcome,
    EventsCreatorCard,
    EventsCreator,
    EventsList,
    SelectCoursesCard,
    CoursesList,
    SelectCourses,
    OccurrencesList
  }
})
export default class SchedulesGenerator extends Vue {
  maxIntersections = 0

  intersectEvents = false

  @userModule.State
  myCourses!: Array<Course>;

  @userModule.State
  myFavoritesSchedules!: Array<Schedule>;

  @userModule.State
  myEvents!: Array<Event>;

  @userModule.State
  firstEntry!: boolean;

  @userModule.State
  automaticUpdateAlert!: boolean;

  @userModule.State
  automaticUpdate!: boolean;

  currentSchedule: any = {};

  changeMyCourses = false;
  changeMyEvents = false;

  occurrences: Array<any> = []

  vCalendar: any = {}

  get generatorOptions () {
    return {
      maxIntersections: this.maxIntersections,
      intersectEvents: this.intersectEvents
    }
  }

  changeOptions = false

  @Watch('generatorOptions')
  onChangeGeneratorOptions () {
    this.changeOptions = true
  }

  @Watch('myCourses', { immediate: true })
  onChangeMyCourses (newValue: any, oldValue: any) {
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue) && this.automaticUpdate) {
      this.changeMyCourses = true
    }
  }

  get schedules () {
    return this.$store.state.modules.UserModule.mySchedules
  }

  set schedules (newValue) {
    this.$store.commit('modules/UserModule/setMySchedules', newValue)
  }

  @Watch('myEvents', { immediate: true })
  onChangeMyEvents () {
    this.changeMyEvents = true
  }

  dialog = false;
  dialogShare = false;
  dialogExport = false;

  openEventsCreator = false;
  openMySchedules = false;
  openMyFavoritesSchedules = false;

  openWelcome = false;

  addCourses () {
    this.dialog = true
  }

  openAlert = false;

  showWelcome = true;

  closeWelcome () {
    this.openWelcome = false
    const userInstance = getModule(UserModule, this.$store)
    if (this.showWelcome) {
      userInstance.setFirstEntry(!this.showWelcome)
    }
  }

  automaticUpdateSync = true;

  closeAlert () {
    this.openAlert = false
    if (this.automaticUpdateSync) {
      this.generarTodosMisHorarios()
    }
    const userInstance = getModule(UserModule, this.$store)
    userInstance.setAutomaticUpdate(this.automaticUpdateSync)
    userInstance.setAutomaticUpdateAlert(false)
  }

  showSchedules () {
    this.openMySchedules = true
    if ((this.changeMyCourses || this.changeMyEvents || this.changeOptions) && this.automaticUpdate) {
      this.generarTodosMisHorarios()
      this.changeMyCourses = false
      this.changeMyEvents = false
      this.changeOptions = false
    }
    if (this.firstEntry) {
      setTimeout((): void => {
        this.openWelcome = true
      }, 200)
    }
    if (this.automaticUpdateAlert) {
      setTimeout((): void => {
        this.openAlert = true
      }, 100)
    }
  }

  updateCourses (courses: Course[]) {
    const userInstance = getModule(UserModule, this.$store)
    userInstance.setMyCourses(courses)
  }

  editEvents () {
    this.openEventsCreator = true
  }

  generarTodosMisHorarios () {
    const { schedules, ocurrences } = generate(this.myCourses, this.myEvents, this.maxIntersections, this.intersectEvents)
    console.log(schedules)
    this.schedules = schedules
    this.occurrences = ocurrences
    console.log('generando...')
  }

  deleteMyEvent (event: any) {
    this.$store.commit('modules/UserModule/deleteMyEvent', event)
  }

  mounted () {
    this.vCalendar = document.getElementById('calendar')
  }
}
</script>
