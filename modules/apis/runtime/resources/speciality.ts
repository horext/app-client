import type { IOrganizationResponse } from '../interfaces/organization'
import { BaseApi } from './base'

export interface ISpecialityApi {
  getById(specialityId: number): Promise<IOrganizationResponse>
  getAllByFaculty(facultyId: number): Promise<IOrganizationResponse[]>
}

export const PATH_SPECIALITIES = 'specialities'

export class SpecialityApi extends BaseApi implements ISpecialityApi {
  getById(specialityId: number): Promise<IOrganizationResponse> {
    return this.$fetch<IOrganizationResponse>(
      `${PATH_SPECIALITIES}/${specialityId}`,
    )
  }

  getAllByFaculty(facultyId: number) {
    return this.$fetch<IOrganizationResponse[]>(PATH_SPECIALITIES, {
      params: {
        faculty: facultyId,
      },
    })
  }
}
