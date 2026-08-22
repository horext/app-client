import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import {
  ScheduleGeneration,
  GeneratedSchedule,
  ScheduleFavorite,
  type GeneratedScheduleId,
} from '#shared/domain'
import type {
  ScheduleGenerationId,
  IScheduleGenerationParameters,
  IScheduleGeneration,
} from '#shared/domain/types/schedule-generation'
import { GenerationService } from '#shared/application/services/generation.service'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '#shared/application/repositories/schedules.repository'
import { persistedSnapshot } from '../../../shared/__tests__/persisted-snapshot'
import { makeUUID } from '~~/shared/domain/types/ids'

const input = {
  scheduleSubjectKey: 'k',
  schedulesSubject: [],
  crossings: 0,
  events: [],
}
const parameters: IScheduleGenerationParameters = {
  crossingsSetting: 0,
  weekDays: [1, 2, 3, 4, 5],
  hourlyLoadId: 1,
}
const ids = new Map<string, ScheduleGenerationId | GeneratedScheduleId>()
const idFor = <T extends ScheduleGenerationId | GeneratedScheduleId>(
  name: string,
): T => {
  const existing = ids.get(name)
  if (existing) return existing as T
  const generated: T = makeUUID()
  ids.set(name, generated)
  return generated
}
const createSchedule = () =>
  GeneratedSchedule.restore(
    persistedSnapshot(GeneratedSchedule.create(input).toSnapshot()),
  )
const createFavorite = (scheduleId: GeneratedScheduleId) =>
  ScheduleFavorite.restore({
    id: scheduleId,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdBy: 'user-1',
    updatedBy: 'user-1',
  })
const makeRecord = (
  id: string,
  scheduleIds: string[] = [],
  generatedAt = '2024-01-01',
) => {
  return ScheduleGeneration.restore({
    id: idFor<ScheduleGenerationId>(id),
    ...parameters,
    generatedAt,
    scheduleIds: scheduleIds.map<GeneratedScheduleId>(idFor),
    resultCount: scheduleIds.length,
    occurrences: [],
    createdAt: generatedAt,
    updatedAt: generatedAt,
    createdBy: 'user-1',
    updatedBy: 'user-1',
  } satisfies IScheduleGeneration)
}

