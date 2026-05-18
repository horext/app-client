import type { IOrganization } from './organization'

export interface IUserProfile {
  id: 'profile'
  faculty: IOrganization | null
  speciality: IOrganization | null
  setupCompleted: boolean
}
