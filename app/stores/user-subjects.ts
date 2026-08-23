import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IPlannedSubject, PlannedSubjectId } from '~/interfaces/subject'

export const useUserSubjectsStore = defineStore('user-subjects', () => {
  const subjects = ref<Array<IPlannedSubject>>([])
  const subjectCount = computed(() => subjects.value.length)
  const hasSubjects = computed(() => subjectCount.value > 0)

  function setSubjects(value: IPlannedSubject[]) {
    subjects.value = value
  }

  function addSubject(subject: IPlannedSubject) {
    subjects.value.push(subject)
  }

  function updateSubject(subject: IPlannedSubject) {
    const index = subjects.value.findIndex((item) => item.id === subject.id)
    if (index >= 0) subjects.value[index] = subject
  }

  function deleteSubjectById(id: PlannedSubjectId) {
    subjects.value = subjects.value.filter((subject) => subject.id !== id)
  }

  function clearSubjects() {
    subjects.value = []
  }

  return {
    subjects,
    subjectCount,
    hasSubjects,
    setSubjects,
    addSubject,
    updateSubject,
    deleteSubjectById,
    clearSubjects,
  }
})
