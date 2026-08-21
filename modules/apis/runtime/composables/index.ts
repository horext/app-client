import {
  SUBJECT_API_KEY,
  FACULTY_API_KEY,
  HOURLY_LOAD_API_KEY,
  SCHEDULE_SUBJECT_API_KEY,
  SPECIALITY_API_KEY,
  STUDY_PLAN_API_KEY,
} from '../registry/keys'

import { inject } from 'vue'
import { defineApi } from '../core/define-api'
import { SubjectApi } from '../resources/subject'
import { FETCH_KEY } from '../core/symbols'
import { ScheduleSubjectApi } from '../resources/schedule-subject'
import { FacultyApi } from '../resources/faculty'
import { SpecialityApi } from '../resources/speciality'
import { StudyPlanApi } from '../resources/studyPlan'
import { HourlyLoadApi } from '../resources/hourly-load'

const useFetch = () => {
  const fetcher = inject(FETCH_KEY)
  if (!fetcher) throw Error('No fetch api provider')
  return fetcher
}

export const useScheduleSubjectApi = defineApi(
  SCHEDULE_SUBJECT_API_KEY,
  () => new ScheduleSubjectApi(useFetch()),
)

export const useFacultyApi = defineApi(
  FACULTY_API_KEY,
  () => new FacultyApi(useFetch()),
)

export const useSpecialityApi = defineApi(
  SPECIALITY_API_KEY,
  () => new SpecialityApi(useFetch()),
)

export const useStudyPlanApi = defineApi(
  STUDY_PLAN_API_KEY,
  () => new StudyPlanApi(useFetch()),
)

export const useSubjectApi = defineApi(
  SUBJECT_API_KEY,
  () => new SubjectApi(useFetch()),
)

export const useHourlyLoadApi = defineApi(
  HOURLY_LOAD_API_KEY,
  () => new HourlyLoadApi(useFetch()),
)
