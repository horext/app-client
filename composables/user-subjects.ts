import type { ISelectedSubject } from '~/interfaces/subject'
import { useRuntimeConfig } from '#imports'

export const useUserSubjects = () => {
  const storage = useLocalStorage()
  const configStore = useUserConfigStore()
  const { subjects } = storeToRefs(configStore)
  const { public: { preferOfflineSave } } = useRuntimeConfig()

  async function saveNewSubject(_subject: ISelectedSubject) {
    subjects.value.push(Object.assign({}, _subject))
    await storage.setItem('mySubjects', subjects.value)
    if (!preferOfflineSave) {
      await $fetch('/api/subjects', {
        method: 'POST',
        body: _subject,
      })
    }
  }

  async function deleteSubjectById(id: number) {
    const index = subjects.value.findIndex((s) => s.id === id)
    subjects.value.splice(index, 1)
    await storage.setItem('mySubjects', subjects.value)
    if (!preferOfflineSave) {
      await $fetch(`/api/subjects/${id}`, {
        method: 'DELETE',
      })
    }
  }

  async function updateSubject(_subject: ISelectedSubject) {
    const index = subjects.value.findIndex((s) => s.id === _subject.id)
    subjects.value = subjects.value.map((c, i) => (i === index ? _subject : c))
    await storage.setItem('mySubjects', subjects.value)
    if (!preferOfflineSave) {
      await $fetch(`/api/subjects/${_subject.id}`, {
        method: 'PUT',
        body: _subject,
      })
    }
  }

  async function fetchSubjects() {
    if (preferOfflineSave) {
      const data = (await storage.getItem<ISelectedSubject[]>('mySubjects')) || []
      const _subjets = data?.filter((subject) => subject?.schedules?.length > 0)
      subjects.value = _subjets
    } else {
      const data = await $fetch<ISelectedSubject[]>('/api/subjects')
      subjects.value = data?.filter((subject) => subject?.schedules?.length > 0)
    }
  }

  return {
    mySubjects: subjects,
    updateSubject,
    saveNewSubject,
    deleteSubjectById,
    fetchSubjects,
  }
}
