import { ApplicationError } from './application.error'

export class MissingMetadataError extends ApplicationError {
  constructor(readonly resource: string) {
    super(
      'missing-persistence-metadata',
      `The persisted ${resource} metadata is missing.`,
    )
    this.name = 'MissingMetadataError'
  }
}
