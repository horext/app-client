import type { $Fetch } from 'nitropack'
import { CourseRepository } from '~/repositories/CourseRepository'
import { ScheduleSubjectRepository } from '~/repositories/ScheduleSubjectRepository'
import { ClassSessionRepository } from '~/repositories/ClassSessionRepository'
import { FacultyRepository } from '~/repositories/FacultyRepository'
import { HourlyLoadRepository } from '~/repositories/HourlyLoadRepository'
import { SpecialityRepository } from '~/repositories/SpecialityRepository'

export default ($axios: $Fetch) => ({
  course: new CourseRepository($axios),
  classSessions: new ClassSessionRepository($axios),
  speciality: new SpecialityRepository($axios),
  faculty: new FacultyRepository($axios),
  hourlyLoad: new HourlyLoadRepository($axios),
  scheduleSubject: new ScheduleSubjectRepository($axios),
})
