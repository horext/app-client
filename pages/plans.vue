<script lang="ts" setup>
import type { IStudyPlan } from '~/interfaces/subject'
import { useStudyPlanApi } from '~/modules/apis/runtime/composables'

definePageMeta({
  title: 'Study Plans',
  description: 'List of study plans',
  layout: 'plans',
})

const api = useStudyPlanApi()
const { data } = await useAsyncData<IStudyPlan[]>(() => api.getAll(), {
  default: () => [],
})
prerenderRoutes(data.value.map((plan) => `/plans/${plan.id}`))
</script>

<template>
  <v-container>
    Planes de estudio
    <v-tabs>
      <v-tab
        v-for="plan in data"
        :key="plan.id"
        :to="`/plans/${plan.id}`"
        nuxt-link
      >
        {{ plan.code }}
      </v-tab>
    </v-tabs>
    <v-tabs-window>
      <NuxtPage />
    </v-tabs-window>
  </v-container>
</template>

<style scoped></style>
