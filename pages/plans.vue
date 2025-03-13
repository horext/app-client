<script lang="ts" setup>
import type { IStudyPlan } from '~/interfaces/subject'
import { useStudyPlanApi } from '~/modules/apis/runtime/composables'

definePageMeta({
  title: 'Study Plans',
  description: 'List of study plans',
  layout: 'plans',
})

const api = useStudyPlanApi()
const tab = ref(0)
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
        :to="{
          name: 'plans-planId',
          params: { planId: plan.id },
        }"
        nuxt-link
      >
        {{ plan.code }}
      </v-tab>
    </v-tabs>
    <NuxtPage />
  </v-container>
</template>

<style scoped></style>
