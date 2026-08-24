import {
  check,
  foreignKey,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import type { IActivity, Weekdays } from '#shared/domain/types/event'
import type { IHourlyLoad } from '#shared/domain/types/hourly-load'
import type { IIntersectionOccurrence } from '#shared/domain/types/occurrences'
import type { IPreferences } from '#shared/domain/types/preferences'
import type { IProfile } from '#shared/domain/types/profile'
import type {
  IScheduleFavorite,
  IGeneratedSchedule,
  IGeneratedScheduleSubject,
} from '#shared/domain/types/schedule'
import type {
  IClassroom,
  ISubject,
  IPlannedSubject,
  ITeacher,
} from '#shared/domain/types/subject'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import type { IScheduleGeneration } from '#shared/domain/types/schedule-generation'

const canonicalUuid = sql`lower(
  hex(randomblob(4)) || '-' ||
  hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' ||
  substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)), 2) || '-' ||
  hex(randomblob(6))
)`

const sync = <T>() => ({
  payloadJson: text('payload_json', { mode: 'json' }).$type<T>().notNull(),
  revision: integer('revision').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
})
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  picture: text('picture'),
  isUniversityEmail: integer('is_university_email', { mode: 'boolean' })
    .notNull()
    .default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    csrfToken: text('csrf_token').notNull(),
    expiresAt: text('expires_at').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [
    index('sessions_user_id').on(t.userId),
    index('sessions_expires_at').on(t.expiresAt),
  ],
)
export const profiles = sqliteTable(
  'profiles',
  {
    id: text('id').primaryKey().default(canonicalUuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    localId: text('local_id').notNull(),
    facultyId: integer('faculty_id').notNull(),
    specialityId: integer('speciality_id').notNull(),
    setupCompleted: integer('setup_completed', { mode: 'boolean' }).notNull(),
    ...sync<IProfile>(),
  },
  (t) => [
    uniqueIndex('profiles_user_id').on(t.userId),
    uniqueIndex('profiles_user_local_id').on(t.userId, t.localId),
    check('profiles_payload_json_valid', sql`json_valid(${t.payloadJson})`),
  ],
)
export const preferences = sqliteTable(
  'preferences',
  {
    id: text('id').primaryKey().default(canonicalUuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    localId: text('local_id').notNull(),
    weekdaysJson: text('weekdays_json', { mode: 'json' })
      .$type<Weekdays[]>()
      .notNull(),
    crossings: integer('crossings').notNull(),
    maxGenerationHistory: integer('max_generation_history').notNull(),
    ...sync<IPreferences>(),
  },
  (t) => [
    uniqueIndex('preferences_user_id').on(t.userId),
    uniqueIndex('preferences_user_local_id').on(t.userId, t.localId),
    check(
      'preferences_weekdays_json_valid',
      sql`json_valid(${t.weekdaysJson})`,
    ),
    check('preferences_payload_json_valid', sql`json_valid(${t.payloadJson})`),
  ],
)
export const academicConfigs = sqliteTable(
  'academic_configs',
  {
    id: text('id').primaryKey().default(canonicalUuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    localId: text('local_id').notNull(),
    hourlyLoadId: integer('hourly_load_id'),
    hourlyLoadSnapshotJson: text('hourly_load_snapshot_json', {
      mode: 'json',
    }).$type<IHourlyLoad | null>(),
    ...sync<IAcademicConfig>(),
  },
  (t) => [
    uniqueIndex('academic_configs_user_id').on(t.userId),
    uniqueIndex('academic_configs_user_local_id').on(t.userId, t.localId),
    check(
      'academic_configs_hourly_load_snapshot_json_valid',
      sql`${t.hourlyLoadSnapshotJson} IS NULL OR json_valid(${t.hourlyLoadSnapshotJson})`,
    ),
    check(
      'academic_configs_payload_json_valid',
      sql`json_valid(${t.payloadJson})`,
    ),
  ],
)
export const activities = sqliteTable(
  'activities',
  {
    id: text('id').primaryKey().default(canonicalUuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    localId: text('local_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    location: text('location'),
    color: text('color').notNull(),
    allowOverlap: integer('allow_overlap', { mode: 'boolean' }).notNull(),
    ...sync<IActivity>(),
  },
  (t) => [
    uniqueIndex('activities_user_local_id').on(t.userId, t.localId),
    check('activities_payload_json_valid', sql`json_valid(${t.payloadJson})`),
  ],
)
export const activitySessions = sqliteTable(
  'activity_sessions',
  {
    userId: text('user_id').notNull(),
    activityId: text('activity_id').notNull(),
    position: integer('position').notNull(),
    day: integer('day').notNull(),
    startTime: text('start_time').notNull(),
    endTime: text('end_time').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.activityId, t.position] }),
    foreignKey({
      columns: [t.activityId],
      foreignColumns: [activities.id],
    }).onDelete('cascade'),
  ],
)
export const userSubjects = sqliteTable(
  'user_subjects',
  {
    id: text('id').primaryKey().default(canonicalUuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    localId: text('local_id').notNull(),
    subjectId: integer('subject_id').notNull(),
    color: text('color'),
    subjectSnapshotJson: text('subject_snapshot_json', { mode: 'json' })
      .$type<ISubject>()
      .notNull(),
    ...sync<IPlannedSubject>(),
  },
  (t) => [
    uniqueIndex('user_subjects_user_local_id').on(t.userId, t.localId),
    check(
      'user_subjects_snapshot_json_valid',
      sql`json_valid(${t.subjectSnapshotJson})`,
    ),
    check(
      'user_subjects_payload_json_valid',
      sql`json_valid(${t.payloadJson})`,
    ),
  ],
)
export const userSubjectSchedules = sqliteTable(
  'user_subject_schedules',
  {
    userId: text('user_id').notNull(),
    userSubjectId: text('user_subject_id').notNull(),
    scheduleId: integer('schedule_id').notNull(),
    sectionId: text('section_id').notNull(),
    scheduleSubjectId: integer('schedule_subject_id').notNull(),
    position: integer('position').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.userSubjectId, t.scheduleId] }),
    foreignKey({
      columns: [t.userSubjectId],
      foreignColumns: [userSubjects.id],
    }).onDelete('cascade'),
  ],
)
export const userSubjectSessions = sqliteTable(
  'user_subject_sessions',
  {
    userId: text('user_id').notNull(),
    userSubjectId: text('user_subject_id').notNull(),
    scheduleId: integer('schedule_id').notNull(),
    sessionId: integer('session_id').notNull(),
    position: integer('position').notNull(),
    classroomJson: text('classroom_json', { mode: 'json' })
      .$type<IClassroom>()
      .notNull(),
    teacherJson: text('teacher_json', {
      mode: 'json',
    }).$type<ITeacher | null>(),
    typeJson: text('type_json', { mode: 'json' })
      .$type<{ id: number; code: string }>()
      .notNull(),
    day: integer('day').notNull(),
    startTime: text('start_time').notNull(),
    endTime: text('end_time').notNull(),
  },
  (t) => [
    primaryKey({
      columns: [t.userId, t.userSubjectId, t.scheduleId, t.sessionId],
    }),
    foreignKey({
      columns: [t.userId, t.userSubjectId, t.scheduleId],
      foreignColumns: [
        userSubjectSchedules.userId,
        userSubjectSchedules.userSubjectId,
        userSubjectSchedules.scheduleId,
      ],
    }).onDelete('cascade'),
    check(
      'user_subject_sessions_classroom_json_valid',
      sql`json_valid(${t.classroomJson})`,
    ),
    check(
      'user_subject_sessions_teacher_json_valid',
      sql`${t.teacherJson} IS NULL OR json_valid(${t.teacherJson})`,
    ),
    check(
      'user_subject_sessions_type_json_valid',
      sql`json_valid(${t.typeJson})`,
    ),
  ],
)
export const schedules = sqliteTable(
  'schedules',
  {
    id: text('id').primaryKey().default(canonicalUuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    localId: text('local_id').notNull(),
    scheduleSubjectKey: text('schedule_subject_key').notNull(),
    crossings: integer('crossings').notNull(),
    ...sync<IGeneratedSchedule>(),
  },
  (t) => [
    uniqueIndex('schedules_user_local_id').on(t.userId, t.localId),
    index('schedules_by_subject_key').on(t.userId, t.scheduleSubjectKey),
    check('schedules_payload_json_valid', sql`json_valid(${t.payloadJson})`),
  ],
)
export const scheduleSubjects = sqliteTable(
  'schedule_subjects',
  {
    userId: text('user_id').notNull(),
    scheduleId: text('schedule_id').notNull(),
    subjectId: integer('subject_id').notNull(),
    subjectScheduleId: integer('subject_schedule_id').notNull(),
    position: integer('position').notNull(),
    snapshotJson: text('snapshot_json', { mode: 'json' })
      .$type<IGeneratedScheduleSubject>()
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.scheduleId, t.position] }),
    foreignKey({
      columns: [t.scheduleId],
      foreignColumns: [schedules.id],
    }).onDelete('cascade'),
    check(
      'schedule_subjects_snapshot_json_valid',
      sql`json_valid(${t.snapshotJson})`,
    ),
  ],
)
export const scheduleEvents = sqliteTable(
  'schedule_events',
  {
    userId: text('user_id').notNull(),
    scheduleId: text('schedule_id').notNull(),
    eventId: text('event_id').notNull(),
    title: text('title').notNull(),
    category: text('category'),
    type: text('type').notNull(),
    day: integer('day').notNull(),
    startTime: text('start_time').notNull(),
    endTime: text('end_time').notNull(),
    description: text('description'),
    location: text('location'),
    color: text('color').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.scheduleId, t.eventId] }),
    foreignKey({
      columns: [t.scheduleId],
      foreignColumns: [schedules.id],
    }).onDelete('cascade'),
  ],
)
export const generations = sqliteTable(
  'generations',
  {
    id: text('id').primaryKey().default(canonicalUuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    localId: text('local_id').notNull(),
    generatedAt: text('generated_at').notNull(),
    crossingsSetting: integer('crossings_setting').notNull(),
    weekdaysJson: text('weekdays_json', { mode: 'json' })
      .$type<Weekdays[]>()
      .notNull(),
    hourlyLoadId: integer('hourly_load_id').notNull(),
    resultCount: integer('result_count').notNull(),
    occurrencesJson: text('occurrences_json', { mode: 'json' })
      .$type<IIntersectionOccurrence[]>()
      .notNull(),
    ...sync<IScheduleGeneration>(),
  },
  (t) => [
    uniqueIndex('generations_user_local_id').on(t.userId, t.localId),
    check(
      'generations_weekdays_json_valid',
      sql`json_valid(${t.weekdaysJson})`,
    ),
    check(
      'generations_occurrences_json_valid',
      sql`json_valid(${t.occurrencesJson})`,
    ),
    check('generations_payload_json_valid', sql`json_valid(${t.payloadJson})`),
  ],
)
export const generationSchedules = sqliteTable(
  'generation_schedules',
  {
    userId: text('user_id').notNull(),
    generationId: text('generation_id').notNull(),
    scheduleId: text('schedule_id').notNull(),
    position: integer('position').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.generationId, t.scheduleId] }),
    foreignKey({
      columns: [t.generationId],
      foreignColumns: [generations.id],
    }).onDelete('cascade'),
    foreignKey({
      columns: [t.scheduleId],
      foreignColumns: [schedules.id],
    }),
  ],
)
export const favorites = sqliteTable(
  'favorites',
  {
    id: text('id').primaryKey().default(canonicalUuid),
    userId: text('user_id').notNull(),
    scheduleId: text('schedule_id').notNull(),
    localId: text('local_id').notNull(),
    ...sync<IScheduleFavorite>(),
  },
  (t) => [
    uniqueIndex('favorites_user_local_id').on(t.userId, t.localId),
    foreignKey({
      columns: [t.scheduleId],
      foreignColumns: [schedules.id],
    }).onDelete('cascade'),
    check('favorites_payload_json_valid', sql`json_valid(${t.payloadJson})`),
  ],
)
export const changes = sqliteTable(
  'changes',
  {
    sequence: integer('sequence').primaryKey({ autoIncrement: true }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    resourceType: text('resource_type').notNull(),
    recordId: text('record_id').notNull(),
    revision: integer('revision').notNull(),
    operation: text('operation').notNull(),
    changedAt: text('changed_at').notNull(),
  },
  (t) => [index('changes_feed').on(t.userId, t.sequence)],
)
export const processedOperations = sqliteTable(
  'processed_operations',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    operationId: text('operation_id').notNull(),
    responseBody: text('response_body').notNull(),
    createdAt: text('created_at').notNull(),
    expiresAt: text('expires_at').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.operationId] }),
    index('idempotency_expiry').on(t.expiresAt),
  ],
)
