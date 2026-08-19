import type { IPageResponse } from '../interfaces/page'
import type { ISubjectResponse } from '../interfaces/subject'
import { BaseApi } from './base'

export type SearchParams = {
  search: string
  hourlyLoadId: number
} & (
  | {
      facultyId: number
    }
  | {
      specialityId: number
    }
  | {
      studyPlanId: number
    }
)

export interface ISubjectApi {
  findPageBySearch(
    params: SearchParams,
  ): Promise<IPageResponse<ISubjectResponse>>
}

const PATH_SUBJECTS = 'subjects'

export class SubjectApi extends BaseApi implements ISubjectApi {
  public findPageBySearch(params: SearchParams) {
    const { search, ..._params } = params
    return this.$fetch<IPageResponse<ISubjectResponse>>(
      PATH_SUBJECTS + '?search=' + search,
      {
        method: 'GET',
        params: _params,
      },
    )
  }
}
