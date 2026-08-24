import { describe, expect, it } from 'vitest'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { UnsupportedResourceOperationError } from '../unsupported-resource-operation.error'

describe('UnsupportedResourceOperationError', () => {
  it('Given an unsupported operation, when the error is created, then it identifies the operation and resource', () => {
    const error = new UnsupportedResourceOperationError(
      SyncResource.PROFILE,
      'delete',
    )
    expect(error).toMatchObject({ name: 'UnsupportedResourceOperationError' })
    expect(error.message).toContain('delete is not supported')
  })
})
