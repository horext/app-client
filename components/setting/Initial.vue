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
      const { data } = await this.$api.speciality.getAllByFaculty(faculty.id)
      this.specialities = data
    }
  }

  @Watch('speciality')
  async onChangeSpeciality (speciality:any) {
    this.showErrorMessage = false
    if (speciality) {
      this.hourlyLoad = null
      try {
        const { data } = await this.$api.hourlyLoad.getLatestByFaculty(this.faculty.id)
        this.hourlyLoad = data
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
    const { data } = await this.$api.faculty.getAll()
    this.faculties = data
    this.faculty = this.$store.state.user.config.faculty
    this.hourlyLoad = this.$store.state.user.config.hourlyLoad
    this.speciality = this.$store.state.user.config.speciality
  }

  ending () {
    this.$store.dispatch('user/config/updateFaculty', this.faculty)
    this.$store.dispatch('user/config/updateSpeciality', this.speciality)
    this.$store.dispatch('user/config/updateFirstEntry', false)
  }
}
</script>
