import { StoresDB } from '../../../../schedules-storage/runtime/app/context/db'

type SyncStateStore = {
  get(key: string): Promise<{ key: string; value: string } | undefined>
  put(value: { key: string; value: string }): Promise<string>
}

export type SequenceTransaction = {
  objectStore(store: StoresDB.SYNC_STATE): SyncStateStore
}

/** Returns and persists the next per-user mutation sequence inside a caller transaction. */
export async function nextPersistentSequence(
  transaction: SequenceTransaction,
  userId: string,
): Promise<number> {
  const store = transaction.objectStore(StoresDB.SYNC_STATE)
  const key = `local-sequence:${userId}`
  const current = await store.get(key)
  const sequence = Number(current?.value ?? 0) + 1
  await store.put({ key, value: String(sequence) })
  return sequence
}
