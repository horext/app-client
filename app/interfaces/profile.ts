import type { UUID } from 'crypto'
export interface IUserProfile {
  id: UUID
  facultyId: number
  specialityId?: number
  studyPlanId?: number
  setupCompleted: boolean
}
