import type { IOrganizationResponse } from '../interfaces/organization'
import { BaseApi } from './base'

export interface ISpecialityApi {
  getById(specialityId: number): Promise<IOrganizationResponse>
  getAllByFaculty(facultyId: number): Promise<IOrganizationResponse[]>
}

const PATH_SUBJECTS = 'specialities'

export class SpecialityApi extends BaseApi implements ISpecialityApi {
  getById(specialityId: number): Promise<IOrganizationResponse> {
    return this.$fetch<IOrganizationResponse>(
      `${PATH_SUBJECTS}/${specialityId}`,
    )
  }

  getAllByFaculty(facultyId: number) {
    return this.$fetch<IOrganizationResponse[]>(PATH_SUBJECTS, {
      params: {
        faculty: facultyId,
      },
    })
  }
}
