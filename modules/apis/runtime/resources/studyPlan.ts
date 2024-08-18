import { BaseApi } from './base'
import type { IStudyPlan } from '~/interfaces/subject'
import type { ISubjectStudyPlan } from '~/interfaces/subject'

export interface IStudyPlanApi {
  getAll(): Promise<IStudyPlan[]>
  getSubjectsByStudyPlanId(id: number): Promise<ISubjectStudyPlan[]>
}

const PATH_STUDY_PLANS = 'studyPlans'

export class StudyPlanApi extends BaseApi {
  getAll() {
    return this.$fetch<IStudyPlan[]>(PATH_STUDY_PLANS)
  }

  getSubjectsByStudyPlanId(id: number) {
    return this.$fetch<ISubjectStudyPlan[]>(
      `${PATH_STUDY_PLANS}/${id}/subjects`,
    )
  }
}
