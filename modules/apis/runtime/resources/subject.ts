import type { IPageResponse } from '../interfaces/page'
import type { ISubjectResponse } from '../interfaces/subject'
import { BaseApi } from './base'
import { PATH_FACULTIES } from './faculty'
import { PATH_HOURLY_LOAD } from './hourly-load'
import { PATH_SPECIALITIES } from './speciality'
import { PATH_STUDY_PLANS } from './studyPlan'

export interface ISubjectSearchQuery {
  search: string
  hourlyLoadId: number
}

export interface ISubjectSearchFacultyQuery extends ISubjectSearchQuery {
  facultyId: number
}
export interface ISubjectSearchSpecialityQuery extends ISubjectSearchQuery {
  specialityId: number
}
export interface ISubjectSearchStudyPlanQuery extends ISubjectSearchQuery {
  studyPlanId: number
}
export interface ISubjectApi {
  findAllByIds(ids: number[]): Promise<ISubjectResponse[]>
  findPageByFaculty(
    params: ISubjectSearchFacultyQuery,
  ): Promise<IPageResponse<ISubjectResponse>>
  findPageBySpeciality(
    params: ISubjectSearchSpecialityQuery,
  ): Promise<IPageResponse<ISubjectResponse>>
  findPageByStudyPlan(
    params: ISubjectSearchStudyPlanQuery,
  ): Promise<IPageResponse<ISubjectResponse>>
  findAllByStudyPlanIdAndCycle(
    hourlyLoadId: number,
    studyPlanId: number,
    cycle: number,
  ): Promise<ISubjectResponse[]>
}

const PATH_SUBJECTS = 'subjects'

export class SubjectApi extends BaseApi implements ISubjectApi {
  public findAllByIds(ids: number[]) {
    return this.$fetch<ISubjectResponse[]>(PATH_SUBJECTS, {
      params: { ids: ids.join(',') },
    })
  }
  public findPageByFaculty(params: ISubjectSearchFacultyQuery) {
    return this.$fetch<IPageResponse<ISubjectResponse>>(
      `${PATH_HOURLY_LOAD}/${params.hourlyLoadId}/${PATH_FACULTIES}/${params.facultyId}/${PATH_SUBJECTS}?search=${params.search}`,
    )
  }

  public findPageBySpeciality(params: ISubjectSearchSpecialityQuery) {
    return this.$fetch<IPageResponse<ISubjectResponse>>(
      `${PATH_HOURLY_LOAD}/${params.hourlyLoadId}/${PATH_SPECIALITIES}/${params.specialityId}/${PATH_SUBJECTS}?search=${params.search}`,
    )
  }

  public findPageByStudyPlan(params: ISubjectSearchStudyPlanQuery) {
    return this.$fetch<IPageResponse<ISubjectResponse>>(
      `${PATH_HOURLY_LOAD}/${params.hourlyLoadId}/${PATH_STUDY_PLANS}/${params.studyPlanId}/${PATH_SUBJECTS}?search=${params.search}`,
    )
  }

  public findAllByStudyPlanIdAndCycle(
    hourlyLoadId: number,
    studyPlanId: number,
    cycle: number,
  ) {
    return this.$fetch<ISubjectResponse[]>(
      `${PATH_HOURLY_LOAD}/${hourlyLoadId}/${PATH_STUDY_PLANS}/${studyPlanId}/cycles/${cycle}/${PATH_SUBJECTS}`,
    )
  }
}
