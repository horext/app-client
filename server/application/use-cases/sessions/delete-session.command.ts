import type { UseCase } from '../shared/contracts'
import type { SessionStore } from './session.contracts'

export class DeleteSessionCommand implements UseCase<
  { sessionId: string },
  void
> {
  constructor(private readonly store: Pick<SessionStore, 'delete'>) {}

  execute({ sessionId }: { sessionId: string }) {
    return this.store.delete(sessionId)
  }
}
