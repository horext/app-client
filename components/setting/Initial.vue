<template>
  <v-card>
    <v-card-title>
      Configuración
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-autocomplete
          v-model="faculty"
          :items="faculties"
          return-object
          item-text="name"
          label="Facultades"
        />
        <v-autocomplete
          v-model="speciality"
          :disabled="!faculty"
          return-object
          item-text="name"
          :items="specialities"
          label="Especialidades"
        />
      </v-form>
      <v-alert v-model="showErrorMessage" dismissible type="error">
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="!hourlyLoad" text @click="ending">
        Finalizar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
@Component
export default class SettingInitial extends Vue {
  faculties: Array<any> = []
  specialities: Array<any> = []
  errorMessage = ''
  showErrorMessage = false
  async mounted () {
    await this.init()
  }

  @Watch('faculty')
  async initSpecialities (faculty:any) {
    if (faculty) {
      this.speciality = null
      this.specialities = await this.$apiv1.$get('/specialities', {
        params: {
          faculty: faculty.id
        }
      })
    }
  }

  @Watch('speciality')
  async onChangeSpeciality (speciality:any) {
    this.showErrorMessage = false
    if (speciality) {
      this.hourlyLoad = null
      try {
        this.hourlyLoad = await this.$apiv1.$get('/hourlyLoads/latest', {
          params: {
            faculty: this.faculty.id
          }
        })
      } catch (e) {
        const { data } = e.response
        this.errorMessage = data.message
        this.showErrorMessage = true
      }
    }
  }

  faculty:any = null
  speciality:any = null
  hourlyLoad:any = null

  async init () {
    this.faculties = await this.$apiv1.$get('/faculties')
    this.faculty = this.$storage.getUniversal('myFaculty')
    this.hourlyLoad = this.$storage.getUniversal('myHourlyLoad')
    this.speciality = this.$storage.getUniversal('mySpeciality')
  }

  ending () {
    this.$storage.syncUniversal('myFaculty', this.faculty)
    this.$storage.syncUniversal('mySpeciality', this.speciality)
    this.$storage.setUniversal('myHourlyLoad', this.hourlyLoad)
    this.$storage.setUniversal('firstEntry', false)
    this.$emit('update:dialog', false)
  }
}
</script>
