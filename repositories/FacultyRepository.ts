import type { IOrganization } from '~/interfaces/organization'
import { BaseRepository } from './BaseRepository'

const PATH_SUBJECTS = 'faculties'
export class FacultyRepository extends BaseRepository {
  getAll() {
    return this.$fetch<IOrganization[]>(PATH_SUBJECTS)
  }
}
