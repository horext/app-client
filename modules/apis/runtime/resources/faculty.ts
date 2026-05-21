import type { IOrganizationResponse } from '../interfaces/organization'
import { BaseApi } from './base'

export interface IFacultyApi {
  getAll(): Promise<IOrganizationResponse[]>
}

const PATH_SUBJECTS = 'faculties'
export class FacultyApi extends BaseApi {
  getAll() {
    return this.$fetch<IOrganizationResponse[]>(PATH_SUBJECTS)
  }
}
