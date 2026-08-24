import type {
  D1Database,
  D1PreparedStatement,
  D1Result,
} from '@cloudflare/workers-types'

export type ResourceType =
  | 'profile'
  | 'preferences'
  | 'academic-config'
  | 'activities'
  | 'subjects'
  | 'schedules'
  | 'generations'
  | 'favorites'

export const singletonResources = new Set<ResourceType>([
  'profile',
  'preferences',
  'academic-config',
])

export type CloudflareD1Result<T = unknown> = D1Result<T>
export type CloudflareD1Statement = D1PreparedStatement
export type CloudflareD1Database = D1Database

export interface CloudRecordRow {
  user_id: string
  resource_type: ResourceType
  record_id: string
  payload: string | null
  revision: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface SessionRow {
  id: string
  user_id: string
  csrf_token: string
  expires_at: string
  created_at: string
}

export interface AuthUserRow {
  id: string
  email: string
  name: string | null
  picture: string | null
  is_university_email: number
  created_at: string
  updated_at: string
}

export interface AuthContext {
  session: SessionRow
  user: AuthUserRow
}
