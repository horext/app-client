import type { IBasePreferences, IPreferences } from '../interfaces/preferences'
import type { IPreferencesCreate, IPreferencesUpdate } from './domain-helpers'
import { validWeekday } from './domain-helpers'
import { DomainError } from './domain-error'
import type { UUID } from 'crypto'

export class Preferences<
  T extends IBasePreferences | IPreferences = IPreferences,
> {
  private constructor(private readonly snapshot: T) {}

  static create(input: IPreferencesCreate): Preferences<IBasePreferences> {
    return Preferences.build(input)
  }

  private static build(
    input: IPreferencesCreate,
  ): Preferences<IBasePreferences> {
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
      ...input,
      weekDays: [...input.weekDays],
    })
  }

  private static buildFromSnapshot(
    snapshot: IPreferences,
  ): Preferences<IPreferences> {
    return new Preferences({
      ...snapshot,
      weekDays: [...snapshot.weekDays],
    })
  }

  static restore(snapshot: IPreferences): Preferences<IPreferences> {
    return Preferences.buildFromSnapshot(snapshot)
  }

  update(input: IPreferencesUpdate): Preferences<IPreferences> {
    if (!('id' in this.snapshot)) throw new Error('Entity is not persisted.')
    const snapshot: IPreferences = {
      ...this.snapshot,
      ...input,
      id: this.snapshot.id,
    }
    return new Preferences(snapshot)
  }

  get id(): UUID {
    if (!('id' in this.snapshot)) throw new Error('Entity is not persisted.')
    return this.snapshot.id
  }

  toSnapshot(): T {
    return { ...this.snapshot, weekDays: [...this.snapshot.weekDays] } as T
  }
}
