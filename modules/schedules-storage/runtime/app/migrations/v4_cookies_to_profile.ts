import { StoresDB } from '../context/db'
import type { Migration, MigrationContext } from './types'
import { readCookieJson } from './utils'

interface IMyOrganization {
  id: number
  parentOrganizationUnit: {
    id: number
  }
  code: string
  name: string
  type: {
    id: number
    name: string
  }
}

async function up({ db }: MigrationContext) {
  const faculty = readCookieJson<IMyOrganization>('myFaculty')
  const speciality = readCookieJson<IMyOrganization>('mySpeciality')

  if (!faculty || !speciality) return

  await db.put(StoresDB.PROFILE, {
    id: 'profile',
    facultyId: faculty.id,
    specialityId: speciality.id,
    setupCompleted: true,
  })
}

export default { id: 'v4_cookies_to_profile', up } satisfies Migration
