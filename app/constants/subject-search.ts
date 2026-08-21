export const formatSearchLocation = (
  specialityName?: string,
  studyPlanName?: string,
) => {
  if (studyPlanName) return `${specialityName} · ${studyPlanName}`
  if (specialityName) return specialityName
  return 'toda la facultad'
}
