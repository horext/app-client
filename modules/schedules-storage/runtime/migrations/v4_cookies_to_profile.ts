import type { IOrganization } from '~/interfaces/organization'
import type { Migration, MigrationContext } from './types'

function readCookieJson<T>(name: string): T | null {
  try {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
    if (!match) return null
    return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('='))) as T
  } catch {
    return null
  }
}

async function up({ db }: MigrationContext) {
  const faculty = readCookieJson<IOrganization>('myFaculty')
  const speciality = readCookieJson<IOrganization>('mySpeciality')

  await db.put('profile', {
    id: 'profile',
    faculty: faculty ?? null,
    speciality: speciality ?? null,
    setupCompleted: faculty !== null && speciality !== null,
  })
}

export default { id: 'v4_cookies_to_profile', up } satisfies Migration
