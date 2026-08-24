export interface AnonymousDataRepository {
  hasAnonymousData(): Promise<boolean>
  stageForUser(userId: string): Promise<void>
  deleteAnonymousData(): Promise<void>
}
