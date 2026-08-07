import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import type { UUID } from 'crypto'
import type { Weekdays } from '../../../shared/interfaces/event'
import { FavoritesSchedulesService } from '../favorites-schedules.service'
import type {
  ISchedulesRepository,
  ISchedulesFavoritesRepository,
} from '../../repositories/schedules-repository.interface'
import type { IGenerationRepository } from '../../repositories/generation.repository.interface'

describe('FavoritesSchedulesService', () => {
  const makeSchedule = (id = 'sched-1') => ({
    id: id as UUID,
    scheduleSubjectKey: `key-${id}`,
    events: [],
    schedulesSubject: [],
    crossings: 0,
  })

  const makeRepo = (): Mocked<ISchedulesRepository> => ({
    getEntries: vi.fn(),
    saveAll: vi.fn(),
    getByKey: vi.fn(),
    create: vi.fn(),
    deleteEntry: vi.fn(),
    update: vi.fn(),
    deleteEntries: vi.fn(),
  })

  const makeFavoritesRepo = (): Mocked<ISchedulesFavoritesRepository> => ({
    getIds: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    deleteById: vi.fn(),
  })

  const makeGenerationRepo = (): Mocked<IGenerationRepository> => ({
    getAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  })

  let repo: Mocked<ISchedulesRepository>
  let favRepo: Mocked<ISchedulesFavoritesRepository>
  let genRepo: Mocked<IGenerationRepository>
  let service: FavoritesSchedulesService

  beforeEach(() => {
    repo = makeRepo()
    favRepo = makeFavoritesRepo()
    genRepo = makeGenerationRepo()
    service = new FavoritesSchedulesService(repo, favRepo, genRepo)
  })

  describe('getFavoriteSchedules', () => {
    it('returns schedules by favorite ids', async () => {
      const schedule = makeSchedule()
      favRepo.getIds.mockResolvedValue(['sched-1-1-1-1'])
      repo.getEntries.mockResolvedValue([schedule])
      const result = await service.getFavoriteSchedules()
      expect(result).toEqual([schedule])
    })
  })

  describe('addFavorite', () => {
    it('adds to favorites when schedule has id and not in list', async () => {
      const schedule = makeSchedule('s1')
      favRepo.findById.mockResolvedValue(undefined)
      favRepo.create.mockResolvedValue({ id: 's1' as UUID })
      const result = await service.addFavorite(schedule)
      expect(favRepo.create).toHaveBeenCalledWith('s1')
      expect(result).toEqual(schedule)
    })

    it('does not add to list when already in favorites', async () => {
      const schedule = makeSchedule('s1')
      favRepo.findById.mockResolvedValue({ id: 's1' as UUID })
      await service.addFavorite(schedule)
      expect(favRepo.create).not.toHaveBeenCalled()
    })

    it('uses existing schedule when events match (base schedule without id)', async () => {
      const existing = makeSchedule('existing-id')
      const baseSchedule = {
        scheduleSubjectKey: 'key-existing-id',
        events: [],
        schedulesSubject: [],
        crossings: 0,
      }
      repo.getByKey.mockResolvedValue(existing)
      favRepo.findById.mockResolvedValue(undefined)
      favRepo.create.mockResolvedValue({ id: 's1' as UUID })
      const result = await service.addFavorite(baseSchedule)
      expect(result).toEqual(existing)
    })

    it('creates new schedule when existing events do not match (base schedule without id)', async () => {
      const existing = {
        ...makeSchedule('old'),
        events: [
          {
            id: 'e-0-0-0-1' as UUID,
            title: 'e',
            day: 1 as Weekdays,
            color: '#000',
            startTime: '08:00',
            endTime: '09:00',
            type: 'MY_EVENT' as const,
            category: 'MY_EVENT' as const,
          },
        ],
      }
      const newSchedule = makeSchedule('new-id')
      const baseSchedule = {
        scheduleSubjectKey: 'key-old',
        events: [],
        schedulesSubject: [],
        crossings: 0,
      }
      repo.getByKey.mockResolvedValue(existing)
      repo.create.mockResolvedValue(newSchedule)
      favRepo.findById.mockResolvedValue(undefined)
      favRepo.create.mockResolvedValue({ id: 's1' as UUID })
      const result = await service.addFavorite(baseSchedule)
      expect(repo.create).toHaveBeenCalled()
      expect(result).toEqual(newSchedule)
    })

    it('creates new schedule when no existing schedule found (base schedule without id)', async () => {
      const newSchedule = makeSchedule('new-id')
      const baseSchedule = {
        scheduleSubjectKey: 'key-none',
        events: [],
        schedulesSubject: [],
        crossings: 0,
      }
      repo.getByKey.mockResolvedValue(undefined)
      repo.create.mockResolvedValue(newSchedule)
      favRepo.findById.mockResolvedValue(undefined)
      favRepo.create.mockResolvedValue({ id: 's1' as UUID })
      await service.addFavorite(baseSchedule)
      expect(repo.create).toHaveBeenCalled()
    })
  })

  describe('removeFavorite', () => {
    it('removes from list and deletes when not in any generation', async () => {
      favRepo.deleteById.mockResolvedValue(undefined)
      genRepo.getAll.mockResolvedValue([
        {
          id: 'g-0-0-0-1' as UUID,
          scheduleIds: ['o-0-0-0-1' as UUID],
          generatedAt: '',
          resultCount: 0,
          occurrences: [],
          crossingsSetting: 0,
          weekDays: [],
          hourlyLoadId: 0,
        },
      ])
      repo.deleteEntry.mockResolvedValue(undefined)
      await service.removeFavorite('s1' as UUID)
      expect(repo.deleteEntry).toHaveBeenCalledWith('s1')
    })

    it('does not delete when schedule is referenced in a generation', async () => {
      favRepo.deleteById.mockResolvedValue(undefined)
      genRepo.getAll.mockResolvedValue([
        {
          id: 'g-0-0-0-1' as UUID,
          scheduleIds: ['s1' as UUID],
          generatedAt: '',
          resultCount: 0,
          occurrences: [],
          crossingsSetting: 0,
          weekDays: [],
          hourlyLoadId: 0,
        },
      ])
      await service.removeFavorite('s1' as UUID)
      expect(repo.deleteEntry).not.toHaveBeenCalled()
    })
  })
})
