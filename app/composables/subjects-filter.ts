import { computed, watch } from 'vue'
import { useSubjectsSearchStore } from '~/stores/subjects-search'
import type { SubjectSearchContext } from '~/stores/subjects-search'

export const useSubjectsFilter = () => {
  const profileStore = useUserProfileStore()
  const subjectsSearchStore = useSubjectsSearchStore()
  const { context: storedContext } = storeToRefs(subjectsSearchStore)
  const {
    facultyId,
    specialityId: profileSpecialityId,
    studyPlanId: profileStudyPlanId,
  } = storeToRefs(profileStore)

  const context = computed<SubjectSearchContext>(
    () =>
      storedContext.value ?? {
        specialityId: profileSpecialityId.value,
        studyPlanId: profileStudyPlanId.value,
      },
  )
  const hasCustomContext = computed(() => !!storedContext.value)

  const profileContext = computed<SubjectSearchContext>(() => ({
    specialityId: profileSpecialityId.value,
    studyPlanId: profileStudyPlanId.value,
  }))

  const setContext = (value: SubjectSearchContext) => {
    const defaults = profileContext.value
    subjectsSearchStore.setContext(
      value.specialityId === defaults.specialityId &&
        value.studyPlanId === defaults.studyPlanId
        ? undefined
        : value,
    )
  }

  const resetToProfileDefaults = () => {
    subjectsSearchStore.setContext(undefined)
  }

  const setSpeciality = (value: number | null) => {
    setContext({
      specialityId: value,
      studyPlanId: null,
    })
  }

  const setStudyPlan = (value: number | null) => {
    setContext({
      specialityId: context.value.specialityId,
      studyPlanId: value,
    })
  }

  watch(facultyId, (value, previousValue) => {
    if (value && previousValue && value !== previousValue) {
      resetToProfileDefaults()
    }
  })

  return {
    context,
    hasCustomContext,
    setSpeciality,
    setStudyPlan,
    resetToProfileDefaults,
  }
}
