export const formatSearchLocation = (
  specialityName?: string,
  studyPlanName?: string,
) => {
  if (studyPlanName) return `${specialityName} · ${studyPlanName}`
  if (specialityName) return specialityName
  return 'toda la facultad'
}

export const getSubjectSearchScope = (
  facultyId: number,
  specialityId: number | null,
  studyPlanId: number | null,
) => {
  if (studyPlanId) return { studyPlanId }
  if (specialityId) return { specialityId }
  return { facultyId }
}
