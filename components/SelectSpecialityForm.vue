<template>
  <v-card-text>
    <v-form
      ref="form"
      v-model="syncedValid"
    >
      <v-autocomplete
        v-model="speciality"
        :disabled="loading"
        :loading="loading"
        open-on-clear
        :items="specialities"
        item-text="name"
        return-object
        :filter="customFilter"
        dense
        :rules="[v => !!v || 'Elige tu especialidad']"
        filled
        label="Elige tu Especialidad"
        @keyup.enter="enter()"
      />
    </v-form>
  </v-card-text>
</template>

<script lang="ts">
import { Component, Vue, namespace, getModule, PropSync, Prop } from 'nuxt-property-decorator'
import { Faculty, Speciality, VForm } from '~/types'
import CoursesModule from '~/store/modules/Courses'
const specialitiesModule = namespace('modules/Specialities')

  @Component
export default class SelectSpecialityForm extends Vue {
    @PropSync('valid', { type: String }) syncedValid!: string;

    @Prop({ type: Object, default: null })
    item: any = null;

    speciality: any = null;

    @specialitiesModule.State
    public faculty!: Faculty;

    enter () {
      this.$emit('enter')
    }

    async mounted () {
      this.loading = true
      this.setSpecialities(await this.$axios.$get('/specialities?faculty=' + this.faculty.id))
      this.loading = false
    }

    @specialitiesModule.Action
    public getSpecialities!: () => void;

    @specialitiesModule.Mutation
    public setSpecialities!: any;

    @specialitiesModule.State
    public specialities!: Speciality[];

    loading=false;

    customFilter (item: Speciality, queryText: string):boolean {
      const textOne = item.name.toLowerCase()
      const textTwo = item.code.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.includes(searchText) ||
        textTwo.includes(searchText)
    }

    form (): VForm {
      return this.$refs.form as VForm
    }

    validated ():boolean {
      const validate = this.form().validate()
      if (validate) {
        const coursesInstance = getModule(CoursesModule, this.$store)
        coursesInstance.setSpeciality(this.speciality)
      }
      return validate
    }

    validate ():boolean {
      return this.form().validate()
    }
}
</script>

<style>

</style>
