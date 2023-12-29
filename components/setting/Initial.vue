<template>
  <v-card>
    <v-card-title> Configuración </v-card-title>
    <v-card-text>
      <v-form>
        <v-autocomplete
          v-model="faculty"
          :items="faculties"
          return-object
          item-title="name"
          label="Facultades"
        />
        <v-autocomplete
          v-model="speciality"
          :disabled="!faculty"
          return-object
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
import { IOrganization } from '~/interfaces/organization'
import { IHourlyLoad } from '~/interfaces/houly-load'
import { useApi } from '~/composables/api'

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

    const faculty = ref<IOrganization | undefined>()
    const speciality = ref<IOrganization | undefined>()
    const hourlyLoad = ref<IHourlyLoad>()

    const initSpecialities = async (selectedFaculty: IOrganization) => {
      speciality.value = undefined
      const data = await $api.speciality.getAllByFaculty(selectedFaculty.id)
      specialities.value = data
    }
    watch(faculty, async (newValue) => {
      if (newValue) {
        await initSpecialities(newValue)
      }
    })

    const onChangeSpeciality = async (_speciality: IOrganization) => {
      hourlyLoad.value = undefined
      try {
        const data = await $api.hourlyLoad.getLatestByFaculty(faculty.value!.id)
        hourlyLoad.value = data
      } catch (e: any) {
        const data = e.response
        errorMessage.value = data.message
        showErrorMessage.value = true
      }
    }
    watch(speciality, async (newValue) => {
      showErrorMessage.value = false
      if (newValue) {
        await onChangeSpeciality(newValue)
      }
    })

    const init = async () => {
      const data = await $api.faculty.getAll()
      faculties.value = data
      faculty.value = store.faculty
      hourlyLoad.value = store.hourlyLoad
      speciality.value = store.speciality
    }

    const ending = async () => {
      loading.value = true
      await store.updateFaculty(faculty.value!)
      await store.updateSpeciality(speciality.value!)
      await store.updateFirstEntry(false)
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
    }
  },
})
</script>
