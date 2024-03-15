import type { IOrganization } from '~/interfaces/organization'
import { BaseRepository } from './BaseRepository'
const PATH_SUBJECTS = 'specialities'
export class SpecialityRepository extends BaseRepository {
  getAllByFaculty(facultyId: number) {
    return this.$fetch<IOrganization[]>(PATH_SUBJECTS, {
      params: {
        faculty: facultyId,
      },
    })
  }
}
