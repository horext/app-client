import type { ISelectedSubject } from '~/interfaces/subject'

export const useUserSubjects = () => {
  const service = useSubjectsService()
  const store = useUserSubjectsStore()
  const { subjects } = storeToRefs(store)

  async function saveNewSubject(_subject: ISelectedSubject) {
    await service.save(Object.assign({}, _subject))
    subjects.value.push(Object.assign({}, _subject))
  }

  async function deleteSubjectById(id: number) {
    await service.delete(id)
    const index = subjects.value.findIndex((s) => s.id === id)
    subjects.value.splice(index, 1)
  }

  async function updateSubject(_subject: ISelectedSubject) {
    await service.update(_subject)
    const index = subjects.value.findIndex((s) => s.id === _subject.id)
    subjects.value = subjects.value.map((c, i) => (i === index ? _subject : c))
  }

  async function fetchSubjects() {
    const data = await service.getAll()
    subjects.value = data.filter((subject: ISelectedSubject) => subject?.schedules?.length > 0)
  }

  return {
    mySubjects: subjects,
    updateSubject,
    saveNewSubject,
    deleteSubjectById,
    fetchSubjects,
  }
}
