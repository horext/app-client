import type { IAuditable } from './entity-metadata'
import type { UUID } from 'crypto'
export interface IBaseProfile {
  externalId?: UUID
  expectedRevision?: number
  facultyId: number
  specialityId: number
  setupCompleted?: boolean
}

export interface IProfile extends IBaseProfile, IAuditable {
  id: UUID
  setupCompleted: boolean
}

export type IProfileCreate = IBaseProfile
export type IProfileUpdate = Partial<IProfileCreate>
