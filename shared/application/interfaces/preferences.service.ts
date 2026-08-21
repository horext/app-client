import type {
  IPreferences,
  IPreferencesUpdate,
} from '#shared/domain/types/preferences'

export interface IPreferencesService {
  get(userId: string): Promise<IPreferences | undefined>
  create(userId: string, initial?: IPreferencesUpdate): Promise<IPreferences>
  patch(userId: string, value: IPreferencesUpdate): Promise<IPreferences>
}
