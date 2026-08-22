import type { IPreferencesUpdate } from '#shared/domain/types/preferences'
import type { Preferences } from '#shared/domain'

export interface IPreferencesService {
  get(userId: string): Promise<Preferences | undefined>
  create(userId: string, initial?: IPreferencesUpdate): Promise<Preferences>
  patch(userId: string, value: IPreferencesUpdate): Promise<Preferences>
}
