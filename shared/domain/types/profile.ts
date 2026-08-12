import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'

export interface IBaseProfile extends ReplicationState {
  facultyId: number
  specialityId: number
  setupCompleted?: boolean
}

export interface IProfile extends IBaseProfile, IAuditable, ReplicatedIdentity {
  setupCompleted: boolean
}

export type IProfileCreate = IBaseProfile
export type IProfileUpdate = Partial<IProfileCreate>
