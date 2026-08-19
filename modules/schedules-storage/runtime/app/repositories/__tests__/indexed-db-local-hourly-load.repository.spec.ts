import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IndexedDBLocalHourlyLoadRepository } from '../indexed-db-local-hourly-load.repository'
import type { ILocalHourlyLoadDataset } from '#shared/domain/types/local-hourly-load'
import { makeUUID } from '#shared/domain/types/ids'

describe('IndexedDBLocalHourlyLoadRepository', () => {
  const get = vi.fn()
  const put = vi.fn()
  const remove = vi.fn()
  const database = vi.fn().mockResolvedValue({ get, put, delete: remove })
  const repository = new IndexedDBLocalHourlyLoadRepository(database)
  const dataset = {
    id: makeUUID(),
    name: 'Carga personal',
    importedAt: '2026-08-18T00:00:00.000Z',
    sourceFileName: 'carga.xlsx',
    subjects: [],
    schedulesBySubject: {},
    sessionCount: 0,
    rejectedRowCount: 0,
    warnings: [],
  } as ILocalHourlyLoadDataset

  beforeEach(() => {
    get.mockReset()
    put.mockReset()
    remove.mockReset()
  })

  it('stores and reads the active dataset by user', async () => {
    get.mockResolvedValue({ userId: 'user-1', dataset })

    await repository.save('user-1', dataset)
    await expect(repository.get('user-1')).resolves.toEqual(dataset)

    expect(put).toHaveBeenCalledWith('local-hourly-load', {
      userId: 'user-1',
      dataset,
    })
  })

  it('removes only the requested user dataset', async () => {
    await repository.remove('user-1')
    expect(remove).toHaveBeenCalledWith('local-hourly-load', 'user-1')
  })
})
