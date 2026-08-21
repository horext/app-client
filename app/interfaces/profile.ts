import type { UUID } from 'crypto'
export interface IUserProfile {
  id: UUID
  facultyId: number
  specialityId: number | null
  studyPlanId?: number | null
  setupCompleted: boolean
}
