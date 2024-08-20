<template>
  <v-row align="center" justify="end" class="pa-2">
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
  subjects: Pick<ISubject, 'credits'>[]
}>()

const { subjects } = toRefs(props)

const totalCredits = computed(() => {
  return subjects.value.reduce((previousValue, currentValue) => {
    return currentValue.credits + previousValue
  }, 0)
})
</script>
