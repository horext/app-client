import type { IEntityMetadata } from './entity-metadata'
import type { UUID } from 'crypto'
export interface IBaseProfile {
  facultyId: number
  specialityId: number
  setupCompleted?: boolean
}

export interface IProfile extends IBaseProfile, IEntityMetadata {
  id: UUID
  setupCompleted: boolean
}
