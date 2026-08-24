import { systemClock } from './use-cases/shared/contracts'
import {
  CreateSessionCommand,
  DeleteSessionCommand,
  ProjectValueQuery,
} from './use-cases/sessions'
import { useOrm } from '../database/client'
import { DrizzleSessionStore } from '../infrastructure/database/d1/session-store'
import { sha256, useDatabase } from '../utils/db'
import { verifyGoogleCredential } from '../utils/google'
import type { AuthContext } from '../utils/cloud-types'
import type { H3Event } from 'h3'
import { D1CloudReadModel } from '../infrastructure/database/d1/cloud-read-model'
import { GetChangesQuery, ListCloudRecordsQuery } from './use-cases/sync'
import {
  GetSingletonQuery,
  CreateSingletonCommand,
  PatchSingletonCommand,
  type SingletonRevisionReader,
  type SingletonService,
} from './use-cases/singletons'
import {
  academicConfigService,
  activitiesService,
  favoritesService,
  generationsService,
  preferencesService,
  profileService,
  schedulesService,
  subjectsService,
} from './services'
import {
  academicConfigRevision,
  activityRevision,
  favoriteRevision,
  generationRevision,
  preferencesRevision,
  profileRevision,
  scheduleRevision,
  subjectRevision,
} from '../infrastructure/database/d1/repositories/revision-queries'
import {
  CreateResourceCommand,
  DeleteResourceCommand,
  GetResourceQuery,
  type ResourceEntity,
  type ResourceRevisionReader,
  type ResourceService,
} from './use-cases/resources'
import { D1IdempotencyStore } from '../infrastructure/database/d1/idempotency-store'
import { PatchItemCommand } from './use-cases/resources'
import { CreateFavoriteCommand } from './use-cases/favorites'

export function sessionUseCases(event: H3Event) {
  const store = new DrizzleSessionStore(useOrm(event))
  return {
    create: new CreateSessionCommand(
      (credential) => verifyGoogleCredential(event, credential),
      store,
      {
        sessionToken: () => `${crypto.randomUUID()}${crypto.randomUUID()}`,
        csrfToken: () => crypto.randomUUID(),
        hash: sha256,
      },
      systemClock,
    ),
    delete: new DeleteSessionCommand(store),
    current: new ProjectValueQuery((auth: AuthContext) => ({
      user: {
        id: auth.user.id,
        email: auth.user.email,
        name: auth.user.name,
        picture: auth.user.picture,
        isUniversityEmail: Boolean(auth.user.is_university_email),
      },
      expiresAt: auth.session.expires_at,
    })),
    user: new ProjectValueQuery((auth: AuthContext) => ({
      id: auth.user.id,
      email: auth.user.email,
      name: auth.user.name,
      picture: auth.user.picture,
      isUniversityEmail: Boolean(auth.user.is_university_email),
      createdAt: auth.user.created_at,
      updatedAt: auth.user.updated_at,
    })),
  }
}

export function cloudQueryUseCases(event: H3Event) {
  const readModel = new D1CloudReadModel(useDatabase(event))
  return {
    activities: new ListCloudRecordsQuery('activities', readModel),
    subjects: new ListCloudRecordsQuery('subjects', readModel),
    schedules: new ListCloudRecordsQuery('schedules', readModel),
    generations: new ListCloudRecordsQuery('generations', readModel),
    favorites: new ListCloudRecordsQuery('favorites', readModel),
    changes: new GetChangesQuery(readModel),
  }
}

function singletonCases<Create, Patch, Entity extends object>(
  id: string,
  service: SingletonService<Create, Patch, Entity>,
  revisions: SingletonRevisionReader,
) {
  return {
    get: new GetSingletonQuery(id, service, revisions, systemClock),
    create: new CreateSingletonCommand(id, service, revisions, systemClock),
    patch: new PatchSingletonCommand(id, service, revisions, systemClock),
  }
}

