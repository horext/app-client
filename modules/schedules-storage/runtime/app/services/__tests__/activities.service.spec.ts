import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { Activity } from '#shared/domain'
import { ActivitiesService } from '#shared/application/services/activities.service'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import { persistedSnapshot } from '../../../shared/__tests__/persisted-snapshot'

describe('ActivitiesService', () => {
  const makeRepo = (): Mocked<IActivitiesRepository> => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })
  const makeActivity = () =>
    Activity.restore(
      persistedSnapshot(
        Activity.create({
          title: 'Activity',
          color: '#fff',
          sessions: [{ day: 1, startTime: '08:00', endTime: '10:00' }],
        }).toSnapshot(),
      ),
    )
  let repo: Mocked<IActivitiesRepository>
  let service: ActivitiesService
  beforeEach(() => {
    repo = makeRepo()
    service = new ActivitiesService(repo)
  })
  describe('getAll', () => {
    it('returns all activities', async () => {
      repo.findAll.mockResolvedValue([makeActivity(), makeActivity()])
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
      expect(result.toSnapshot()).toMatchObject({ title: 'Activity' })
    })
  })
  describe('delete', () => {
    it('deletes an activity by id', async () => {
      const id = crypto.randomUUID()
      await service.delete('user-1', id)
      expect(repo.delete).toHaveBeenCalledWith('user-1', id, undefined)
    })
  })
  describe('patch', () => {
    it('updates activity when it exists', async () => {
      const existing = makeActivity()
      repo.findById.mockResolvedValue(existing)
      repo.update.mockImplementation(async (_, activity) => activity)
      const result = await service.patch('user-1', existing.id, {
        title: 'Updated',
        color: '#fff',
        sessions: existing.toSnapshot().sessions,
      })
      expect(result.toSnapshot().title).toBe('Updated')
    })
    it('throws when activity not found', async () => {
      repo.findById.mockResolvedValue(undefined)
      const id = crypto.randomUUID()
      await expect(
        service.patch('user-1', id, {
          title: 'x',
          color: '#000',
          sessions: [],
        }),
      ).rejects.toThrow('The activity does not exist.')
    })
  })
})
