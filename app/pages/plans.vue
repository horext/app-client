<script lang="ts" setup>
import type { IStudyPlan } from '~/interfaces/subject'
import { toAppStudyPlan } from '~/mappers/subject/api'
import { useStudyPlanApi } from '~~/modules/apis/runtime/composables'

definePageMeta({
  title: 'Study Plans',
  description: 'List of study plans',
  layout: 'plans',
})

const api = useStudyPlanApi()
const { data } = await useAsyncData<IStudyPlan[]>(
  'plans-list',
  async () => (await api.getAll()).map(toAppStudyPlan),
  {
    default: () => [],
  },
)
prerenderRoutes(data.value.map((plan) => `/plans/${plan.id}`))
</script>

<template>
  <v-container>
    Planes de estudio
    <v-tabs :model-value="null">
      <v-tab
        v-for="plan in data"
        :key="plan.id"
        :to="{
          name: 'plans-planId',
          params: { planId: plan.id },
        }"
        nuxt
      >
        {{ plan.name || plan.code }}
      </v-tab>
    </v-tabs>
    <NuxtPage />
  </v-container>
</template>

<style scoped></style>
