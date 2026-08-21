import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useUserProfileStore } from '~/stores/user-profile'
import { useSubjectsSearchStore } from '~/stores/subjects-search'
import { useSubjectsFilter } from '../subjects-filter'

describe('useSubjectsFilter', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useUserProfileStore().profile = {
      id: crypto.randomUUID(),
      facultyId: 1,
      specialityId: 2,
      studyPlanId: 3,
      setupCompleted: true,
    }
  })

  it('uses the profile context by default', () => {
    const { context, hasCustomContext } = useSubjectsFilter()

    expect(context.value).toEqual({ specialityId: 2, studyPlanId: 3 })
    expect(hasCustomContext.value).toBe(false)
  })

  it('sets a speciality override and clears the study plan', () => {
    const { context, hasCustomContext, setSpeciality } = useSubjectsFilter()

    setSpeciality(4)

    expect(context.value).toEqual({ specialityId: 4, studyPlanId: null })
    expect(hasCustomContext.value).toBe(true)
  })

  it('sets a study plan while retaining the selected speciality', () => {
    const { context, setSpeciality, setStudyPlan } = useSubjectsFilter()

    setSpeciality(4)
    setStudyPlan(5)

    expect(context.value).toEqual({ specialityId: 4, studyPlanId: 5 })
  })

  it('does not keep an override when the selected context matches the profile', () => {
    const { hasCustomContext, setSpeciality, setStudyPlan } =
      useSubjectsFilter()

    setSpeciality(4)
    setSpeciality(2)
    setStudyPlan(3)

    expect(hasCustomContext.value).toBe(false)
  })

  it('restores profile defaults', () => {
    const { context, hasCustomContext, setSpeciality, resetToProfileDefaults } =
      useSubjectsFilter()

    setSpeciality(4)
    resetToProfileDefaults()

    expect(context.value).toEqual({ specialityId: 2, studyPlanId: 3 })
    expect(hasCustomContext.value).toBe(false)
  })

  it('clears the session override when the faculty changes', async () => {
    const profileStore = useUserProfileStore()
    const searchStore = useSubjectsSearchStore()
    const { setSpeciality } = useSubjectsFilter()
    setSpeciality(4)

    profileStore.profile = { ...profileStore.profile!, facultyId: 6 }
    await nextTick()

    expect(searchStore.context).toBeUndefined()
  })
})
