export interface IdempotencyPort {
  find(
    userId: string,
    operationId: string,
    now: string,
  ): Promise<object | undefined>
  store(
    userId: string,
    operationId: string,
    now: string,
    value: object,
  ): Promise<void>
}
