import { describe, expect, it } from 'vitest'
import plugin from '../provide.server'

describe('synchronization server provider', () => {
  it('Given schedules storage, when the server composition plugin runs, then raw repositories are exposed without client sync infrastructure', async () => {
    const nuxtApp = useNuxtApp()
    const result = await plugin(nuxtApp)
    expect(result?.provide?.applicationRepositories).toBe(
      nuxtApp.$schedulesStorage,
    )
  })
})
