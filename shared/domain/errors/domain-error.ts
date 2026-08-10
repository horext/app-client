export type DomainErrorCode =
  | 'invalid-time-range'
  | 'invalid-weekday'
  | 'invalid-limit'
  | 'invalid-reference'
  | 'invalid-title'
  | 'invalid-color'
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
