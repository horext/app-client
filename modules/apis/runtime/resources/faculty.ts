import type { IOrganization } from '~/interfaces/organization'
import { BaseApi } from './base'

export interface IFacultyApi {
  getAll(): Promise<IOrganization[]>
}

const PATH_SUBJECTS = 'faculties'
export class FacultyApi extends BaseApi {
  getAll() {
    return this.$fetch<IOrganization[]>(PATH_SUBJECTS)
  }
}
