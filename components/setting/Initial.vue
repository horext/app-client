<template>
  <v-card>
    <v-card-title> Configuración </v-card-title>
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
      <v-btn :loading="loading" :disabled="!hourlyLoad" text @click="ending">
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useStore } from '@nuxtjs/composition-api'
import { $api } from '~/utils/api'

export default {
  name: 'SettingInitial',
  setup () {
    const store = useStore<any>()

    const faculties = ref([])
    const specialities = ref([])
    const errorMessage = ref('')
    const showErrorMessage = ref(false)
    const loading = ref(false)

    const faculty = ref<any>(null)
    const speciality = ref<any>(null)
    const hourlyLoad = ref<any>(null)

    const initSpecialities = async (selectedFaculty: any) => {
      if (selectedFaculty) {
        speciality.value = null
        const { data } = await $api.speciality.getAllByFaculty(selectedFaculty.id)
        specialities.value = data
      }
    }
    watch(faculty, async (newValue) => {
      await initSpecialities(newValue)
    })

    const onChangeSpeciality = async (selectedSpeciality: any) => {
      showErrorMessage.value = false
      if (selectedSpeciality) {
        hourlyLoad.value = null
        try {
          const { data } = await $api.hourlyLoad.getLatestByFaculty(faculty.value.id)
          hourlyLoad.value = data
        } catch (e:any) {
          const { data } = e.response
          errorMessage.value = data.message
          showErrorMessage.value = true
        }
      }
    }
    watch(speciality, async (newValue) => {
      await onChangeSpeciality(newValue)
    })

    const init = async () => {
      const { data } = await $api.faculty.getAll()
      faculties.value = data
      faculty.value = store.state.user.config.faculty
      hourlyLoad.value = store.state.user.config.hourlyLoad
      speciality.value = store.state.user.config.speciality
    }

    const ending = async () => {
      loading.value = true
      await store.dispatch('user/config/updateFaculty', faculty.value)
      await store.dispatch('user/config/updateSpeciality', speciality.value)
      await store.dispatch('user/config/updateFirstEntry', false)
      loading.value = false
    }

    onMounted(async () => {
      await init()
    })

    return {
      faculties,
      specialities,
      errorMessage,
      showErrorMessage,
      loading,
      faculty,
      speciality,
      hourlyLoad,
      initSpecialities,
      onChangeSpeciality,
      ending
    }
  }
}
</script>
