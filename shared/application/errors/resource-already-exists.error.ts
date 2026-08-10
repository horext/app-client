import { ApplicationError } from './application.error'

export class ResourceAlreadyExistsError extends ApplicationError {
  constructor(readonly resource: string) {
    super('resource-already-exists', `El recurso ${resource} ya existe.`)
    this.name = 'ResourceAlreadyExistsError'
  }
}
