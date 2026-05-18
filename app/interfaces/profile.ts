import type { IOrganization } from './organization'

export interface IUserProfile {
  id: 'profile'
  faculty: IOrganization
  speciality: IOrganization
  setupCompleted: boolean
}
