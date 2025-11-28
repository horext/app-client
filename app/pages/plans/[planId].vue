<template>
  <v-container class="study-plan">
    <div v-for="(ss, cycle) in groupedSubjects" :key="cycle" class="cycle">
      <div class="d-flex justify-space-between align-center">
        <h2 v-if="cycle === -1">Otros</h2>
        <h2 v-else>Ciclo {{ cycle }}</h2>
        <div
          v-if="cycle !== -1"
          class="d-flex justify-space-between align-center ga-4"
        >
          <v-btn variant="outlined" @click="handleSelectAll(cycle)">
            Seleccionar todos
          </v-btn>
          <v-btn variant="outlined" @click="handleUnselectAll(cycle)">
            Deseleccionar todos
          </v-btn>
        </div>
      </div>
      <div class="subjects">
        <PlanSubjectCard
          v-for="subject in ss"
          :key="subject.id"
          :subject="subject"
          :selected-subject-ids="selectedSubjectIds"
          :subjects="subjects"
          @click="toggleSubjectSelection(subject.id)"
        />
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import type { ISubjectStudyPlan } from '~/interfaces/subject'
import { useStudyPlanApi } from '~~/modules/apis/runtime/composables'
import PlanSubjectCard from '../../components/plan/SubjectCard.vue'

const route = useRoute()

const planId = computed(() => Number(route.params.planId))

const studyPlanApi = useStudyPlanApi()

const { data: subjects } = useAsyncData(
  () => studyPlanApi.getSubjectsByStudyPlanId(planId.value),
  {
    default: () => [],
  },
)

const groupedSubjects = computed(() => {
  const grouped: Record<number, ISubjectStudyPlan[]> = {}
  subjects.value.forEach((subject) => {
    const cycle = subject.cycle ?? -1
    if (!grouped[cycle]) {
      grouped[cycle] = []
    }
    grouped[cycle].push(subject)
  })
  return grouped
})

const selectedSubjectIds = ref<number[]>([])
const toggleSubjectSelection = (id: number) => {
  const index = selectedSubjectIds.value.indexOf(id)
  if (index === -1) {
    selectedSubjectIds.value.push(id)
  } else {
    selectedSubjectIds.value.splice(index, 1)
  }
}

const handleSelectAll = (cycle: number) => {
  const subjects = groupedSubjects.value[cycle]
  const ids = subjects.map((s) => s.id)
  selectedSubjectIds.value = [...selectedSubjectIds.value, ...ids]
}

const handleUnselectAll = (cycle: number) => {
  const subjects = groupedSubjects.value[cycle]
  const ids = subjects?.map((s) => s.id)
  selectedSubjectIds.value = selectedSubjectIds.value.filter(
    (id) => !ids.includes(id),
  )
}
</script>

<style scoped>
.study-plan {
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.cycle {
  margin: 40px 0;
}

.cycle h2 {
  font-size: 20px;
  font-weight: bold;
  border-bottom: 2px solid #333;
  padding-bottom: 5px;
  margin-bottom: 20px;
}

.subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .subjects {
    flex-direction: column;
  }
}
</style>
