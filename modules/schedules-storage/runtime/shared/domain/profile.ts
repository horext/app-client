import type { IBaseProfile, IProfile } from '../interfaces/profile'
import type { IProfileCreate, IProfileUpdate } from './domain-helpers'
import { DomainError } from './domain-error'
import type { UUID } from 'crypto'

export class Profile<T extends IBaseProfile | IProfile = IProfile> {
  private constructor(private readonly snapshot: T) {}

  static create(input: IProfileCreate): Profile<IBaseProfile> {
    return Profile.build(input)
  }

  private static build(input: IProfileCreate): Profile<IBaseProfile> {
    if (
      !Number.isFinite(input.facultyId) ||
      !Number.isFinite(input.specialityId)
    )
      throw new DomainError(
        'invalid-reference',
        'Profile references are invalid.',
      )
    return new Profile({
      ...input,
      setupCompleted: input.setupCompleted ?? false,
    })
  }

  static restore(snapshot: IProfile): Profile<IProfile> {
    return new Profile({ ...snapshot })
  }

  update(input: IProfileUpdate): Profile<IProfile> {
    if (!('id' in this.snapshot)) throw new Error('Entity is not persisted.')
    const snapshot: IProfile = {
      ...this.snapshot,
      ...input,
      id: this.snapshot.id,
    }
    return new Profile(snapshot)
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
