import {
  CLASS_SESSION_API_KEY,
  COURSE_API_KEY,
  FACULTY_API_KEY,
  HOURLY_LOAD_API_KEY,
  SCHEDULE_SUBJECT_API_KEY,
  SPECIALITY_API_KEY,
  STUDY_PLAN_API_KEY,
} from '../registry/keys'

export function useApi<T>(provider: InjectionKey<T>): T {
  const api = inject(provider)
  if (!api) throw new Error('No api providedr for ' + provider.description)
  return api
}

export const useScheduleSubjectApi = () => useApi(SCHEDULE_SUBJECT_API_KEY)

export const useFacultyApi = () => useApi(FACULTY_API_KEY)

export const useSpecialityApi = () => useApi(SPECIALITY_API_KEY)

export const useStudyPlanApi = () => useApi(STUDY_PLAN_API_KEY)

export const useCourseApi = () => useApi(COURSE_API_KEY)

export const useHourlyLoadApi = () => useApi(HOURLY_LOAD_API_KEY)

export const useClassSessionApi = () => useApi(CLASS_SESSION_API_KEY)
