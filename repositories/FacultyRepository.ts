import type { $Fetch } from 'nitropack'
import type { IOrganization } from '~/interfaces/organization'

const PATH_SUBJECTS = 'faculties'
export default ($axios: $Fetch) => ({
  getAll() {
    return $axios<IOrganization[]>(PATH_SUBJECTS)
  },
})
