<template lang="html">
  <v-chip-group column>
    <v-chip
      v-for="course in coursesSync"
      :key="course.id"
      color="primary lighten-1"
      small
      close
      @click:close="remove(course)"
    >
      <v-btn color="secondary" icon small class="notranslate v-icon--left " @click="editCourse(course)">
        <v-icon>
          mdi-circle-edit-outline
        </v-icon>
      </v-btn>
      <span
        class="d-inline-block text-truncate"
        style="max-width: inherit ;"
      >
        {{ course.code +"-" +course.name }}
      </span>
      <v-avatar v-for="schedule in course.sections" :key="schedule.id" size="10" color="secondary lighten-1">
        {{ schedule.section.id }}
      </v-avatar>
    </v-chip>

    <slot name="lasItem">
      <v-chip>
        Añadir Cursos
      </v-chip>
    </slot>
    <SelectSections
      :open.sync="open"
      :course="selectedCourse"
      @save="addCourse"
      @cancel="cancelCourse"
    />
  </v-chip-group>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import SelectSections from '~/components/SelectSections.vue'
import { Course } from '~/types'

@Component({
  name: 'CoursesList',
  components: { SelectSections }
})
export default class CoursesList extends Vue {
  @Prop({ type: Function }) addCourses!: Function
  @PropSync('courses', { type: Array, default: [] }) coursesSync!:Course []
  open=false
  selectedCourse: Course = { codCurso: '', codigo: '', nombre: '', sections: [], id: 1, code: '', name: '', isFavorite: false }
  editCourse (course:Course) {
    this.open = true
    this.selectedCourse = course
  }

  addCourse (item:Course) {
    if (item.sections.length > 0) {
      const index = this.findIndexCourse(item)
      if (index >= 0) {
        const courses: Course[] = []
        Object.assign(courses, this.coursesSync)
        courses[index] = item
        this.coursesSync = courses
      } else {
        this.coursesSync.push(item)
      }
    } else {
      this.remove(item)
    }
  }

  findIndexCourse (item: Course) {
    return this.coursesSync.findIndex(course => course.id === item.id)
  }

  remove (item: Course) {
    const index = this.findIndexCourse(item)
    if (index >= 0) {
      const courses: Course[] = []
      Object.assign(courses, this.coursesSync)
      courses.splice(index, 1)
      this.coursesSync = courses
    }
  }

  cancelCourse (item: Course) {
    const index = this.findIndexCourse(item)
    if (index >= 0) {
      if (!this.coursesSync[index].sections) {
        this.remove(item)
      }
    }
  }
}
</script>
