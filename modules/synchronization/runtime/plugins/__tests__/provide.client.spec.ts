import { describe, expect, it } from 'vitest'
import plugin from '../provide.client'

describe('synchronization client provider', () => {
  it('Given schedules storage, when the client composition plugin runs, then synchronized repositories and the facade are provided', async () => {
    const result = await plugin(useNuxtApp())
    expect(
      result?.provide?.applicationRepositories.activitiesRepository,
    ).toBeDefined()
    expect(result?.provide?.synchronization.pullAndPush).toBeTypeOf('function')
  })
})
