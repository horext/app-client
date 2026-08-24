import type { Syncable } from '../context/db'

export function locallyUpdated<T extends object, P extends Syncable<T>>(
  snapshot: T,
  userId: string,
  localSequence: number,
  previous?: P,
): Syncable<T> {
  return {
    ...snapshot,
    createdBy: userId,
    updatedBy: userId,
    revision: previous?.revision,
    syncedAt: undefined,
    localSequence,
  }
}
