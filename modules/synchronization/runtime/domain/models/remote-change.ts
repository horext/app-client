import type { IActivity } from '#shared/domain/types/event'
import type {
  IScheduleFavorite,
  IGeneratedSchedule,
} from '#shared/domain/types/schedule'
import type { IScheduleGeneration } from '#shared/domain/types/schedule-generation'
import type { IPlannedSubject } from '#shared/domain/types/subject'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import type { IPreferences } from '#shared/domain/types/preferences'
import type { IProfile } from '#shared/domain/types/profile'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'

export type AggregateFeedChange<Data> = {
  sequence: number
  id: string
  operation: 'upsert' | 'delete'
  revision: number
  changedAt: string
  data: Data | null
}
export type ProfileRemoteChange = AggregateFeedChange<IProfile>
export type PreferencesRemoteChange = AggregateFeedChange<IPreferences>
export type AcademicConfigRemoteChange = AggregateFeedChange<IAcademicConfig>
export type ActivitiesRemoteChange = AggregateFeedChange<IActivity>
export type SubjectsRemoteChange = AggregateFeedChange<IPlannedSubject>
export type SchedulesRemoteChange = AggregateFeedChange<IGeneratedSchedule>
export type GenerationsRemoteChange = AggregateFeedChange<IScheduleGeneration>
export type FavoritesRemoteChange = AggregateFeedChange<IScheduleFavorite>

export interface RemoteChangeMap {
  [SyncResource.PROFILE]: ProfileRemoteChange
  [SyncResource.PREFERENCES]: PreferencesRemoteChange
  [SyncResource.ACADEMIC_CONFIG]: AcademicConfigRemoteChange
  [SyncResource.ACTIVITIES]: ActivitiesRemoteChange
  [SyncResource.SUBJECTS]: SubjectsRemoteChange
  [SyncResource.SCHEDULES]: SchedulesRemoteChange
  [SyncResource.GENERATIONS]: GenerationsRemoteChange
  [SyncResource.FAVORITES]: FavoritesRemoteChange
}

export type RemoteChange<R extends SyncResource> = RemoteChangeMap[R]

export interface ExplicitChangesFeed {
  profile: ProfileRemoteChange[]
  preferences: PreferencesRemoteChange[]
  academicConfig: AcademicConfigRemoteChange[]
  activities: ActivitiesRemoteChange[]
  subjects: SubjectsRemoteChange[]
  schedules: SchedulesRemoteChange[]
  generations: GenerationsRemoteChange[]
  favorites: FavoritesRemoteChange[]
  cursor: string
  hasMore: boolean
}
