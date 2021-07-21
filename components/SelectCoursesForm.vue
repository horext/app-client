<template>
  <v-card-text>
    <v-form
      ref="form"
      v-model="syncedValid"
    >
      <v-autocomplete
        ref="select"
        v-model="selectedCourses"
        :loading="loading"
        :items="courses"
        placeholder="Añade un curso"
        filled
        solo-inverted
        chips
        :filter="customFilter"
        color="primary"
        return-object
        multiple
        :rules="[v => !!v || 'Item is required']"
        label="Elige tus cursos"
      >
        <template v-slot:selection="{attrs,item,selected}">
          <v-chip
            v-bind="attrs"
            :input-value="selected"
            color="primary lighten-1"
            small
            close
            @click:close="remove(item)"
          >
            <v-btn
              color="secondary"
              icon
              small
              class="notranslate v-icon--left "
              @click="selectSections(item)"
            >
              <v-icon>
                mdi-circle-edit-outline
              </v-icon>
            </v-btn>
            <span
              class="d-inline-block text-truncate"
              style="max-width: inherit ;"
            >
              {{ item.name }}
            </span>

            <v-avatar v-for="schedule in selectedSections(item)" :key="schedule.id" color="secondary lighten-1">
              {{ schedule.section.id }}
            </v-avatar>
          </v-chip>
        </template>
        <template v-slot:item="{item,on,attrs}">
          <template v-if="typeof item !== 'object'">
            <v-list-item-content v-text="item" />
          </template>
          <template v-else>
            <v-list-item v-bind="attrs" v-on="on" @click="selectSections(item)">
              <v-list-item-content>
                <v-list-item-title>{{ item.code }}-{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>
        <template v-slot:no-data>
          <v-list-item>
            <v-progress-circular
              v-if="loading"
              :width="3"
              color="red"
              indeterminate
            />
            <v-list-item-content v-else>
              No se han encontrado resultados
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-autocomplete>
    </v-form>

    <SelectSections
      :open.sync="dialog"
      :course="selectedCourse"
      @save="addCourse"
      @cancel="cancelCourse"
    />
  </v-card-text>
</template>

<script lang="ts">
import { Component, getModule, namespace, PropSync, Vue, Watch } from 'nuxt-property-decorator'
import { Course, Faculty, Speciality, VForm } from '~/types'
import SelectSections from '~/components/SelectSections.vue'
import UserModule from '~/store/modules/UserModule'

const coursesModule = namespace('modules/Courses')
const userModule = namespace('modules/UserModule')
  @Component({
    name: 'SelectCoursesForm',
    components: { SelectSections }
  })
export default class SelectCoursesForm extends Vue {
    @PropSync('valid', { type: String }) syncedValid!: string;

    async mounted () {
      this.loading = true
      this.setCourses(await this.$axios.$get('/subjects',
        {
          params: { speciality: this.speciality.id, hourlyLoad: this.myHourlyLoad.id }
        }))
      this.loading = false
    }

    @coursesModule.Action
    public getCourses!: (speciality: any) => void;

    @userModule.Mutation
    public setMyHourlyLoad!: (speciality: any) => void;

    @userModule.State
    myCourses!: []

    @coursesModule.State
    speciality!: Speciality;

    @userModule.State
    myFaculty!: Faculty;

    @userModule.State
    myHourlyLoad!: any;

    @coursesModule.Mutation
    setCourses!: Function;

    @coursesModule.State
    courses!: []

    @Watch('myCourses', { immediate: true })
    updateSelectedCourses (newValue: any) {
      this.selectedCourses = newValue
    }

    dialog: boolean = false
    loading = true

    addCourse (item: Course) {
      if (item.sections.length > 0) {
        const index = this.findIndexCourse(item)
        if (index >= 0) {
          this.selectedCourses[index] = item
        } else {
          this.selectedCourses.push(item)
        }
      } else {
        this.remove(item)
      }
    }

    cancelCourse (item: Course) {
      const index = this.findIndexCourse(item)
      if (index >= 0) {
        if (!this.selectedCourses[index].sections) {
          this.remove(item)
        }
      }
    }

    customFilter (item: Faculty, queryText: string):boolean {
      const tittles = 'ãàáäâèéëêìíïîòóöôùúüûÑñÇç'
      const original = 'aaaaaeeeeiiiioooouuuunncc'
      let textOne: string = item.name.toLowerCase()
      let textTwo: string = item.code.toLowerCase()
      let searchText: string = queryText.toLowerCase()
      for (let i = 0; i < tittles.length; i++) {
        textOne = textOne.replace(tittles.charAt(i), original.charAt(i))
        textTwo = textTwo.replace(tittles.charAt(i), original.charAt(i))
        searchText = searchText.replace(tittles.charAt(i), original.charAt(i))
      }
      return textOne.includes(searchText) ||
        textTwo.includes(searchText)
    }

    selectedSections (item: Course): Array<any> {
      const index = this.findIndexCourse(item)
      return this.selectedCourses[index].sections
    }

    findIndexCourse (item: Course) {
      return this.selectedCourses.findIndex(course => course.id === item.id)
    }

    remove (item: Course) {
      const index = this.findIndexCourse(item)
      if (index >= 0) {
        const courses: Course[] = []
        Object.assign(courses, this.selectedCourses)
        courses.splice(index, 1)
        this.selectedCourses = courses
      }
    }

    private selectedCourses: Course[] = []

    form (): VForm {
      return this.$refs.form as VForm
    }

    selectedCourse: Course = {
      codCurso: '',
      code: '',
      codigo: '',
      id: 0,
      name: '',
      nombre: '',
      sections: [],
      isFavorite: false
    }

    selectSections (course: Course) {
      const index = this.findIndexCourse(course)
      if (index >= 0) {
        this.selectedCourse = this.selectedCourses[index]
      } else {
        this.selectedCourse = course
      }
      this.dialog = true
    }

    get userInstance () {
      return getModule(UserModule, this.$store)
    }

    validated (): boolean {
      const validate = this.form().validate()
      if (validate) {
        this.userInstance.setSpeciality(this.speciality)
        this.userInstance.setMyCourses(this.selectedCourses)
      }
      return validate
    }

    validate (): boolean {
      return this.form().validate()
    }
}
</script>
