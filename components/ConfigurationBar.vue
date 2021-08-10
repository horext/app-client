<template>
  <v-card-actions v-if="mySpeciality">
    <div>
      Especialidad: <v-chip color="primary">
        {{ mySpeciality.code }}
      </v-chip>
    </div>
    <v-spacer></v-spacer>
    <div>
      Actualizado: {{ new Date(hourlyLoad.updatedAt).toLocaleString() }}
    </div>
  </v-card-actions>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class ConfigurationBar extends Vue {
  get myFaculty () {
    return this.$store.state.modules.Specialities.faculty
  }

  get hourlyLoad () {
    return this.$store.state.modules.UserModule.myHourlyLoad
  }

  get mySpeciality () {
    return this.$store.state.modules.Courses.speciality
  }
}
</script>

<style scoped>

</style>
