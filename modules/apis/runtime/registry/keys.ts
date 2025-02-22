import type { IClassSessionApi } from '../resources/class-session'
import type { ICourseApi } from '../resources/course'
import type { IFacultyApi } from '../resources/faculty'
import type { IHourlyLoadApi } from '../resources/hourly-load'
import type { IScheduleSubjectApi } from '../resources/schedule-subject'
import type { ISpecialityApi } from '../resources/speciality'
import type { IStudyPlanApi } from '../resources/studyPlan'
import type { InjectionKey } from 'vue'

export const CLASS_SESSION_API_KEY: InjectionKey<IClassSessionApi> =
  Symbol('ClassScheduleApi')

export const COURSE_API_KEY: InjectionKey<ICourseApi> = Symbol('CourseApi')

export const FACULTY_API_KEY: InjectionKey<IFacultyApi> = Symbol('FacultyApi')

export const SPECIALITY_API_KEY: InjectionKey<ISpecialityApi> =
  Symbol('SpecialityApi')

export const HOURLY_LOAD_API_KEY: InjectionKey<IHourlyLoadApi> =
  Symbol('HourlyLoadApi')

export const SCHEDULE_SUBJECT_API_KEY: InjectionKey<IScheduleSubjectApi> =
  Symbol('ScheduleSubjectApi')

export const STUDY_PLAN_API_KEY: InjectionKey<IStudyPlanApi> =
  Symbol('StudyPlanApi')
