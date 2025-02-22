import type { Mocked } from 'vitest'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ObjectId } from 'mongodb'
import { ActivityRepository } from '../activity.repository'
import type { Collection, Db, FindCursor } from 'mongodb'
import { Weekday } from '~/server/constants/weekday.constant'
import type {
  IActivity,
  IBaseActivity,
} from '~/server/interfaces/activity.interface'

describe('ActivityRepository', () => {
  let mockCollection: Mocked<
    Pick<
      Collection<IActivity>,
      'find' | 'insertOne' | 'deleteOne' | 'findOneAndUpdate'
    >
  >
  let mockDb: Partial<Db>
  let repository: ActivityRepository
  let mockFind: Mocked<Pick<FindCursor<IActivity>, 'toArray'>>

  beforeEach(() => {
    mockFind = {
      toArray: vi.fn(),
    }
    mockCollection = {
      find: vi.fn().mockImplementation(() => mockFind),
      insertOne: vi.fn(),
      deleteOne: vi.fn(),
      findOneAndUpdate: vi.fn().mockResolvedValue({ value: null }),
    }
    mockDb = {
      collection: vi.fn().mockImplementation(() => mockCollection),
    }
    repository = new ActivityRepository(mockDb as Db)
  })

  it('should return all activities for a user', async () => {
    const userId = 'user1'
    const activities = [
      {
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: 'Activity 1',
        day: Weekday.Monday,
        color: '#000',
        startTime: '00:00',
        endTime: '01:00',
        _id: new ObjectId(),
      },
    ]
    mockFind.toArray.mockResolvedValue(activities)

    const result = await repository.findAll(userId)

    expect(mockCollection.find).toHaveBeenCalledWith({ userId })
    expect(result).toEqual(activities)
  })

  it('should create a new activity', async () => {
    const userId = 'user1'
    const activity: IBaseActivity = {
      title: '',
      day: 0,
      color: '',
      startTime: '',
      endTime: '',
    }
    const createdActivity = {
      ...activity,
      userId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    }

    await repository.create(activity, userId)

    expect(mockCollection.insertOne).toHaveBeenCalledWith(createdActivity)
  })

  it('should delete an activity by id', async () => {
    const userId = 'user1'
    const id = new ObjectId().toString()
    mockCollection.deleteOne.mockResolvedValueOnce({
      deletedCount: 1,
      acknowledged: false,
    })

    const result = await repository.deleteById(id, userId)

    expect(mockCollection.deleteOne).toHaveBeenCalledWith({
      _id: new ObjectId(id),
      userId,
    })
    expect(result).toBe(true)
  })

  it('should return false if no activity was deleted', async () => {
    const userId = 'user1'
    const id = new ObjectId().toString()
    mockCollection.deleteOne.mockResolvedValueOnce({
      deletedCount: 0,
      acknowledged: false,
    })

    const result = await repository.deleteById(id, userId)

    expect(mockCollection.deleteOne).toHaveBeenCalledWith({
      _id: new ObjectId(id),
      userId,
    })
    expect(result).toBe(false)
  })

  it('should update an activity by id', async () => {
    const userId = 'user1'
    const activityId = new ObjectId().toString()
    const body: IBaseActivity = {
      title: '',
      day: 0,
      color: '',
      startTime: '',
      endTime: '',
    }
    const updatedActivity = {
      ...body,
      updatedAt: expect.any(Date),
    }
    const mockUpdatedActivity = {
      createdAt: new Date(),
      ...updatedActivity,
      _id: new ObjectId(activityId),
      userId,
    }

    mockCollection.findOneAndUpdate.mockResolvedValueOnce(mockUpdatedActivity)

    const result = await repository.updateById(activityId, body, userId)

    expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: new ObjectId(activityId),
        userId,
      },
      { $set: updatedActivity },
      { returnDocument: 'after' },
    )
    expect(result).toEqual(mockUpdatedActivity)
  })
})
