import type { IOrganization } from '../../shared/interfaces/organization'
import type { Migration, MigrationContext } from './types'
import { readCookieJson } from './utils'

async function up({ db }: MigrationContext) {
  const faculty = readCookieJson<IOrganization>('myFaculty')
  const speciality = readCookieJson<IOrganization>('mySpeciality')

  if (!faculty || !speciality) return

  await db.put('profile', {
    id: 'profile',
    facultyId: faculty.id,
    specialityId: speciality.id,
    setupCompleted: true,
  })
}

export default { id: 'v4_cookies_to_profile', up } satisfies Migration
