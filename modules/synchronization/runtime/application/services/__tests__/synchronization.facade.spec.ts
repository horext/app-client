import { describe, expect, it, vi } from 'vitest'
import type {
  RemoteCloudRecord,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import type { CloudChangeApplier } from '../../ports/cloud-change-applier'
import type { RemoteChange } from '../../../domain/models/remote-change'
import { SynchronizationFacade } from '../synchronization.facade'

class InitialFake implements CloudChangeApplier {
  constructor(hasLocalData: boolean) {
    this.hasLocalData.mockResolvedValue(hasLocalData)
  }
  readonly hasLocalData = vi.fn()
  readonly run = vi.fn()
  readonly applyCloudRecord = vi.fn()
  async apply<R extends SyncResource>(
    _userId: string,
    _resource: R,
    _change: RemoteChange<R>,
  ) {}
}

function dependencies(hasLocalData = false) {
  const service = {
    conflicts: vi.fn().mockResolvedValue([]),
    pull: vi.fn().mockResolvedValue(0),
    push: vi.fn().mockResolvedValue({ pushed: 0, conflicts: 0 }),
    resolve: vi.fn().mockResolvedValue(undefined),
  }
  const initial = new InitialFake(hasLocalData)
  return {
    facade: new SynchronizationFacade(service, initial),
    initial,
    service,
  }
}

describe('SynchronizationFacade', () => {
  it('Given empty local storage, when synchronization starts, then it pulls before pushing', async () => {
    const { facade, initial, service } = dependencies()

    await facade.start('user-1')

    expect(service.pull).toHaveBeenCalledWith('user-1', initial)
    expect(service.push).toHaveBeenCalledWith('user-1')
    expect(service.pull.mock.invocationCallOrder[0] ?? Infinity).toBeLessThan(
      service.push.mock.invocationCallOrder[0] ?? -Infinity,
    )
  })

  it('Given existing local data, when synchronization starts, then it requests an initialization strategy', async () => {
    const { facade, service } = dependencies(true)

    await facade.start('user-1')

    expect(service.pull).not.toHaveBeenCalled()
    expect(service.push).not.toHaveBeenCalled()
  })

  it('Given an explicit merge strategy, when initialization runs, then it delegates the strategy to the coordinator', async () => {
    const { facade, initial } = dependencies(true)

    await facade.initialize('user-1', 'merge')

    expect(initial.run).toHaveBeenCalledWith('user-1', 'merge')
  })

  it('Given a cloud change applier, when pull and push run, then both operations use that applier', async () => {
    const { facade, service } = dependencies()
    const handler: CloudChangeApplier = {
      apply: async <R extends SyncResource>(
        _userId: string,
        _resource: R,
        _change: RemoteChange<R>,
      ) => {},
      applyCloudRecord: async (
        _userId: string,
        _record: RemoteCloudRecord,
        _revision: number,
      ) => {},
    }

    await facade.pullAndPush('user-1', handler)

    expect(service.pull).toHaveBeenCalledWith('user-1', handler)
    expect(service.push).toHaveBeenCalledWith('user-1')
  })
})
