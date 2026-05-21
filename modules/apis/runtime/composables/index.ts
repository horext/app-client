import {
  COURSE_API_KEY,
  FACULTY_API_KEY,
  HOURLY_LOAD_API_KEY,
  SCHEDULE_SUBJECT_API_KEY,
  SPECIALITY_API_KEY,
  STUDY_PLAN_API_KEY,
} from '../registry/keys'

import type { InjectionKey } from 'vue';
import { inject } from 'vue'
import type { IApiRegistry } from '..';

export function useApi<T>(provider: InjectionKey<T>, ctx?: IApiRegistry): T {
  const api = inject(provider) ?? ctx?.get(provider)
  if (!api) throw new Error('No api providedr for ' + provider.description)
  return api
}

export const useScheduleSubjectApi = () => useApi(SCHEDULE_SUBJECT_API_KEY)

export const useFacultyApi = () => useApi(FACULTY_API_KEY)

export const useSpecialityApi = () => useApi(SPECIALITY_API_KEY)

export const useStudyPlanApi = () => useApi(STUDY_PLAN_API_KEY)

export const useCourseApi = () => useApi(COURSE_API_KEY)

export const useHourlyLoadApi = (ctx?: IApiRegistry) => useApi(HOURLY_LOAD_API_KEY, ctx)

