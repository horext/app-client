import { describe, expect, it } from 'vitest'
import { useSynchronization } from '../cloud-sync'

describe('useSynchronization', () => {
  it('Given a client-provided synchronization facade, when useCloudSync is called, then it returns that facade', () => {
    expect(useSynchronization()).toBe(useNuxtApp().$synchronization)
    expect(useSynchronization().pullAndPush).toBeTypeOf('function')
  })
})
