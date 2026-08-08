import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { Activity } from '../../../shared/domain'
import { ActivitiesService } from '../activities.service'
import type { IActivitiesRepository } from '../../repositories/activities.repository.interface'

describe('ActivitiesService', () => {
  const makeRepo = (): Mocked<IActivitiesRepository> => ({
    getAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })
  const makeActivity = () =>
    Activity.create({
      title: 'Activity',
      color: '#fff',
      sessions: [{ day: 1, startTime: '08:00', endTime: '10:00' }],
    })
  let repo: Mocked<IActivitiesRepository>
  let service: ActivitiesService
  beforeEach(() => {
    repo = makeRepo()
    service = new ActivitiesService(repo)
  })
  describe('getAll', () => {
    it('returns all activities', async () => {
      repo.getAll.mockResolvedValue([makeActivity(), makeActivity()])
      expect(await service.getAll('user-1')).toHaveLength(2)
    })
  })
  describe('create', () => {
    it('creates an activity', async () => {
      const activity = makeActivity()
      repo.create.mockResolvedValue(activity)
      const result = await service.create('user-1', {
        title: 'Activity',
        color: '#fff',
        sessions: [],
      })
      expect(result).toMatchObject({ category: 'MY_EVENT', type: 'MY_EVENT' })
    })
  })
  describe('delete', () => {
    it('deletes an activity by id', async () => {
      const id = crypto.randomUUID()
      await service.delete('user-1', id)
      expect(repo.delete).toHaveBeenCalledWith('user-1', id)
    })
  })
  describe('updateById', () => {
    it('updates activity when it exists', async () => {
      const existing = makeActivity()
      repo.get.mockResolvedValue(existing)
      repo.update.mockImplementation(async (_, activity) => activity)
      const result = await service.updateById('user-1', existing.id, {
        title: 'Updated',
        color: '#fff',
        sessions: existing.toSnapshot().sessions,
      })
      expect(result.title).toBe('Updated')
    })
    it('throws when activity not found', async () => {
      repo.get.mockResolvedValue(undefined)
      const id = crypto.randomUUID()
      await expect(
        service.updateById('user-1', id, {
          title: 'x',
          color: '#000',
          sessions: [],
        }),
      ).rejects.toThrow(`Activity with id ${id} not found`)
    })
  })
})
