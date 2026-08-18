import type { IPageResponse } from '../interfaces/page'
import type {
  ICourseAffiliationResponse,
  ISubjectResponse,
} from '../interfaces/subject'
import { BaseApi } from './base'

export interface ICourseApi {
  findBySearch(
    search: string,
    speciality: number,
    hourlyLoad: number,
  ): Promise<IPageResponse<ISubjectResponse>>
  getAffiliations(courseIds: string[]): Promise<ICourseAffiliationResponse[]>
}

const PATH_SUBJECTS = 'subjects'

export class CourseApi extends BaseApi implements ICourseApi {
  public getAffiliations(courseIds: string[]) {
    return this.$fetch<ICourseAffiliationResponse[]>(
      PATH_SUBJECTS + '/affiliations',
      {
        method: 'POST',
        body: courseIds,
      },
    )
  }

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
