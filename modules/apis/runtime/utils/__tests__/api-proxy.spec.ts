import { describe, expect, it } from 'vitest'
import { createApiProxyTarget } from '~~/server/utils/api-proxy'

describe('createApiProxyTarget', () => {
  it('forwards paths and query parameters to the configured API', () => {
    const target = createApiProxyTarget(
      'https://api.example.com/',
      new URL('https://app.example.com/api/hourlyLoads?faculty=31'),
    )

    expect(target).toBe('https://api.example.com/hourlyLoads?faculty=31')
  })

  it('rejects a missing API upstream', () => {
    expect(() =>
      createApiProxyTarget(
        '',
        new URL('https://app.example.com/api/faculties'),
      ),
    ).toThrow('API upstream URL is not configured')
  })
})
