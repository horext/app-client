<script lang="ts" setup>
import type { IStudyPlan } from '~/interfaces/subject'

const api = useApi()
const { data } = useAsyncData<IStudyPlan[]>(() => api.studyPlan.getAll(), {
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
