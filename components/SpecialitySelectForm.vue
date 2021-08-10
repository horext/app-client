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
      />
    </v-form>
  </v-card-text>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Watch } from 'nuxt-property-decorator'
import { Faculty, Speciality, VForm } from '~/types'

@Component
export default class SpecialitySelectForm extends Vue {
    @PropSync('valid', { type: String })
    syncedValid!: string;

    @PropSync('item', { type: Object })
    speciality!: any;

    @PropSync('faculty', { type: Object })
    public facultySync!: Faculty;

    @Watch('facultySync')
    async onChangeFaculty (newVal: any) {
      if (newVal) {
        this.loading = true
        this.specialities = await this.$axios.$get('/specialities?faculty=' + newVal.id)
        this.loading = false
      }
    }

    public specialities: Array<Speciality> = [];

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
        return true
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
