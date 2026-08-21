import type {
  IStudyPlanResponse,
  ISubjectResponse,
  ISubjectStudyPlanResponse,
} from '~~/modules/apis/runtime/interfaces/subject'
import type {
  IStudyPlan,
  ISubject,
  ISubjectStudyPlan,
} from '~/interfaces/subject'

export function toAppStudyPlan(studyPlan: IStudyPlanResponse): IStudyPlan {
  return {
    ...studyPlan,
    organizationUnit: {
      id: studyPlan.organizationUnit.id,
      name: studyPlan.organizationUnit.name ?? undefined,
      code: studyPlan.organizationUnit.code ?? undefined,
    },
  }
}

export function toAppSubject(subject: ISubjectResponse): ISubject {
  return {
    ...subject,
    studyPlan: toAppStudyPlan(subject.studyPlan),
  }
}

export function toAppSubjectStudyPlan(
  subject: ISubjectStudyPlanResponse,
): ISubjectStudyPlan {
  return Object.assign(toAppSubject(subject), {
    relationships: subject.relationships.map((relationship) => ({
      ...relationship,
    })),
  })
}
