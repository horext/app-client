import type {
  ISchedulesRepository,
  ISchedulesFavoritesRepository,
} from './schedules-repository.interface'
import type { IActivitiesRepository } from './activities.repository.interface'
import type { IProfileRepository } from './profile-repository.interface'
import type { IAcademicConfigRepository } from './academic-config.repository.interface'
import type { IPreferencesRepository } from './preferences-repository.interface'
import type { IGenerationRepository } from './generation.repository.interface'
import type { ISubjectsRepository } from './subjects-repository.interface'
import type { IActivity } from '../../shared/interfaces/event'
import type { IScheduleGenerate } from '../../shared/interfaces/schedule'
import type { IGenerationRecord } from '../../shared/interfaces/generation-record'
import type { ISubjectSchedules } from '../../shared/interfaces/subject'

export class NoopSchedulesRepository implements ISchedulesRepository {
  getByKey(): Promise<IScheduleGenerate | undefined> {
    throw new Error('Method not implemented.')
  }
  getEntries() {
    return Promise.resolve([])
  }
  create(): Promise<IScheduleGenerate> {
    throw new Error('Method not implemented.')
  }
  saveAll(): Promise<IScheduleGenerate[]> {
    throw new Error('Method not implemented.')
  }
  update(): Promise<IScheduleGenerate> {
    throw new Error('Method not implemented.')
  }
  deleteEntry() {
    return Promise.resolve()
  }
  deleteEntries() {
    return Promise.resolve()
  }
}

export class NoopSchedulesFavoritesRepository implements ISchedulesFavoritesRepository {
  getIds() {
    return Promise.resolve([])
  }
  isInList() {
    return Promise.resolve(false)
  }
  addToList() {
    return Promise.resolve()
  }
  removeFromList() {
    return Promise.resolve()
  }
  setList() {
    return Promise.resolve()
  }
}

export class NoopActivitiesRepository implements IActivitiesRepository {
  getAll() {
    return Promise.resolve([])
  }
  get() {
    return Promise.resolve(undefined)
  }
  create(): Promise<IActivity> {
    throw new Error('Method not implemented.')
  }
  update(): Promise<IActivity> {
    throw new Error('Method not implemented.')
  }
  putAll() {
    return Promise.resolve([])
  }
  delete() {
    return Promise.resolve()
  }
}

export class NoopProfileRepository implements IProfileRepository {
  get() {
    return Promise.resolve(undefined)
  }
  save() {
    return Promise.resolve()
  }
}

export class NoopAcademicConfigRepository implements IAcademicConfigRepository {
  get() {
    return Promise.resolve(undefined)
  }
  save() {
    return Promise.resolve()
  }
}

export class NoopPreferencesRepository implements IPreferencesRepository {
  get() {
    return Promise.resolve(undefined)
  }
  save() {
    return Promise.resolve()
  }
}

export class NoopGenerationRepository implements IGenerationRepository {
  getAll() {
    return Promise.resolve([])
  }
  get() {
    return Promise.resolve(undefined)
  }
  create(): Promise<IGenerationRecord> {
    throw new Error('Method not implemented.')
  }
  delete() {
    return Promise.resolve()
  }
}

export class NoopSubjectsRepository implements ISubjectsRepository {
  getAll() {
    return Promise.resolve([])
  }
  create(): Promise<ISubjectSchedules> {
    throw new Error('Method not implemented.')
  }
  update(): Promise<ISubjectSchedules> {
    throw new Error('Method not implemented.')
  }
  delete() {
    return Promise.resolve()
  }
}
