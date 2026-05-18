import type { IOrganization } from '~/interfaces/organization'
import type { Migration, MigrationContext } from './types'
import { readCookieJson } from './utils'

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
