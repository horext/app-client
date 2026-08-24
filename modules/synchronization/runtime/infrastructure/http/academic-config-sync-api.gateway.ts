import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { IndividualSyncGateway } from './individual-sync-api.gateway'

export class AcademicConfigSyncApiGateway extends IndividualSyncGateway<SyncResource.ACADEMIC_CONFIG> {
  protected readonly path = '/api/v1/academic-config'
}
