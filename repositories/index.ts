import type { $Fetch } from 'nitropack'
import CourseRepository from '~/repositories/CourseRepository'
import ScheduleSubjectRepository from '~/repositories/ScheduleSubjectRepository'
import ClassSessionRepository from '~/repositories/ClassSessionRepository'
import FacultyRepository from '~/repositories/FacultyRepository'
import HourlyLoadRepository from '~/repositories/HourlyLoadRepository'
import SpecialityRepository from '~/repositories/SpecialityRepository'

export default ($axios: $Fetch) => ({
  course: CourseRepository($axios),
  classSessions: ClassSessionRepository($axios),
  speciality: SpecialityRepository($axios),
  faculty: FacultyRepository($axios),
  hourlyLoad: HourlyLoadRepository($axios),
  scheduleSubject: ScheduleSubjectRepository($axios),
})
