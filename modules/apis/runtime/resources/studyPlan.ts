import { BaseApi } from './base'
import type {
  IStudyPlanResponse,
  ISubjectStudyPlanResponse,
} from '../interfaces/subject'

export interface IStudyPlanApi {
  getAll(): Promise<IStudyPlanResponse[]>
  getSubjectsByStudyPlanId(id: number): Promise<ISubjectStudyPlanResponse[]>
}

const PATH_STUDY_PLANS = 'studyPlans'

export class StudyPlanApi extends BaseApi {
  getAll() {
    return this.$fetch<IStudyPlanResponse[]>(PATH_STUDY_PLANS)
  }

  getSubjectsByStudyPlanId(id: number) {
    return this.$fetch<ISubjectStudyPlanResponse[]>(
      `${PATH_STUDY_PLANS}/${id}/subjects`,
    )
  }
}
