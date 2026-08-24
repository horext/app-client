/** The only identity translation used by cloud persistence. */
export type DomainIdentity = { id: string }
export type CloudIdentityRow = { id: string; localId: string }

/** Replace the database-only canonical id with the public/domain id. */
export function toDomain<T extends DomainIdentity>(
  row: CloudIdentityRow,
  payload: T,
): T {
  return { ...payload, id: row.localId }
}

/** Store a domain id as local_id; canonical id is always database-generated. */
export function toDatabase<T extends DomainIdentity>(domain: T) {
  return { localId: domain.id }
}
