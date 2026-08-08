import type { IPreferences } from '../interfaces/preferences'
import type { IEntityMetadata } from '../interfaces/entity-metadata'
import type {
  IPreferencesCreate,
  IPreferencesUpdate,
  Clock,
} from './domain-helpers'
import {
  created,
  currentTime,
  restored,
  updated,
  validWeekday,
} from './domain-helpers'
import { DomainError } from './domain-error'

export class Preferences {
  private constructor(private readonly snapshot: IPreferences) {}

  static create(
    input: IPreferencesCreate,
    clock: Clock = currentTime,
  ): Preferences {
    return Preferences.build(input, created(clock))
  }

  private static build(
    input: IPreferencesCreate,
    metadata: IEntityMetadata,
  ): Preferences {
    if (input.maxGenerationHistory < 1)
      throw new DomainError(
        'invalid-limit',
        'Generation history must be positive.',
        'maxGenerationHistory',
      )
    if (!input.weekDays.every(validWeekday))
      throw new DomainError(
        'invalid-weekday',
        'A preference weekday is invalid.',
        'weekDays',
      )
    return new Preferences({
      id: 'preferences',
      ...input,
      weekDays: [...input.weekDays],
      ...metadata,
    })
  }

  static restore(snapshot: IPreferences): Preferences {
    return Preferences.build(snapshot, restored(snapshot))
  }

  update(input: IPreferencesUpdate, clock: Clock = currentTime): Preferences {
    return Preferences.build(
      { ...this.snapshot, ...input },
      updated(this.snapshot, clock),
    )
  }

  toSnapshot(): IPreferences {
    return { ...this.snapshot, weekDays: [...this.snapshot.weekDays] }
  }
}
