import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import type { UUID } from 'crypto'
import { GenerationService } from '../generation.service'
import type { IGenerationRepository } from '../../repositories/generation.repository.interface'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '../../repositories/schedules-repository.interface'
import type { IGenerationRecord } from '../../../shared/interfaces/generation-record'
import type { Weekdays } from '../../../shared/interfaces/event'

describe('GenerationService', () => {
  const makeGenRepo = (): Mocked<IGenerationRepository> => ({
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  })

  const makeSchedulesRepo = (): Mocked<ISchedulesRepository> => ({
    saveAll: vi.fn(),
    getEntries: vi.fn(),
    deleteEntries: vi.fn(),
    create: vi.fn(),
    getByKey: vi.fn(),
    update: vi.fn(),
    deleteEntry: vi.fn(),
  })

  const makeFavoritesRepo = (): Mocked<ISchedulesFavoritesRepository> => ({
    getIds: vi.fn(),
    create: vi.fn(),
    deleteById: vi.fn(),
    findById: vi.fn(),
  })

  const makeRecord = (
    id: string,
    scheduleIds: string[] = [],
    generatedAt = '2024-01-01T00:00:00Z',
  ): IGenerationRecord => ({
    id: id as UUID,
    scheduleIds: scheduleIds as UUID[],
    generatedAt,
    resultCount: scheduleIds.length,
    occurrences: [],
    crossingsSetting: 0,
    weekDays: [1, 2, 3, 4, 5] as Weekdays[],
    hourlyLoadId: 1,
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
      const records = [
        makeRecord('b', [], '2024-01-02T00:00:00Z'),
        makeRecord('a', [], '2024-01-01T00:00:00Z'),
      ]
      genRepo.getAll.mockResolvedValue(records)
      const result = await service.getGenerations()
      expect(result[0]?.id).toBe('a')
      expect(result[1]?.id).toBe('b')
    })
  })

  describe('getLatestGeneration', () => {
    it('returns undefined when no records', async () => {
      genRepo.getAll.mockResolvedValue([])
      expect(await service.getLatestGeneration()).toBeUndefined()
    })

    it('returns latest generation with schedules', async () => {
      const record = makeRecord('gen1', ['s1'])
      genRepo.getAll.mockResolvedValue([record])
      schedulesRepo.getEntries.mockResolvedValue([
        {
          id: 's1' as UUID,
          scheduleSubjectKey: '',
          schedulesSubject: [],
          crossings: 0,
          events: [],
        },
      ])
      const result = await service.getLatestGeneration()
      expect(result).toBeDefined()
      expect(result!.id).toBe('gen1')
      expect(result!.schedules).toHaveLength(1)
    })
  })

  describe('getSchedulesForGeneration', () => {
    it('returns schedules for a given generation record', async () => {
      const record = makeRecord('gen1', ['s1', 's2'])
      schedulesRepo.getEntries.mockResolvedValue([
        {
          id: 's1' as UUID,
          scheduleSubjectKey: '',
          schedulesSubject: [],
          crossings: 0,
          events: [],
        },
        {
          id: 's2' as UUID,
          scheduleSubjectKey: '',
          schedulesSubject: [],
          crossings: 0,
          events: [],
        },
      ])
      const result = await service.getSchedulesForGeneration(record)
      expect(result).toHaveLength(2)
    })
  })

  describe('saveGeneration', () => {
    it('saves schedules and creates generation record', async () => {
      const savedSchedules = [
        {
          id: 's1' as UUID,
          events: [],
          schedulesSubject: [],
          crossings: 0,
          scheduleSubjectKey: 'k',
        },
      ]
      schedulesRepo.saveAll.mockResolvedValue(savedSchedules)
      genRepo.getAll.mockResolvedValue([])
      genRepo.create.mockResolvedValue({
        id: 'gen1' as UUID,
        scheduleIds: ['s1' as UUID],
        generatedAt: '2024',
        resultCount: 1,
        occurrences: [],
        crossingsSetting: 0,
        weekDays: [1] as Weekdays[],
        hourlyLoadId: 1,
      })
      favoritesRepo.getIds.mockResolvedValue([])
      const meta = {
        generatedAt: '2024-01-01',
        crossingsSetting: 0,
        weekDays: [1, 2, 3, 4, 5] as Weekdays[],
        hourlyLoadId: 1,
      }
      const result = await service.saveGeneration(meta, savedSchedules, [], 5)
      expect(result.id).toBe('gen1')
      expect(result.schedules).toHaveLength(1)
    })

    it('trims history when exceeding maxHistory', async () => {
      const savedSchedules = [
        {
          id: 's3' as UUID,
          events: [],
          schedulesSubject: [],
          crossings: 0,
          scheduleSubjectKey: 'k',
        },
      ]
      schedulesRepo.saveAll.mockResolvedValue(savedSchedules)
      genRepo.getAll.mockResolvedValue([
        makeRecord('g1', ['s1'], '2024-01-01'),
        makeRecord('g2', ['s2'], '2024-01-02'),
        makeRecord('g3', ['s3'], '2024-01-03'),
      ])
      genRepo.create.mockResolvedValue({
        id: 'g3' as UUID,
        scheduleIds: ['s3' as UUID],
        generatedAt: '2024-01-03',
        resultCount: 1,
        occurrences: [],
        crossingsSetting: 0,
        weekDays: [1] as Weekdays[],
        hourlyLoadId: 1,
      })
      genRepo.delete.mockResolvedValue(undefined)
      favoritesRepo.getIds.mockResolvedValue([])
      schedulesRepo.deleteEntries.mockResolvedValue(undefined)
      await service.saveGeneration(
        {
          generatedAt: '2024-01-03',
          crossingsSetting: 0,
          weekDays: [1, 2, 3, 4, 5] as Weekdays[],
          hourlyLoadId: 1,
        },
        savedSchedules,
        [],
        2,
      )
      expect(genRepo.delete).toHaveBeenCalledWith('g1')
    })

    it('does not delete schedules when all removed schedules are favorites', async () => {
      const savedSchedules = [
        {
          id: 's3' as UUID,
          events: [],
          schedulesSubject: [],
          crossings: 0,
          scheduleSubjectKey: 'k',
        },
      ]
      schedulesRepo.saveAll.mockResolvedValue(savedSchedules)
      genRepo.getAll.mockResolvedValue([
        makeRecord('g1', ['s1'], '2024-01-01'),
        makeRecord('g2', ['s2'], '2024-01-02'),
        makeRecord('g3', ['s3'], '2024-01-03'),
      ])
      genRepo.create.mockResolvedValue({
        id: 'g3' as UUID,
        scheduleIds: ['s3' as UUID],
        generatedAt: '2024-01-03',
        resultCount: 1,
        occurrences: [],
        crossingsSetting: 0,
        weekDays: [1] as Weekdays[],
        hourlyLoadId: 1,
      })
      genRepo.delete.mockResolvedValue(undefined)
      favoritesRepo.getIds.mockResolvedValue(['s1' as UUID, 's2' as UUID])
      await service.saveGeneration(
        {
          generatedAt: '2024-01-03',
          crossingsSetting: 0,
          weekDays: [1, 2, 3, 4, 5] as Weekdays[],
          hourlyLoadId: 1,
        },
        savedSchedules,
        [],
        2,
      )
      expect(schedulesRepo.deleteEntries).not.toHaveBeenCalled()
    })

    it('does not trim when within maxHistory', async () => {
      const savedSchedules = [
        {
          id: 's1' as UUID,
          events: [],
          schedulesSubject: [],
          crossings: 0,
          scheduleSubjectKey: 'k',
        },
      ]
      schedulesRepo.saveAll.mockResolvedValue(savedSchedules)
      genRepo.getAll.mockResolvedValue([makeRecord('g1', ['s1'], '2024-01-01')])
      genRepo.create.mockResolvedValue({
        id: 'g1' as UUID,
        scheduleIds: ['s1' as UUID],
        generatedAt: '2024-01-01',
        resultCount: 1,
        occurrences: [],
        crossingsSetting: 0,
        weekDays: [1] as Weekdays[],
        hourlyLoadId: 1,
      })
      favoritesRepo.getIds.mockResolvedValue([])
      await service.saveGeneration(
        {
          generatedAt: '2024',
          crossingsSetting: 0,
          weekDays: [1, 2, 3, 4, 5] as Weekdays[],
          hourlyLoadId: 1,
        },
        savedSchedules,
        [],
        5,
      )
      expect(genRepo.delete).not.toHaveBeenCalled()
    })
  })
})
