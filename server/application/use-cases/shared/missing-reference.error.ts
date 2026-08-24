import { ApplicationError } from './application.error'

export class MissingReferenceError extends ApplicationError {
  constructor(
    readonly resource: string,
    message?: string,
  ) {
    super(
      'missing-reference',
      message ?? `The referenced ${resource} does not exist.`,
    )
    this.name = 'MissingReferenceError'
  }
}
