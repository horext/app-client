import type { IOrganizationResponse } from '../interfaces/organization'
import { BaseApi } from './base'

export interface ISpecialityApi {
  getAllByFaculty(facultyId: number): Promise<IOrganizationResponse[]>
}

const PATH_SUBJECTS = 'specialities'

export class SpecialityApi extends BaseApi {
  getAllByFaculty(facultyId: number) {
    return this.$fetch<IOrganizationResponse[]>(PATH_SUBJECTS, {
      params: {
        faculty: facultyId,
      },
    })
  }
}
