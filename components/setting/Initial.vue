<template>
  <v-card :loading="loadingHourlyLoad">
    <v-card-title> Configuración </v-card-title>
    <v-card-text>
      <v-form>
        <v-autocomplete
          v-model="faculty"
          :items="faculties"
          :loading="loadingFaculties"
          return-object
          item-title="name"
          label="Facultades"
        />
        <v-autocomplete
          v-model="speciality"
          :disabled="!faculty"
          return-object
          :loading="loadingSpecialities"
          item-title="name"
          :items="specialities"
          label="Especialidades"
        />
      </v-form>
      <v-alert v-model="showErrorMessage" closable type="error">
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        :loading="loading"
        :disabled="!hourlyLoad"
        variant="text"
        @click="ending"
      >
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { ref, watch, onMounted, defineComponent } from 'vue'
import { useUserConfigStore } from '~/stores/user-config'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { IOrganization } from '~/interfaces/organization'
import { useApi } from '~/composables/api'
import type { FetchError } from 'ofetch'

export default defineComponent({
  name: 'SettingInitial',
  setup() {
    const $api = useApi()
    const store = useUserConfigStore()

    const faculties = ref<IOrganization[]>([])
    const specialities = ref<IOrganization[]>([])
    const errorMessage = ref('')
    const showErrorMessage = ref(false)
    const loading = ref(false)

    const faculty = ref<IOrganization>()
    const speciality = ref<IOrganization>()
    const hourlyLoad = ref<IHourlyLoad>()

    const loadingSpecialities = ref(false)
    const initSpecialities = async (selectedFaculty: IOrganization) => {
      speciality.value = undefined
      loadingSpecialities.value = true
      const data = await $api.speciality.getAllByFaculty(selectedFaculty.id)
      specialities.value = data
      loadingSpecialities.value = false
    }

    watch(faculty, async (newValue) => {
      if (newValue) {
        await initSpecialities(newValue)
      }
    })

    const loadingHourlyLoad = ref(false)
    const onChangeSpeciality = async (_speciality: IOrganization) => {
      hourlyLoad.value = undefined
      if (!faculty.value) return
      try {
        loadingHourlyLoad.value = true
        const data = await $api.hourlyLoad.getLatestByFaculty(faculty.value.id)
        hourlyLoad.value = data
      } catch (e: FetchError) {
        errorMessage.value = 'No se pudo obtener la carga horaria.'
        showErrorMessage.value = true
      } finally {
        loadingHourlyLoad.value = false
      }
    }
    watch(speciality, async (newValue) => {
      showErrorMessage.value = false
      if (newValue) {
        await onChangeSpeciality(newValue)
      }
    })

    const loadingFaculties = ref(false)
    const init = async () => {
      loadingFaculties.value = true
      const data = await $api.faculty.getAll()
      faculties.value = data
      loadingFaculties.value = false
      faculty.value = store.faculty
      hourlyLoad.value = store.hourlyLoad
      speciality.value = store.speciality
    }

    const ending = () => {
      loading.value = true
      store.updateFaculty(faculty.value!)
      store.updateSpeciality(speciality.value!)
      store.updateFirstEntry(false)
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
      ending,
      loadingHourlyLoad,
      loadingFaculties,
      loadingSpecialities,
    }
  },
})
</script>
