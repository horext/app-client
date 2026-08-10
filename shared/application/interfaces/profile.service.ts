import type { IBaseProfile, IProfile } from '#shared/domain/types/profile'

export interface IProfileService {
  get(userId: string): Promise<IProfile | undefined>
  create(userId: string, initial: IBaseProfile): Promise<IProfile>
  patch(userId: string, value: Partial<IBaseProfile>): Promise<IProfile>
}
