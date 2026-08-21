import { describe, expect, it } from 'vitest'
import { buildUserBugReportUrl } from '../user-bug-report'

describe('buildUserBugReportUrl', () => {
  it('opens the user form with non-sensitive application context', () => {
    const result = new URL(
      buildUserBugReportUrl({
        path: '/generator/subjects',
        userAgent: 'Test Browser',
      }),
    )

    expect(result.origin + result.pathname).toBe(
      'https://github.com/horext/app-client/issues/new',
    )
    expect(result.searchParams.get('template')).toBe('user-bug-report.yml')
    expect(result.searchParams.get('environment')).toBe(
      '- Página: /generator/subjects\n- Navegador: Test Browser',
    )
  })

  it('omits browser information during server rendering', () => {
    const result = new URL(buildUserBugReportUrl({ path: '/generator' }))

    expect(result.searchParams.get('environment')).toBe('- Página: /generator')
  })
})
