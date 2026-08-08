import type { IProfile } from '../interfaces/profile'
import type { IEntityMetadata } from '../interfaces/entity-metadata'
import type { IProfileCreate, IProfileUpdate, Clock } from './domain-helpers'
import { DomainError } from './domain-error'
import { created, currentTime, restored, updated } from './domain-helpers'

export class Profile {
  private constructor(private readonly snapshot: IProfile) {}

  static create(input: IProfileCreate, clock: Clock = currentTime): Profile {
    return Profile.build(input, created(clock))
  }

  private static build(
    input: IProfileCreate,
    metadata: IEntityMetadata,
  ): Profile {
    if (
      !Number.isFinite(input.facultyId) ||
      !Number.isFinite(input.specialityId)
    )
      throw new DomainError(
        'invalid-reference',
        'Profile references are invalid.',
      )
    return new Profile({ id: 'profile', ...input, ...metadata })
  }

  static restore(snapshot: IProfile): Profile {
    return Profile.build(snapshot, restored(snapshot))
  }

  update(input: IProfileUpdate, clock: Clock = currentTime): Profile {
    return Profile.build(
      { ...this.snapshot, ...input },
      updated(this.snapshot, clock),
    )
  }

  toSnapshot(): IProfile {
    return { ...this.snapshot }
  }
}
