export const useUserSubjects = () => {
  const configStore = useUserConfigStore()
  const { subjects: mySubjects } = storeToRefs(configStore)

  return {
    mySubjects,
    updateSubject: configStore.updateSubject,
    saveNewSubject: configStore.saveNewSubject,
    deleteSubjectById: configStore.deleteSubjectById,
  }
}
