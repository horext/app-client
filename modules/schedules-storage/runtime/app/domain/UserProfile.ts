import type { IUserProfile } from '../../shared/interfaces/profile'

export class UserProfile {
  private constructor(
    readonly id: IUserProfile['id'],
    readonly facultyId: number,
    readonly specialityId: number,
    readonly setupCompleted: boolean,
  ) {}

  patch(partial: Partial<Omit<IUserProfile, 'id'>>): UserProfile {
    return new UserProfile(
      this.id,
      partial.facultyId !== undefined ? partial.facultyId : this.facultyId,
      partial.specialityId !== undefined ? partial.specialityId : this.specialityId,
      partial.setupCompleted ?? this.setupCompleted,
    )
  }

  toData(): IUserProfile {
    return {
      id: this.id,
      facultyId: this.facultyId,
      specialityId: this.specialityId,
      setupCompleted: this.setupCompleted,
    }
  }

  static create(
    initial: Omit<IUserProfile, 'id' | 'setupCompleted'> & {
      setupCompleted?: boolean
    },
  ): UserProfile {
    return new UserProfile(
      'profile',
      initial.facultyId,
      initial.specialityId,
      initial.setupCompleted ?? false,
    )
  }

  static from(data: IUserProfile): UserProfile {
    return new UserProfile(
      data.id,
      data.facultyId,
      data.specialityId,
      data.setupCompleted,
    )
  }
}
