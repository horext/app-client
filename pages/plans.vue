<script lang="ts" setup>
import type { IStudyPlan } from '~/interfaces/subject'
import { useStudyPlanApi } from '~/modules/apis/runtime/composables';

definePageMeta({
  title: 'Study Plans',
  description: 'List of study plans',
  layout: 'plans',
})

const api = useStudyPlanApi();
const { data } = useAsyncData<IStudyPlan[]>(() => api.getAll(), {
  default: () => [],
})
</script>

<template>
  <div>
    Page: plans
    <nuxt-link v-for="plan in data" :key="plan.id" :to="`/plans/${plan.id}`">
      {{ plan.code }}
    </nuxt-link>
    <NuxtPage />
  </div>
</template>

<style scoped></style>
