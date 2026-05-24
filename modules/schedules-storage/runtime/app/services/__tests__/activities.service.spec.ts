import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import type { UUID } from 'crypto'
import type { Weekdays } from '../../../shared/interfaces/event'
import { ActivitiesService } from '../activities.service'
import type { IActivitiesRepository } from '../../repositories/activities.repository.interface'

describe('ActivitiesService', () => {
  const makeRepo = (): Mocked<IActivitiesRepository> => ({
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    update: vi.fn(),
  })

  const makeActivity = (id = 'act-0-0-0-1' as UUID) => ({
    id,
    title: `Activity ${id}`,
    color: '#fff',
    day: 1 as Weekdays,
    startTime: '08:00',
    endTime: '10:00',
    type: 'MY_EVENT' as const,
    category: 'MY_EVENT' as const,
  })

  let repo: Mocked<IActivitiesRepository>
  let service: ActivitiesService

  beforeEach(() => {
    repo = makeRepo()
    service = new ActivitiesService(repo)
  })

  describe('getAll', () => {
    it('returns all activities', async () => {
      repo.getAll.mockResolvedValue([
        makeActivity(),
        makeActivity('act-0-0-0-2' as UUID),
      ])
      const result = await service.getAll()
      expect(result).toHaveLength(2)
    })
  })

  describe('create', () => {
    it('creates an activity', async () => {
      const activity = makeActivity()
      repo.create.mockResolvedValue(activity)
      const { id: _, ...base } = activity
      const result = await service.create(base)
      expect(result).toEqual(activity)
    })
  })

  describe('delete', () => {
    it('deletes an activity by id', async () => {
      repo.delete.mockResolvedValue(undefined)
      await service.delete('act-0-0-0-1' as UUID)
      expect(repo.delete).toHaveBeenCalledWith('act-0-0-0-1')
    })
  })

  describe('updateById', () => {
    it('updates activity when it exists', async () => {
      const existing = makeActivity()
      const updated = { ...existing, title: 'Updated' }
      repo.get.mockResolvedValue(existing)
      repo.update.mockResolvedValue(updated)
      const { id: _, ...base } = existing
      const result = await service.updateById('act-0-0-0-1' as UUID, {
        ...base,
        title: 'Updated',
      })
      expect(result.title).toBe('Updated')
    })

    it('throws when activity not found', async () => {
      repo.get.mockResolvedValue(undefined)
      await expect(
        service.updateById('act-0-0-0-99' as UUID, {
          title: 'x',
          color: '#000',
          day: 1 as Weekdays,
          startTime: '08:00',
          endTime: '09:00',
        }),
      ).rejects.toThrow('Activity with id act-0-0-0-99 not found')
    })
  })
})
