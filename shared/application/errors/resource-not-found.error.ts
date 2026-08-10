import { ApplicationError } from './application.error'

export class ResourceNotFoundError extends ApplicationError {
  constructor(readonly resource: string) {
    super('resource-not-found', `The ${resource} does not exist.`)
    this.name = 'ResourceNotFoundError'
  }
}
