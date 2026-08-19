import type { IRegistryItem } from '../interfaces/registry'
import { SubjectApi } from '../resources/subject'
import { FacultyApi } from '../resources/faculty'
import { HourlyLoadApi } from '../resources/hourly-load'
import { ScheduleSubjectApi } from '../resources/schedule-subject'
import { SpecialityApi } from '../resources/speciality'
import { StudyPlanApi } from '../resources/studyPlan'
import {
  SUBJECT_API_KEY,
  FACULTY_API_KEY,
  HOURLY_LOAD_API_KEY,
  SCHEDULE_SUBJECT_API_KEY,
  SPECIALITY_API_KEY,
  STUDY_PLAN_API_KEY,
} from './keys'

export const APIS_REGISTRY = [
  {
    provide: SUBJECT_API_KEY,
    use: SubjectApi,
  },
  {
    provide: FACULTY_API_KEY,
    use: FacultyApi,
  },
  {
    provide: HOURLY_LOAD_API_KEY,
    use: HourlyLoadApi,
  },
  {
    provide: SCHEDULE_SUBJECT_API_KEY,
    use: ScheduleSubjectApi,
  },
  {
    provide: SPECIALITY_API_KEY,
    use: SpecialityApi,
  },
  {
    provide: STUDY_PLAN_API_KEY,
    use: StudyPlanApi,
  },
] as const satisfies IRegistryItem[]
