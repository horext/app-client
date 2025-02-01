import type { ISelectedSubject } from '~/interfaces/subject'

export const useUserSubjects = () => {
  const storage = useLocalStorage()
  const configStore = useUserConfigStore()
  const { subjects } = storeToRefs(configStore)

  async function saveNewSubject(_subject: ISelectedSubject) {
    subjects.value.push(Object.assign({}, _subject))
    await storage.setItem('mySubjects', subjects.value)
  }

  async function deleteSubjectById(id: number) {
    const index = subjects.value.findIndex((s) => s.id === id)
    subjects.value.splice(index, 1)
    await storage.setItem('mySubjects', subjects.value)
  }

  async function updateSubject(_subject: ISelectedSubject) {
    const index = subjects.value.findIndex((s) => s.id === _subject.id)
    subjects.value = subjects.value.map((c, i) => (i === index ? _subject : c))
    await storage.setItem('mySubjects', subjects.value)
  }

  async function fetchSubjects() {
    const data = (await storage.getItem<ISelectedSubject[]>('mySubjects')) || []
    const _subjets = data?.filter((subject) => subject?.schedules?.length > 0)
    subjects.value = _subjets
  }

  return {
    mySubjects: subjects,
    updateSubject,
    saveNewSubject,
    deleteSubjectById,
    fetchSubjects,
  }
}
