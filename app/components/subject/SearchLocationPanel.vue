<template>
  <v-card variant="tonal" class="pa-3">
    <div class="d-flex flex-wrap align-start justify-space-between ga-2">
      <div>
        <div class="text-subtitle-1">¿Dónde quieres buscar?</div>
        <div class="text-body-2 mt-1">
          <span class="text-medium-emphasis">Buscando cursos en:</span>
          <span class="font-weight-medium ml-1">
            {{ searchLocationLabel }}
          </span>
          <v-chip
            v-if="hasCustomContext"
            color="primary"
            variant="tonal"
            size="x-small"
            class="ml-2"
          >
            Personalizado
          </v-chip>
        </div>
      </div>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        :aria-expanded="showOptions"
        aria-controls="search-options"
        :append-icon="showOptions ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="showOptions = !showOptions"
      >
        Cambiar dónde buscar
      </v-btn>
    </div>
    <v-expand-transition>
      <div v-if="showOptions" id="search-options" class="mt-4 pt-4 border-t">
        <div class="text-caption text-medium-emphasis mb-3">
          La facultad determina tu carga horaria y se cambia desde
          Configuración.
        </div>
        <v-row>
          <v-col cols="12" md="4">
            <v-tooltip :text="facultyName" location="top">
              <template #activator="{ props: tooltipProps }">
                <v-text-field
                  v-bind="tooltipProps"
                  :model-value="facultyName"
                  label="Facultad de tu carga horaria"
                  prepend-inner-icon="mdi-lock-outline"
                  readonly
                  hide-details
                  class="faculty-field"
                  density="comfortable"
                  variant="outlined"
                />
              </template>
            </v-tooltip>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              :model-value="selectedSpecialityId"
              :items="specialities"
              :loading="loadingSpecialities"
              item-title="name"
              item-value="id"
              label="Especialidad"
              placeholder="Todas las especialidades"
              clearable
              hide-details="auto"
              density="comfortable"
              variant="outlined"
              @update:model-value="emit('select-speciality', $event)"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              :model-value="selectedStudyPlanId"
              :items="studyPlans"
              :loading="loadingStudyPlans"
              :disabled="!selectedSpecialityId"
              :item-title="studyPlanTitle"
              item-value="id"
              label="Plan de estudios"
              placeholder="Todos los planes"
              clearable
              hide-details="auto"
              density="comfortable"
              variant="outlined"
              @update:model-value="emit('select-study-plan', $event)"
            >
              <template #item="{ props: listItemProps, item }">
                <v-list-item
                  v-bind="listItemProps"
                  :title="item.name || item.code"
                  :subtitle="
                    item.code && item.name
                      ? `${item.code} · Desde ${item.fromDate}`
                      : `Desde ${item.fromDate}`
                  "
                />
              </template>
            </v-autocomplete>
            <div
              v-if="!selectedSpecialityId"
              class="text-caption text-medium-emphasis mt-1"
            >
              Selecciona una especialidad para ver sus planes.
            </div>
          </v-col>
        </v-row>
        <v-alert
          v-if="specialitiesError || studyPlansError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-2"
        >
          No pudimos cargar las opciones de búsqueda.
          <template #append>
            <v-btn variant="text" size="small" @click="emit('retry')">
              Reintentar
            </v-btn>
          </template>
        </v-alert>
        <div class="d-flex flex-wrap align-center ga-2 mt-2">
          <v-btn
            v-if="hasCustomContext"
            variant="text"
            size="small"
            @click="emit('reset')"
          >
            Usar mi configuración
          </v-btn>
          <v-btn
            to="/generator/settings"
            variant="text"
            size="small"
            prepend-icon="mdi-cog-outline"
          >
            Cambiar facultad
          </v-btn>
        </div>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { IOrganization } from '~/interfaces/organization'
import type { IStudyPlan } from '~/interfaces/subject'
import { formatSearchLocation } from '~/constants/subject-search'

const props = defineProps<{
  faculties: IOrganization[]
  facultyId?: number
  hasCustomContext: boolean
  closeRequestId: number
  specialities: IOrganization[]
  studyPlans: IStudyPlan[]
  selectedSpecialityId: number | null
  selectedStudyPlanId: number | null
  loadingSpecialities: boolean
  loadingStudyPlans: boolean
  specialitiesError: boolean
  studyPlansError: boolean
}>()

const showOptions = ref(false)
const facultyName = computed(() =>
  (props.faculties.find((faculty) => faculty.id === props.facultyId)?.name ??
  props.facultyId)
    ? `Facultad ${props.facultyId}`
    : 'Facultad no configurada',
)
const studyPlanTitle = (plan: IStudyPlan) => plan.name ?? plan.code
const selectedSpecialityName = computed(
  () =>
    props.specialities.find(
      (speciality) => speciality.id === props.selectedSpecialityId,
    )?.name,
)
const selectedStudyPlanName = computed(() => {
  const plan = props.studyPlans.find(
    (studyPlan) => studyPlan.id === props.selectedStudyPlanId,
  )
  return plan?.name ?? plan?.code
})
const searchLocationLabel = computed(() =>
  formatSearchLocation(
    selectedSpecialityName.value,
    selectedStudyPlanName.value,
  ),
)

watch(
  () => props.closeRequestId,
  () => {
    showOptions.value = false
  },
)

const emit = defineEmits<{
  'select-speciality': [value: number | null]
  'select-study-plan': [value: number | null]
  reset: []
  retry: []
}>()
</script>

<style scoped>
.faculty-field :deep(input) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
