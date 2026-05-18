import type { IUserProfile } from '~/interfaces/profile'
import type { IOrganization } from '~/interfaces/organization'

export class UserProfile {
  private constructor(
    readonly id: IUserProfile['id'],
    readonly faculty: IOrganization,
    readonly speciality: IOrganization,
    readonly setupCompleted: boolean,
  ) {}

  patch(partial: Partial<Omit<IUserProfile, 'id'>>): UserProfile {
    return new UserProfile(
      this.id,
      partial.faculty !== undefined ? partial.faculty : this.faculty,
      partial.speciality !== undefined ? partial.speciality : this.speciality,
      partial.setupCompleted ?? this.setupCompleted,
    )
  }

  withFaculty(faculty: IOrganization): UserProfile {
    return this.patch({ faculty })
  }

  withSpeciality(speciality: IOrganization): UserProfile {
    return this.patch({ speciality })
  }

  withSetupCompleted(setupCompleted: boolean): UserProfile {
    return this.patch({ setupCompleted })
  }

  toData(): IUserProfile {
    return {
      id: this.id,
      faculty: this.faculty,
      speciality: this.speciality,
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
      initial.faculty,
      initial.speciality,
      initial.setupCompleted ?? false,
    )
  }

  static from(data: IUserProfile): UserProfile {
    return new UserProfile(
      data.id,
      data.faculty,
      data.speciality,
      data.setupCompleted,
    )
  }
}
