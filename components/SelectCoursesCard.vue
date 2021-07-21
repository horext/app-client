<template>
  <v-card >
    <v-card-title>
      Selecciona tus cursos
    </v-card-title>
    <SelectCoursesForm ref="selectCourses" />
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
import SelectCoursesForm from './SelectCoursesForm.vue'

@Component({
  components: {
    SelectCoursesForm
  }
})

export default class SelectCoursesCard extends Vue {
  @PropSync('close', { type: Boolean }) dialog!: boolean;

  form (): Vue & { validated: () => boolean } {
    return this.$refs.selectCourses as Vue & { validated: () => boolean }
  }

  save () {
    this.form().validated()
    this.dialog = false
  }
}

</script>
