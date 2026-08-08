import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { Favorite, Generation, Schedule } from '../../../shared/domain'
import { FavoritesSchedulesService } from '../favorites-schedules.service'
import type {
  ISchedulesRepository,
  ISchedulesFavoritesRepository,
} from '../../repositories/schedules-repository.interface'
import type { IGenerationRepository } from '../../repositories/generation.repository.interface'

const input = {
  scheduleSubjectKey: 'key',
  events: [],
  schedulesSubject: [],
  crossings: 0,
}
describe('FavoritesSchedulesService', () => {
  const makeRepo = (): Mocked<ISchedulesRepository> => ({
    findAll: vi.fn(),
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
    create: vi.fn(),
    delete: vi.fn(),
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
      const schedule = Schedule.create(input)
      favRepo.findAll.mockResolvedValue([
        Favorite.create({ scheduleId: schedule.id }),
      ])
      repo.getEntries.mockResolvedValue([schedule])
      expect(await service.getFavoriteSchedules('user-1')).toHaveLength(1)
    })
  })
  describe('addFavorite', () => {
    it('adds to favorites when schedule has id and not in list', async () => {
      const schedule = Schedule.create(input)
      favRepo.findById.mockResolvedValue(undefined)
      favRepo.create.mockResolvedValue(
        Favorite.create({ scheduleId: schedule.id }),
      )
      const result = await service.addFavorite('user-1', schedule.toSnapshot())
      expect(favRepo.create).toHaveBeenCalledWith(
        'user-1',
        expect.any(Favorite),
      )
      expect(result).toEqual(schedule.toSnapshot())
    })
    it('does not add to list when already in favorites', async () => {
      const schedule = Schedule.create(input)
      favRepo.findById.mockResolvedValue(
        Favorite.create({ scheduleId: schedule.id }),
      )
      await service.addFavorite('user-1', schedule.toSnapshot())
      expect(favRepo.create).not.toHaveBeenCalled()
    })
    it('uses existing schedule when events match (base schedule without id)', async () => {
      const schedule = Schedule.create(input)
      repo.getByKey.mockResolvedValue(schedule)
      favRepo.findById.mockResolvedValue(undefined)
      favRepo.create.mockResolvedValue(
        Favorite.create({ scheduleId: schedule.id }),
      )
      expect(await service.addFavorite('user-1', input)).toEqual(
        schedule.toSnapshot(),
      )
    })
    it('creates new schedule when no existing schedule found (base schedule without id)', async () => {
      const schedule = Schedule.create(input)
      repo.getByKey.mockResolvedValue(undefined)
      repo.create.mockResolvedValue(schedule)
      favRepo.findById.mockResolvedValue(undefined)
      favRepo.create.mockResolvedValue(
        Favorite.create({ scheduleId: schedule.id }),
      )
      await service.addFavorite('user-1', input)
      expect(repo.create).toHaveBeenCalledWith('user-1', expect.any(Schedule))
    })
  })
  describe('removeFavorite', () => {
    it('removes from list and deletes when not in any generation', async () => {
      const id = crypto.randomUUID()
      favRepo.delete.mockResolvedValue(undefined)
      genRepo.getAll.mockResolvedValue([])
      await service.removeFavorite('user-1', id)
      expect(repo.deleteEntry).toHaveBeenCalledWith('user-1', id)
    })
    it('does not delete when schedule is referenced in a generation', async () => {
      const id = crypto.randomUUID()
      favRepo.delete.mockResolvedValue(undefined)
      genRepo.getAll.mockResolvedValue([
        Generation.create({
          generatedAt: '',
          scheduleIds: [id],
          resultCount: 0,
          occurrences: [],
          crossingsSetting: 0,
          weekDays: [],
          hourlyLoadId: 0,
        }),
      ])
      await service.removeFavorite('user-1', id)
      expect(repo.deleteEntry).not.toHaveBeenCalled()
    })
  })
})
