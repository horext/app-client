import type { Mocked } from 'vitest'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { type Db, type Collection, type FindCursor, ObjectId } from 'mongodb'
import type {
  ISchedule,
  IBaseSchedule,
  ScheduleCategory,
} from '../../interfaces/schedule.interface'
import { ScheduleRepository } from '../schedule.repository'

describe('ScheduleRepository', () => {
  let db: Mocked<Pick<Db, 'collection'>>
  let collection: Mocked<
    Pick<
      Collection<ISchedule>,
      'find' | 'insertOne' | 'deleteOne' | 'findOneAndUpdate'
    >
  >
  let repository: ScheduleRepository
  let mockFind: Mocked<Pick<FindCursor<ISchedule>, 'toArray'>>

  beforeEach(() => {
    mockFind = {
      toArray: vi.fn(),
    }
    collection = {
      find: vi.fn().mockImplementation(() => mockFind),
      insertOne: vi.fn(),
      deleteOne: vi.fn(),
      findOneAndUpdate: vi.fn().mockResolvedValue({ value: null }),
    }
    db = {
      collection: vi.fn().mockImplementation(() => collection),
    }
    repository = new ScheduleRepository(db)
  })

  it('should find all schedules', async () => {
    mockFind.toArray.mockResolvedValue([])
    const schedules = await repository.findAll('user123')
    expect(schedules).toEqual([])
  })

  it('should find schedules by category', async () => {
    const category: ScheduleCategory = 'GENERATED'
    mockFind.toArray.mockResolvedValue([])
    const schedules = await repository.findAllByCategory(category, 'user123')
    expect(schedules).toEqual([])
  })

  it('should create a schedule', async () => {
    const schedule: IBaseSchedule = {
      categories: ['GENERATED'],
      id: '',
      scheduleSubjectIds: [],
      schedule: [],
      crossings: 0,
      events: [],
    }
    const userId = 'user123'
    const createdSchedule = await repository.create(schedule, userId)
    expect(createdSchedule).toMatchObject({
      ...schedule,
      userId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should delete a schedule by id', async () => {
    const id = new ObjectId().toString()
    const userId = 'user123'
    collection.deleteOne.mockResolvedValue({
      deletedCount: 1,
      acknowledged: false,
    })
    const deleted = await repository.deleteById(id, userId)
    expect(deleted).toBe(true)
  })

  it('should return false if the schedule was not found', async () => {
    const id = new ObjectId().toString()
    const userId = 'user123'
    collection.deleteOne.mockResolvedValue({
      deletedCount: 0,
      acknowledged: false,
    })
    const deleted = await repository.deleteById(id, userId)
    expect(deleted).toBe(false)
  })

  it('should partially update a schedule by id', async () => {
    const id = new ObjectId().toString()
    const userId = 'user123'
    const partialSchedule: Partial<IBaseSchedule> = {
      categories: ['FAVORITE'],
    }
    const expectedSchedule = {
      _id: new ObjectId(),
      userId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: ['FAVORITE'] as ScheduleCategory[],
      id: '',
      scheduleSubjectIds: [],
      schedule: [],
      crossings: 0,
      events: [],
    }
    collection.findOneAndUpdate.mockResolvedValue(expectedSchedule)
    const updatedSchedule = await repository.partialUpdateById(
      id,
      partialSchedule,
      userId,
    )
    expect(updatedSchedule).toMatchObject({
      ...partialSchedule,
      updatedAt: expect.any(Date),
    })
  })
})
