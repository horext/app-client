<template>
  <v-row class="pa-2 align-center justify-end">
    <v-col cols="auto">
      <v-chip color="green" label>
        Total de créditos: {{ totalCredits }}
      </v-chip>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { ISubject } from '~/interfaces/subject'

const props = defineProps<{
  subjects: {
    subject: Pick<ISubject, 'credits'>
  }[]
}>()

const { subjects } = toRefs(props)

const totalCredits = computed(() => {
  return subjects.value.reduce((previousValue, currentValue) => {
    return currentValue.subject.credits + previousValue
  }, 0)
})
</script>
