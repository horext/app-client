import type { IBaseProfile, IProfile } from '../interfaces/profile'
import type { IProfileCreate, IProfileUpdate } from './domain-helpers'
import type { UUID } from 'crypto'

export class Profile<T extends IBaseProfile | IProfile = IProfile> {
  private constructor(private readonly snapshot: T) {}

  static create(input: IProfileCreate): Profile<IBaseProfile> {
    return Profile.build(input)
  }

  private static build<T extends IBaseProfile | IProfile>(
    input: T,
  ): Profile<T> {
    return new Profile({
      ...input,
      setupCompleted: input.setupCompleted ?? false,
    })
  }

  static restore(snapshot: IProfile): Profile<IProfile> {
    return Profile.build(snapshot)
  }

  update(input: IProfileUpdate): Profile<IProfile> {
    if (!('id' in this.snapshot)) throw new Error('Entity is not persisted.')
    const snapshot: IProfile = {
      ...this.snapshot,
      ...input,
      id: this.snapshot.id,
    }
    return Profile.build(snapshot)
  }

  get id(): UUID {
    if (!('id' in this.snapshot)) throw new Error('Entity is not persisted.')
    return this.snapshot.id
  }

  toSnapshot() {
    return {
      ...this.snapshot,
    }
  }
}
