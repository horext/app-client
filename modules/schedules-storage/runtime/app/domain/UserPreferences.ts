import type { IUserPreferences } from '../../shared/interfaces/preferences'
import type { Weekdays } from '../../shared/interfaces/event'

export class UserPreferences {
  private constructor(
    readonly id: IUserPreferences['id'],
    readonly weekDays: Weekdays[],
    readonly crossings: number,
    readonly maxGenerationHistory: number,
  ) {}

  patch(partial: Partial<Omit<IUserPreferences, 'id'>>): UserPreferences {
    return new UserPreferences(
      this.id,
      partial.weekDays ?? this.weekDays,
      partial.crossings ?? this.crossings,
      partial.maxGenerationHistory ?? this.maxGenerationHistory,
    )
  }

  toData(): IUserPreferences {
    return {
      id: this.id,
      weekDays: this.weekDays,
      crossings: this.crossings,
      maxGenerationHistory: this.maxGenerationHistory,
    }
  }

  static create(): UserPreferences {
    return new UserPreferences('preferences', [0, 1, 2, 3, 4, 5, 6], 0, 5)
  }

  static from(data: undefined): undefined
  static from(data: IUserPreferences): UserPreferences
  static from(data: IUserPreferences | undefined): UserPreferences | undefined
  static from(data?: IUserPreferences | undefined): UserPreferences | undefined {
    if (!data) {
      return undefined
    }
    return new UserPreferences(
      data.id,
      data.weekDays,
      data.crossings,
      data.maxGenerationHistory,
    )
  }
}
