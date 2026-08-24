import { syncMutationHeaders } from './csrf-headers'

export function revisionHeaders(revision?: number): Record<string, string> {
  return syncMutationHeaders(
    revision === undefined ? {} : { 'if-match': `"${revision}"` },
  )
}
