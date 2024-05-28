import { BaseRepository } from './BaseRepository'
import type { IStudyPlan } from '~/interfaces/subject'
import type { ISubjectStudyPlan } from '~/interfaces/subject'

const PATH_STUDY_PLANS = 'studyPlans'

export class StudyPlanRepository extends BaseRepository {
  getAll() {
    return this.$fetch<IStudyPlan[]>(PATH_STUDY_PLANS)
  }

  getSubjectsByStudyPlanId(id: number) {
    return this.$fetch<ISubjectStudyPlan[]>(
      `${PATH_STUDY_PLANS}/${id}/subjects`,
    )
  }
}
