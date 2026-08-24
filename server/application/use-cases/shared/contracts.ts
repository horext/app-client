export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>
}

export interface RecordResult<T extends object = object> {
  id: string
  data: T
  revision: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface RepresentationResult<T extends object = object> {
  record: RecordResult<T>
  revision: number
  status: number
  location?: string
  replayed?: boolean
}

export interface Clock {
  now(): Date
}

export const systemClock: Clock = { now: () => new Date() }
