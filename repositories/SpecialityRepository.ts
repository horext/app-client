import type { $Fetch } from 'nitropack'
import type { IOrganization } from '~/interfaces/organization'
const PATH_SUBJECTS = 'specialities'
export class SpecialityRepository {
  constructor(private $fetch: $Fetch) {}

  getAllByFaculty(facultyId: number) {
    return this.$fetch<IOrganization[]>(PATH_SUBJECTS, {
      params: {
        faculty: facultyId,
      },
    })
  }
}
