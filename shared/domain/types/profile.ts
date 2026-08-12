import type { IAuditable } from './entity-metadata'
import type { BrandUUID } from './ids'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'

export interface IBaseProfile extends ReplicationState {
  facultyId: number
  specialityId: number
  setupCompleted?: boolean
}

export type ProfileId = BrandUUID<'ProfileId'>
export interface IProfile
  extends IBaseProfile, IAuditable, ReplicatedIdentity<ProfileId> {
  setupCompleted: boolean
}

export type IProfileCreate = IBaseProfile
export type IProfileUpdate = Partial<IProfileCreate>
