const APP_CLIENT_ISSUES_URL = 'https://github.com/horext/app-client/issues/new'
const USER_BUG_REPORT_TEMPLATE = 'user-bug-report.yml'

export interface UserBugReportContext {
  path: string
  userAgent?: string
}

export function buildUserBugReportUrl(context: UserBugReportContext): string {
  const url = new URL(APP_CLIENT_ISSUES_URL)
  const environment = [`- Página: ${context.path}`]

  if (context.userAgent) {
    environment.push(`- Navegador: ${context.userAgent}`)
  }

  url.searchParams.set('template', USER_BUG_REPORT_TEMPLATE)
  url.searchParams.set('environment', environment.join('\n'))
  return url.toString()
}
