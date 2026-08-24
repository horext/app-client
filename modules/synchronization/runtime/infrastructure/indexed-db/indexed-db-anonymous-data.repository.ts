import { StoresDB } from '~~/modules/schedules-storage/runtime/app/context/db'
import {
  collectionStores,
  replicableStores,
} from '~~/modules/schedules-storage/runtime/app/context/sync-resources'
import type {
  DbFactory,
  ReplicableStore,
  ReplicableStoreValue,
} from '../../../../schedules-storage/runtime/app/context/db'
import type { UUID } from 'crypto'
import type { AnonymousDataRepository } from '../../application/ports/anonymous-data.repository'

const ANONYMOUS_USER_ID = 'anonymous'
const collectionStoreSet = new Set<ReplicableStore>(collectionStores)

type AggregateId = UUID
type AggregateKey = [userId: string, id: AggregateId]
type IdReplacements = Map<ReplicableStore, Map<AggregateId, AggregateId>>

type LocalRecord = ReplicableStoreValue<ReplicableStore>

/** Stages signed-out records under a signed-in owner and cleans them on success. */
export class IndexedDbAnonymousDataRepository implements AnonymousDataRepository {
  constructor(private readonly dbFactory: DbFactory) {}

  async hasAnonymousData(): Promise<boolean> {
    const db = await this.dbFactory()
    for (const store of replicableStores) {
      const records = await db.getAllFromIndex(
        store,
        'createdBy',
        IDBKeyRange.only(ANONYMOUS_USER_ID),
      )
      if (records.length) return true
    }
    return false
  }

  async stageForUser(userId: string): Promise<void> {
    if (userId === ANONYMOUS_USER_ID) return
    const db = await this.dbFactory()
    const tx = db.transaction([...replicableStores], 'readwrite')
    const raw = tx
    const records = new Map<ReplicableStore, LocalRecord[]>()
    const replacements: IdReplacements = new Map()

    for (const storeName of replicableStores) {
      const store = raw.objectStore(storeName)
      const anonymous = await store
        .index('createdBy')
        .getAll(IDBKeyRange.only(ANONYMOUS_USER_ID))
      records.set(storeName, anonymous)
      for (const record of anonymous) {
        const collision = await store.get(aggregateKey(userId, record.id))
        if (collision && canRegenerateIdentity(storeName))
          replacementsFor(replacements, storeName).set(
            record.id,
            crypto.randomUUID(),
          )
      }
    }

    for (const storeName of replicableStores) {
      const store = raw.objectStore(storeName)
      for (const source of records.get(storeName) ?? []) {
        const collision = await store.get(aggregateKey(userId, source.id))
        if (collision && !canRegenerateIdentity(storeName)) continue
        const migrated = migrateRecord(storeName, source, replacements)
        await store.put({
          ...migrated,
          createdBy: userId,
          updatedBy: userId,
          revision: undefined,
          syncedAt: undefined,
          localSequence: 0,
        })
      }
    }
    await raw.done
  }

  async deleteAnonymousData(): Promise<void> {
    const db = await this.dbFactory()
    const tx = db.transaction(
      [...replicableStores, StoresDB.OUTBOX, StoresDB.CONFLICTS],
      'readwrite',
    )
    const raw = tx
    for (const storeName of replicableStores) {
      const store = raw.objectStore(storeName)
      const records = await store
        .index('createdBy')
        .getAll(IDBKeyRange.only(ANONYMOUS_USER_ID))
      for (const record of records)
        await store.delete(aggregateKey(ANONYMOUS_USER_ID, record.id))
    }
    const outbox = raw.objectStore(StoresDB.OUTBOX)
    for (const operation of await outbox.getAll())
      if (operation.userId === ANONYMOUS_USER_ID)
        await outbox.delete(operation.key)

    const conflicts = raw.objectStore(StoresDB.CONFLICTS)
    for (const conflict of await conflicts.getAll())
      if (conflict.operation.userId === ANONYMOUS_USER_ID)
        await conflicts.delete(conflict.key)
    await raw.done
  }
}

function aggregateKey(userId: string, id: AggregateId): AggregateKey {
  return [userId, id]
}

function canRegenerateIdentity(store: ReplicableStore): boolean {
  return collectionStoreSet.has(store) && store !== StoresDB.FAVORITES
}

function replacementsFor(
  replacements: IdReplacements,
  store: ReplicableStore,
): Map<AggregateId, AggregateId> {
  const existing = replacements.get(store)
  if (existing) return existing
  const created = new Map<AggregateId, AggregateId>()
  replacements.set(store, created)
  return created
}

function replacementFor(
  replacements: IdReplacements,
  store: ReplicableStore,
  id: AggregateId,
): AggregateId {
  return replacements.get(store)?.get(id) ?? id
}

function migrateRecord(
  store: ReplicableStore,
  source: LocalRecord,
  replacements: IdReplacements,
): LocalRecord {
  const id = replacementFor(replacements, store, source.id) as never

  if (store === StoresDB.GENERATIONS && 'scheduleIds' in source) {
    return {
      ...source,
      id,
      scheduleIds: source.scheduleIds.map(
        (scheduleId) =>
          replacementFor(replacements, StoresDB.SCHEDULES, scheduleId) as never,
      ),
    }
  }

  if (store === StoresDB.FAVORITES) {
    return {
      ...source,
      id: replacementFor(replacements, StoresDB.SCHEDULES, source.id) as never,
    }
  }

  return { ...source, id }
}
