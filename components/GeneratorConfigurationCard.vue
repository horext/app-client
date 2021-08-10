<template>
  <v-card>
    <v-card-title>
      <span class="headline">Configuración</span>
    </v-card-title>

    <v-card-text>
      <select-faculty-form
        ref="form-1"
        :item.sync="faculty"
      />
      <speciality-select-form
        ref="form-2"
        :faculty.sync="faculty"
        :item.sync="speciality"
      />

      Se borraran los cursos que hayas seleccionado y los horarios generados
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="green darken-1"
        text
        @click="dialogSync = false"
      >
        Cancelar
      </v-btn>
      <v-btn
        color="green darken-1"
        text
        @click="save"
      >
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, namespace, PropSync, Vue, Watch } from 'nuxt-property-decorator'
import SelectFacultyForm from '~/components/SelectFacultyForm.vue'
import SpecialitySelectForm from '~/components/SpecialitySelectForm.vue'
import { VForm } from '~/types'
const userModule = namespace('modules/UserModule')
const coursesModule = namespace('modules/Courses')
@Component({
  components: { SpecialitySelectForm, SelectFacultyForm }
})
export default class GeneratorConfigurationCard extends Vue {
  @PropSync('dialog', { type: Boolean })
  dialogSync!: boolean;

  faculty:any = null
  @Watch('faculty')
  onChangeFaculty () {
    this.speciality = null
  }

  speciality:any = null
  form (window: any): any {
    return this.$refs[window] as VForm
  }

  @coursesModule.Mutation
  public setSpeciality!: any;

  @coursesModule.Mutation
  public setCourses!: any;

  @userModule.Mutation
  public setMySchedules!: any;

  @userModule.Mutation
  public setMyCourses!: any;

  @userModule.Action
  public getCourses!: any;

  save () {
    if (!this.form('form-1').validated() && !this.form('form-2').validated()) {
      return
    }
    this.setSpeciality(this.speciality)
    this.setMySchedules([])
    this.setMyCourses([])
    this.dialogSync = false
  }
}
</script>
