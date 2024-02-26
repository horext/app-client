import type { $Fetch } from 'nitropack'
import type { IOrganization } from '~/interfaces/organization'

const PATH_SUBJECTS = 'faculties'
export class FacultyRepository {
  constructor(private $fetch: $Fetch) {}

  getAll() {
    return this.$fetch<IOrganization[]>(PATH_SUBJECTS)
  }
}
