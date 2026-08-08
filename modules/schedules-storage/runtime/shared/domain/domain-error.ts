export type DomainErrorCode =
  | 'required-field'
  | 'invalid-time-range'
  | 'invalid-weekday'
  | 'invalid-limit'
  | 'invalid-reference'
  | 'entity-not-found'

export class DomainError extends Error {
  constructor(
    readonly code: DomainErrorCode,
    message: string,
    readonly field?: string,
  ) {
    super(message)
    this.name = 'DomainError'
  }
}
