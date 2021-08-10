import { NuxtAxiosInstance } from '@nuxtjs/axios'
import CourseRepository from '~/repositories/CourseRepository'
import ScheduleSubjectRepository from '~/repositories/ScheduleSubjectRepository'
import ClassSessionRepository from '~/repositories/ClassSessionRepository'

export default ($axios: NuxtAxiosInstance) => ({
  course: CourseRepository($axios),
  classSessions: ClassSessionRepository($axios),
  scheduleSubject: ScheduleSubjectRepository($axios)
})