export function singletonUseCases(event: H3Event) {
  const profile = profileService(event)
  const preferences = preferencesService(event)
  const academicConfig = academicConfigService(event)
  return {
    profile: singletonCases('profile', profile, {
      get: (userId) => profileRevision(event, userId),
    }),
    preferences: singletonCases('preferences', preferences, {
      get: (userId) => preferencesRevision(event, userId),
    }),
    academicConfig: singletonCases('academic-config', academicConfig, {
      get: (userId) => academicConfigRevision(event, userId),
    }),
  }
}

export function itemQueryUseCases(event: H3Event) {
  const activities = activitiesService(event)
  const subjects = subjectsService(event)
  const schedules = schedulesService(event)
  const generations = generationsService(event)
  const favorites = favoritesService(event)
  return {
    activities: {
      get: new GetResourceQuery(
        'activity',
        activities,
        { get: (userId, id) => activityRevision(event, userId, id) },
        systemClock,
      ),
      delete: new DeleteResourceCommand(activities),
    },
    subjects: {
      get: new GetResourceQuery(
        'subject',
        subjects,
        { get: (userId, id) => subjectRevision(event, userId, id) },
        systemClock,
      ),
      delete: new DeleteResourceCommand(subjects),
    },
    schedules: {
      get: new GetResourceQuery(
        'schedule',
        schedules,
        { get: (userId, id) => scheduleRevision(event, userId, id) },
        systemClock,
      ),
      delete: new DeleteResourceCommand(schedules),
    },
    generations: {
      get: new GetResourceQuery(
        'generation',
        generations,
        { get: (userId, id) => generationRevision(event, userId, id) },
        systemClock,
      ),
      delete: new DeleteResourceCommand(generations),
    },
    favorites: {
      delete: new DeleteResourceCommand(favorites),
      revision: (userId: string, id: string) =>
        favoriteRevision(event, userId, id),
    },
  }
}

export function itemCreateUseCases(event: H3Event) {
  const activities = activitiesService(event)
  const subjects = subjectsService(event)
  const schedules = schedulesService(event)
  const generations = generationsService(event)
  const idempotency = new D1IdempotencyStore(useDatabase(event))
  return {
    activities: new CreateResourceCommand(
      'activity',
      activities,
      { get: (userId, id) => activityRevision(event, userId, id) },
      idempotency,
      systemClock,
      (id) => `/api/v1/activities/${id}`,
    ),
    subjects: new CreateResourceCommand(
      'subject',
      subjects,
      { get: (userId, id) => subjectRevision(event, userId, id) },
      idempotency,
      systemClock,
      (id) => `/api/v1/subjects/${id}`,
    ),
    schedules: new CreateResourceCommand(
      'schedule',
      schedules,
      { get: (userId, id) => scheduleRevision(event, userId, id) },
      idempotency,
      systemClock,
      (id) => `/api/v1/schedules/${id}`,
    ),
    generations: new CreateResourceCommand(
      'generation',
      generations,
      { get: (userId, id) => generationRevision(event, userId, id) },
      idempotency,
      systemClock,
      (id) => `/api/v1/generations/${id}`,
    ),
  }
}

function itemWriteCases<Entity extends ResourceEntity>(
  resource: string,
  service: ResourceService<unknown, unknown, Entity>,
  revisions: ResourceRevisionReader,
) {
  return {
    patch: new PatchItemCommand(resource, service, revisions, systemClock),
  }
}

export function itemWriteUseCases(event: H3Event) {
  const activities = activitiesService(event)
  const subjects = subjectsService(event)
  const schedules = schedulesService(event)
  const generations = generationsService(event)
  const favorites = favoritesService(event)
  return {
    activities: itemWriteCases('activity', activities, {
      get: (userId, id) => activityRevision(event, userId, id),
    }),
    subjects: itemWriteCases('subject', subjects, {
      get: (userId, id) => subjectRevision(event, userId, id),
    }),
    schedules: itemWriteCases('schedule', schedules, {
      get: (userId, id) => scheduleRevision(event, userId, id),
    }),
    generations: itemWriteCases('generation', generations, {
      get: (userId, id) => generationRevision(event, userId, id),
    }),
    favorites: new CreateFavoriteCommand(
      favorites,
      { get: (userId, id) => favoriteRevision(event, userId, id) },
      systemClock,
    ),
  }
}
