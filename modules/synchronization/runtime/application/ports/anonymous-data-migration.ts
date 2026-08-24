export interface AnonymousDataMigration {
  hasData(): Promise<boolean>
  stage(userId: string): Promise<void>
  cleanup(): Promise<void>
}
