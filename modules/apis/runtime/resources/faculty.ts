import type { IOrganizationResponse } from '../interfaces/organization'
import { BaseApi } from './base'

export interface IFacultyApi {
  getAll(): Promise<IOrganizationResponse[]>
}

export const PATH_FACULTIES = 'faculties'
export class FacultyApi extends BaseApi {
  getAll() {
    return this.$fetch<IOrganizationResponse[]>(PATH_FACULTIES)
  }
}
