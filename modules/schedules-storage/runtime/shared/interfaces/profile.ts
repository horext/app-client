import type { IEntityMetadata } from './entity-metadata'

export interface IBaseProfile {
  facultyId: number
  specialityId: number
  setupCompleted?: boolean
}

export interface IProfile extends IBaseProfile, IEntityMetadata {
  id: 'profile'
  setupCompleted: boolean
}
