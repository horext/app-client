import type { Mocked } from 'vitest'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Db, Collection, FindCursor, WithId } from 'mongodb'
import { ObjectId } from 'mongodb'
import type { ISubject } from '../subject.repository'
import { SubjectRepository } from '../subject.repository'
import type { ISubject as IBaseSubject } from '~/interfaces/subject'

describe('SubjectRepository', () => {
  let db: Mocked<Pick<Db, 'collection'>>
  let collection: Mocked<
    Pick<Collection<ISubject>, 'find' | 'insertOne' | 'deleteOne'>
  >
  let subjectRepository: SubjectRepository
  let mockFind: Mocked<Pick<FindCursor<ISubject>, 'toArray'>>

  beforeEach(() => {
    mockFind = {
      toArray: vi.fn(),
    }
    collection = {
      find: vi.fn().mockImplementation(() => mockFind),
      insertOne: vi.fn(),
      deleteOne: vi.fn(),
    }
    db = {
      collection: vi.fn().mockImplementation(() => collection),
    }
    subjectRepository = new SubjectRepository(db)
  })

  it('should return all subjects for a user', async () => {
    const userId = 'user123'
    const subjects = [
      {
        _id: new ObjectId(),
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        course: {
          id: '',
          name: '',
        },
        credits: 0,
        cycle: 0,
        id: 1,
        studyPlan: {
          id: 0,
          fromDate: '',
          code: '',
          organizationUnit: {
            id: 0,
          },
        },
        type: {
          id: 0,
          name: '',
          code: '',
        },
      },
      {
        _id: new ObjectId(),
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        course: {
          id: '',
          name: '',
        },
        credits: 0,
        cycle: 0,
        id: 1,
        studyPlan: {
          id: 0,
          fromDate: '',
          code: '',
          organizationUnit: {
            id: 0,
          },
        },
        type: {
          id: 0,
          name: '',
          code: '',
        },
      },
    ] satisfies WithId<ISubject>[]
    mockFind.toArray.mockResolvedValue(subjects)

    const result = await subjectRepository.findAll(userId)

    expect(result).toEqual(subjects)
    expect(collection.find).toHaveBeenCalledWith({ userId })
  })

  it('should create a new subject', async () => {
    const userId = 'user123'
    const subject: IBaseSubject = {
      id: 0,
      course: {
        id: '',
        name: '',
      },
      type: {
        id: 0,
        name: '',
        code: '',
      },
      studyPlan: {
        id: 0,
        fromDate: '',
        code: '',
        organizationUnit: {
          id: 0,
        },
      },
      credits: 0,
      cycle: null,
    }
    const createdSubject: ISubject = {
      ...subject,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    collection.insertOne.mockResolvedValue({
      insertedId: new ObjectId(),
      acknowledged: false,
    })

    const result = await subjectRepository.create(subject, userId)

    expect(result).toEqual(createdSubject)
    expect(collection.insertOne).toHaveBeenCalledWith(createdSubject)
  })

  it('should return true if the subject was deleted', async () => {
    const userId = 'user123'
    const id = new ObjectId().toString()
    collection.deleteOne.mockResolvedValue({
      deletedCount: 1,
      acknowledged: false,
    })

    const deleted = await subjectRepository.deleteById(id, userId)

    expect(collection.deleteOne).toHaveBeenCalledWith({
      _id: new ObjectId(id),
      userId,
    })

    expect(deleted).toBe(true)
  })

  it('should return false if the subject was not found', async () => {
    const userId = 'user123'
    const id = new ObjectId().toString()
    collection.deleteOne.mockResolvedValue({
      deletedCount: 0,
      acknowledged: false,
    })

    const deleted = await subjectRepository.deleteById(id, userId)

    expect(collection.deleteOne).toHaveBeenCalledWith({
      _id: new ObjectId(id),
      userId,
    })

    expect(deleted).toBe(false)
  })
})
