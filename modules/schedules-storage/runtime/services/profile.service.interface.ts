import type { IUserProfile } from '~/interfaces/profile'
import type { IOrganization } from '~/interfaces/organization'

export interface IProfileService {
  getProfile(): Promise<IUserProfile | undefined>
  createProfile(): Promise<IUserProfile>
  patch(partial: Partial<Omit<IUserProfile, 'id'>>): Promise<void>
  completeSetup(faculty: IOrganization | null, speciality: IOrganization | null): Promise<void>
}
