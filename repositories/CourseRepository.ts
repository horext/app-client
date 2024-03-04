import type { IPage } from '~/interfaces/page'
import type { ISubject } from '~/interfaces/subject'
import { BaseRepository } from './BaseRepository'

const PATH_SUBJECTS = 'subjects'
export class CourseRepository extends BaseRepository {
  findBySearch(search: string, speciality: number, hourlyLoad: number) {
    return this.$fetch<IPage<ISubject>>(PATH_SUBJECTS + '?search=' + search, {
      method: 'GET',
      params: {
        speciality,
        hourlyLoad,
      },
    })
  }
}
