import { describe, expect, it, vi } from 'vitest'
import { StoresDB } from '../../../../../schedules-storage/runtime/app/context/db'
import type { SequenceTransaction } from '../persistent-sequence'
import { nextPersistentSequence } from '../persistent-sequence'

describe('nextPersistentSequence', () => {
  it('Given a stored sequence, when the next value is requested, then it increments and persists per user', async () => {
    const store = {
      get: vi
        .fn()
        .mockResolvedValue({ key: 'local-sequence:user-1', value: '4' }),
      put: vi.fn().mockResolvedValue('local-sequence:user-1'),
    }
    const transaction: SequenceTransaction = {
      objectStore: vi.fn().mockReturnValue(store),
    }
    await expect(nextPersistentSequence(transaction, 'user-1')).resolves.toBe(5)
    expect(transaction.objectStore).toHaveBeenCalledWith(StoresDB.SYNC_STATE)
    expect(store.put).toHaveBeenCalledWith({
      key: 'local-sequence:user-1',
      value: '5',
    })
  })
})
