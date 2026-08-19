import type { IPageResponse } from '../interfaces/page'
import type { ISubjectResponse } from '../interfaces/subject'
import { BaseApi } from './base'

export interface ISubjectApi {
  findBySearch(
    search: string,
    speciality: number,
    hourlyLoad: number,
  ): Promise<IPageResponse<ISubjectResponse>>
}

const PATH_SUBJECTS = 'subjects'

export class SubjectApi extends BaseApi implements ISubjectApi {
  public findBySearch(search: string, speciality: number, hourlyLoad: number) {
    return this.$fetch<IPageResponse<ISubjectResponse>>(
      PATH_SUBJECTS + '?search=' + search,
      {
        method: 'GET',
        params: {
          speciality,
          hourlyLoad,
        },
      },
    )
  }
}
