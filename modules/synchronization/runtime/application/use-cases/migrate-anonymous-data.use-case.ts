import type { AnonymousDataRepository } from '../ports/anonymous-data.repository'
import type { AnonymousDataMigration } from '../ports/anonymous-data-migration'

export class MigrateAnonymousDataUseCase implements AnonymousDataMigration {
  constructor(private readonly repository: AnonymousDataRepository) {}

  hasData(): Promise<boolean> {
    return this.repository.hasAnonymousData()
  }

  stage(userId: string): Promise<void> {
    return this.repository.stageForUser(userId)
  }

  cleanup(): Promise<void> {
    return this.repository.deleteAnonymousData()
  }
}
