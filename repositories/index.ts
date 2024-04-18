import type { $Fetch } from 'nitropack'
import { CourseRepository } from '~/repositories/CourseRepository'
import { ScheduleSubjectRepository } from '~/repositories/ScheduleSubjectRepository'
import { ClassSessionRepository } from '~/repositories/ClassSessionRepository'
import { FacultyRepository } from '~/repositories/FacultyRepository'
import { HourlyLoadRepository } from '~/repositories/HourlyLoadRepository'
import { SpecialityRepository } from '~/repositories/SpecialityRepository'
import { StudyPlanRepository } from './StudyPlanRepository '

export default class Repositories {
  course: CourseRepository;
  classSessions: ClassSessionRepository;
  speciality: SpecialityRepository;
  faculty: FacultyRepository;
  hourlyLoad: HourlyLoadRepository;
  scheduleSubject: ScheduleSubjectRepository;
  studyPlan: StudyPlanRepository;

  constructor($axios: $Fetch) {
    this.course = new CourseRepository($axios);
    this.classSessions = new ClassSessionRepository($axios);
    this.speciality = new SpecialityRepository($axios);
    this.faculty = new FacultyRepository($axios);
    this.hourlyLoad = new HourlyLoadRepository($axios);
    this.scheduleSubject = new ScheduleSubjectRepository($axios);
    this.studyPlan = new StudyPlanRepository($axios);
  }
}
