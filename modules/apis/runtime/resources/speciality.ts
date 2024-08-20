import type { IOrganization } from '~/interfaces/organization'
import { BaseApi } from './base'

export interface ISpecialityApi {
  getAllByFaculty(facultyId: number): Promise<IOrganization[]>
}

const PATH_SUBJECTS = 'specialities'

export class SpecialityApi extends BaseApi {
  getAllByFaculty(facultyId: number) {
    return this.$fetch<IOrganization[]>(PATH_SUBJECTS, {
      params: {
        faculty: facultyId,
      },
    })
  }
}
