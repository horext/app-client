import { BaseApi } from './base'
import type {
  IStudyPlanResponse,
  ISubjectStudyPlanResponse,
} from '../interfaces/subject'
import { PATH_SPECIALITIES } from './speciality'

export interface IStudyPlanApi {
  getAllBySpecialityId(specialityId: number): Promise<IStudyPlanResponse[]>
  getAll(): Promise<IStudyPlanResponse[]>
  getSubjectsByStudyPlanId(id: number): Promise<ISubjectStudyPlanResponse[]>
}

export const PATH_STUDY_PLANS = 'studyPlans'

export class StudyPlanApi extends BaseApi {
  getAll() {
    return this.$fetch<IStudyPlanResponse[]>(PATH_STUDY_PLANS)
  }

  getAllBySpecialityId(specialityId: number) {
    return this.$fetch<IStudyPlanResponse[]>(
      `${PATH_SPECIALITIES}/${specialityId}/${PATH_STUDY_PLANS}`,
    )
  }

  getSubjectsByStudyPlanId(id: number) {
    return this.$fetch<ISubjectStudyPlanResponse[]>(
      `${PATH_STUDY_PLANS}/${id}/subjects`,
    )
  }
}
