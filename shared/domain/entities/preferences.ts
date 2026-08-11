import type {
  IBasePreferences,
  IPreferences,
  IPreferencesCreate,
  IPreferencesUpdate,
} from '../types/preferences'
import { DomainError } from '../errors/domain-error'
import type { UUID } from 'crypto'
import type { IEntitySnapshot } from './snapshot'

export class Preferences<
  T extends IBasePreferences | IPreferences = IPreferences,
> implements IEntitySnapshot<T> {
  private constructor(private readonly snapshot: T) {}

  static create(input: IPreferencesCreate): Preferences<IBasePreferences> {
    return Preferences.build(input)
  }

  private static build<T extends IBasePreferences | IPreferences>(
    input: T,
  ): Preferences<T> {
    if (input.maxGenerationHistory < 1)
      throw new DomainError(
        'invalid-limit',
        'Generation history must be positive.',
        'maxGenerationHistory',
      )
    return new Preferences({
      ...input,
      weekDays: [...input.weekDays],
    })
  }

  static restore(snapshot: IPreferences): Preferences<IPreferences> {
    return Preferences.build(snapshot)
  }

  update(input: IPreferencesUpdate): Preferences<IPreferences> {
    if (!('id' in this.snapshot)) throw new Error('Entity is not persisted.')
    const snapshot: IPreferences = {
      ...this.snapshot,
      ...input,
      id: this.snapshot.id,
    }
    return Preferences.build(snapshot)
  }

  get id(): UUID {
    if (!('id' in this.snapshot)) throw new Error('Entity is not persisted.')
    return this.snapshot.id
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
