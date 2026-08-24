import { SyncResource } from './resource'

export const individualResources = [
  SyncResource.PROFILE,
  SyncResource.PREFERENCES,
  SyncResource.ACADEMIC_CONFIG,
] as const

export type IndividualResource = (typeof individualResources)[number]
