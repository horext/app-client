<template>
  <div
    class="subject-card"
    :class="[highlightedType ? 'highlighted ' + highlightedType : '']"
    @click="$emit('click', $event)"
  >
    <div class="subject-name">{{ subject.course.name }}</div>
    <div class="subject-details">
      {{ subject.credits }} Creditos - {{ subject.type.name }}
    </div>
    <div v-if="subject.relationships.length > 0" class="prerequisites">
      Prerequisitos:
      <span v-for="(rel, index) in prerequisites" :key="rel?.id">
        {{ rel?.course.name }}
        <span v-if="index < prerequisites.length - 1">, </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISubjectStudyPlan } from '~/interfaces/subject'

const props = defineProps<{
  subject: ISubjectStudyPlan
  selectedSubjectIds: number[]
  subjects: ISubjectStudyPlan[]
}>()

defineEmits<{
  (name: 'click', e: MouseEvent): void
}>()

const { subject, selectedSubjectIds, subjects } = toRefs(props)

const prerequisites = computed(() => {
  return subject.value.relationships.map((rel) => {
    const prereq = subjects.value.find((s) => s.id === rel.relatedSubjectId)
    return prereq
  })
})

const highlightedType = computed(() => {
  const current = subject.value
  const selected = selectedSubjectIds.value
  const items = subjects.value

  if (selected.length === 0) return ''

  if (selected.includes(current.id)) return 'selected'
  const selectedItems = selected.map(
    (selectedId) => items.find((s) => s.id === selectedId)!,
  )
  const isOpen = selectedItems.some((selectedItem) =>
    current.relationships.some(
      (rel) => rel.relatedSubjectId === selectedItem.id,
    ),
  )

  if (isOpen) return 'open-subjects'
  else return ''
})
</script>

<style>
.subject-card {
  color: #333;
  flex-basis: 30%;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

.subject-card.highlighted.selected {
  background-color: #e0f2f1; /* Light teal background for highlighted subjects */
  border-color: #004d40; /* Dark teal border for highlighted subjects */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}

.subject-card.highlighted.open-subjects {
  background-color: #e0f7fa; /* Light cyan background for highlighted subjects */
  border-color: #00acc1; /* Dark cyan border for highlighted subjects */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}

.subject-card.highlighted.next-open-subjects {
  background-color: #ffccbc; /* Light red background for next-open-subjects subjects */
  border-color: #e64a19; /* Dark red border for next-open-subjects subjects */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}

.subject-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.subject-details {
  margin-bottom: 10px;
}

.prerequisites {
  margin-top: 10px;
  font-size: 12px;
  color: #555;
}
</style>
