import type { IUserProfile } from '~/interfaces/profile'

export interface IProfileService {
  getProfile(): Promise<IUserProfile | undefined>
  createProfile(initial: Omit<IUserProfile, 'id' | 'setupCompleted'> & { setupCompleted?: boolean }): Promise<IUserProfile>
  patch(partial: Partial<Omit<IUserProfile, 'id'>>): Promise<void>
}