describe('GenerationService', () => {
  const makeGenRepo = (): Mocked<IGenerationRepository> => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })
  const makeSchedulesRepo = (): Mocked<ISchedulesRepository> => ({
    findAll: vi.fn(),
    findBy: vi.fn(),
    getEntries: vi.fn(),
    getByKey: vi.fn(),
    create: vi.fn(),
    createAll: vi.fn(),
    update: vi.fn(),
    deleteEntry: vi.fn(),
    deleteEntries: vi.fn(),
  })
  const makeFavoritesRepo = (): Mocked<ISchedulesFavoritesRepository> => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findByScheduleId: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  })
  let genRepo: Mocked<IGenerationRepository>
  let schedulesRepo: Mocked<ISchedulesRepository>
  let favoritesRepo: Mocked<ISchedulesFavoritesRepository>
  let service: GenerationService
  beforeEach(() => {
    genRepo = makeGenRepo()
    schedulesRepo = makeSchedulesRepo()
    favoritesRepo = makeFavoritesRepo()
    service = new GenerationService(genRepo, schedulesRepo, favoritesRepo)
  })

  describe('getGenerations', () => {
    it('returns records sorted by generatedAt', async () => {
      genRepo.findAll.mockResolvedValue([
        makeRecord('b', [], '2024-01-02'),
        makeRecord('a', [], '2024-01-01'),
      ])
      const result = await service.getGenerations('user-1')
      expect(result[0]?.id).toBe(idFor('a'))
      expect(result[1]?.id).toBe(idFor('b'))
    })
  })
  describe('getLatestGeneration', () => {
    it('returns undefined when no records', async () => {
      genRepo.findAll.mockResolvedValue([])
      expect(await service.getLatestGeneration('user-1')).toBeUndefined()
    })
    it('returns latest generation with schedules', async () => {
      const record = makeRecord('gen1', ['s1'])
      genRepo.findAll.mockResolvedValue([record])
      schedulesRepo.getEntries.mockResolvedValue([createSchedule()])
      const result = await service.getLatestGeneration('user-1')
      expect(result).toBeDefined()
      expect(result!.id).toBe(idFor('gen1'))
      expect(result!.schedules).toHaveLength(1)
    })
  })
  describe('getSchedulesForGeneration', () => {
    it('returns schedules for a given generation record', async () => {
      const record = makeRecord('gen1', ['s1', 's2'])
      schedulesRepo.getEntries.mockResolvedValue([
        createSchedule(),
        createSchedule(),
      ])
      const result = await service.getSchedulesForGeneration(
        'user-1',
        record.toSnapshot(),
      )
      expect(result).toHaveLength(2)
    })
  })
  describe('saveGeneration', () => {
    it('saves schedules and creates generation record', async () => {
      const schedule = createSchedule()
      const generation = makeRecord('gen1', [schedule.id])
      schedulesRepo.createAll.mockResolvedValue([schedule])
      genRepo.create.mockResolvedValue(generation)
      genRepo.findAll.mockResolvedValue([])
      const result = await service.saveGeneration(
        'user-1',
        parameters,
        [input],
        [],
        5,
      )
      expect(result.id).toBe(idFor('gen1'))
      expect(result.schedules).toHaveLength(1)
    })
    it('trims history when exceeding maxHistory', async () => {
      const schedule = createSchedule()
      schedulesRepo.createAll.mockResolvedValue([schedule])
      genRepo.create.mockResolvedValue(
        makeRecord('g3', [schedule.id], '2024-01-03'),
      )
      genRepo.findAll.mockResolvedValue([
        makeRecord('g1', ['s1'], '2024-01-01'),
        makeRecord('g2', ['s2'], '2024-01-02'),
        makeRecord('g3', ['s3'], '2024-01-03'),
      ])
      favoritesRepo.findAll.mockResolvedValue([])
      await service.saveGeneration('user-1', parameters, [input], [], 2)
      expect(genRepo.delete).toHaveBeenCalledWith('user-1', idFor('g1'))
    })
    it('does not delete schedules when all removed schedules are favorites', async () => {
      const schedule = createSchedule()
      schedulesRepo.createAll.mockResolvedValue([schedule])
      genRepo.create.mockResolvedValue(
        makeRecord('g3', [schedule.id], '2024-01-03'),
      )
      genRepo.findAll.mockResolvedValue([
        makeRecord('g1', ['s1'], '2024-01-01'),
        makeRecord('g2', ['s2'], '2024-01-02'),
        makeRecord('g3', ['s3'], '2024-01-03'),
      ])
      favoritesRepo.findAll.mockResolvedValue([createFavorite(idFor('s1'))])
      await service.saveGeneration('user-1', parameters, [input], [], 2)
      expect(schedulesRepo.deleteEntries).not.toHaveBeenCalled()
    })
    it('does not trim when within maxHistory', async () => {
      const schedule = createSchedule()
      schedulesRepo.createAll.mockResolvedValue([schedule])
      genRepo.create.mockResolvedValue(makeRecord('g1', [schedule.id]))
      genRepo.findAll.mockResolvedValue([makeRecord('g1', ['s1'])])
      await service.saveGeneration('user-1', parameters, [input], [], 5)
      expect(genRepo.delete).not.toHaveBeenCalled()
    })
    it('cleans saved schedules if generation creation fails', async () => {
      const schedule = createSchedule()
      schedulesRepo.createAll.mockResolvedValue([schedule])
      genRepo.create.mockRejectedValue(new Error('failed'))
      await expect(
        service.saveGeneration('user-1', parameters, [input], [], 5),
      ).rejects.toThrow('failed')
      expect(schedulesRepo.deleteEntries).toHaveBeenCalledWith('user-1', [
        expect.any(String),
      ])
    })
  })
})
