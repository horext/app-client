import { describe, expect, it, vi } from 'vitest'
import { MigrateAnonymousDataUseCase } from '../migrate-anonymous-data.use-case'

describe('MigrateAnonymousDataUseCase', () => {
  it('Given anonymous local data, when migration runs, then the repository stages, persists, and cleans it in order', async () => {
    const repository = {
      hasAnonymousData: vi.fn().mockResolvedValue(true),
      stageForUser: vi.fn().mockResolvedValue(undefined),
      deleteAnonymousData: vi.fn().mockResolvedValue(undefined),
    }
    const migration = new MigrateAnonymousDataUseCase(repository)

    await expect(migration.hasData()).resolves.toBe(true)
    await migration.stage('user-1')
    await migration.cleanup()

    expect(repository.stageForUser).toHaveBeenCalledWith('user-1')
    expect(repository.deleteAnonymousData).toHaveBeenCalledOnce()
  })
})
