import type { $Fetch } from 'nitropack'
import type { IPage } from '~/interfaces/page'
import type { ISubject } from '~/interfaces/subject'

const PATH_SUBJECTS = 'subjects'
export class CourseRepository {
  constructor(private $fetch: $Fetch) {}

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
