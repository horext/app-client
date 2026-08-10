import { ApplicationError } from './application.error'

export class ResourceAlreadyExistsError extends ApplicationError {
  constructor(readonly resource: string) {
    super('resource-already-exists', `The ${resource} already exists.`)
    this.name = 'ResourceAlreadyExistsError'
  }
}
