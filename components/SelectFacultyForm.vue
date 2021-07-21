<template>
  <v-card-text>
    <v-form
      ref="form"
      v-model="syncedValid"
    >
      <v-autocomplete
        v-model="faculty"
        :loading="loading"
        :items="faculties"
        item-text="name"
        return-object
        :filter="customFilter"
        dense
        :rules="[v => !!v || 'Elige tu facultad']"
        filled
        label="Elige tu facultad"
        @keyup.enter="enter()"
      />
    </v-form>
    <v-alert v-model="showErrorMessage" dismissible type="error">
      {{ errorMessage }}
    </v-alert>
  </v-card-text>
</template>

<script lang="ts">
import { Component, Vue, namespace, PropSync, Prop, Watch } from 'nuxt-property-decorator'
import { Faculty, Speciality, VForm } from '~/types'
const userModule = namespace('modules/UserModule')
const facultiesModule = namespace('modules/Faculties')
const SpecialitiesModule = namespace('modules/Specialities')

@Component
export default class SelectFacultyForm extends Vue {
  @PropSync('valid', { type: String })
  syncedValid!: string;

  @Prop({ type: Object, default: null })
  item: any = null;

  errorMessage = ''
  showErrorMessage = false
  faculty: any = null;

  enter () {
    this.$emit('enter')
  }

  @Watch('faculty')
  onChangeFaculty (item: any) {
    this.$emit('update:item', item)
  }

  async mounted () {
    this.loading = true
    this.setFaculties(await this.$axios.$get('/faculties'))
    this.loading = false
  }

  @facultiesModule.Action
  public getFaculties!: () => void;

  @facultiesModule.Mutation
  public setFaculties!: any;

  @SpecialitiesModule.Mutation
  public setFaculty!: any;

  @facultiesModule.State
  public faculties!: Faculty[];

  @userModule.State
  info!: object;

  @userModule.State
  public speciality!: Speciality;

  customFilter (item: Faculty, queryText: string):boolean {
    const textOne = item.name.toLowerCase()
    const textTwo = item.code.toLowerCase()
    const searchText = queryText.toLowerCase()

    return textOne.includes(searchText) ||
      textTwo.includes(searchText)
  }

  form (): VForm {
    return this.$refs.form as VForm
  }

  async validated (): Promise<boolean> {
    const validate = this.form().validate()
    this.showErrorMessage = false
    try {
      const hourlyLoad = await this.$api.$get('/hourlyLoads?speciality=' + this.faculty.id)
      this.$store.commit('modules/UserModule/setMyHourlyLoad', hourlyLoad)
      if (validate) {
        this.setFaculty(this.faculty)
        this.$store.commit('modules/UserModule/setMyFaculty', this.faculty)
      }
      return validate
    } catch (e) {
      this.errorMessage = 'No se ha encontrado la carga'
      this.showErrorMessage = true
      return false
    }
  }

  validate ():boolean {
    return this.form().validate()
  }

  loading=false
}
</script>

<style>

</style>
