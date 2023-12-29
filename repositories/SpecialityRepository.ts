import type { $Fetch } from 'nitropack'
import type{ IOrganization } from '~/interfaces/organization'
const PATH_SUBJECTS = 'specialities'
export default ($axios: $Fetch) => ({
  getAllByFaculty(facultyId: any) {
    return $axios<IOrganization[]>(PATH_SUBJECTS, {
      params: {
        faculty: facultyId,
      },
    })
  },
})
