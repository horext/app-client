import { describe, expect, it } from 'vitest'
import { toDatabase, toDomain } from '../cloud-identity'

describe('cloud identity mapping', () => {
  it('exposes local ids and never canonical ids', () => {
    const domain = toDomain(
      { id: 'canonical-uuid', localId: 'frontend-id' },
      { id: 'payload-id', title: 'example' },
    )
    expect(domain).toEqual({ id: 'frontend-id', title: 'example' })
    expect(JSON.stringify(domain)).not.toContain('canonical-uuid')
  })

  it('writes only local_id and lets the database generate id', () => {
    expect(toDatabase({ id: 'frontend-id', title: 'example' })).toEqual({
      localId: 'frontend-id',
    })
  })
})
