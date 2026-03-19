import type { IPage } from '~/interfaces/page'
import type { ISubject } from '~/interfaces/subject'
import { BaseApi } from './base'

export interface ICourseApi {
  findBySearch(
    search: string,
    speciality: number,
    hourlyLoad: number,
  ): Promise<IPage<ISubject>>
}

const PATH_SUBJECTS = 'subjects'

export class CourseApi extends BaseApi implements ICourseApi {
  public findBySearch(search: string, speciality: number, hourlyLoad: number) {
    return this.$fetch<IPage<ISubject>>(PATH_SUBJECTS + '?search=' + search, {
      method: 'GET',
      params: {
        speciality,
        hourlyLoad,
      },
    })
  }
}
