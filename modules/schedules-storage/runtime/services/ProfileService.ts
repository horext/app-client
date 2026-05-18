import type { IUserProfile } from '~/interfaces/profile'
import type { IOrganization } from '~/interfaces/organization'
import type { IProfileRepository } from '../interfaces/profile-repository'
import type { IProfileService } from '../interfaces/profile-service'

const DEFAULT_PROFILE: IUserProfile = {
  id: 'profile',
  faculty: null,
  speciality: null,
  setupCompleted: false,
}

export class ProfileService implements IProfileService {
  constructor(private readonly repo: IProfileRepository) {}

  async getProfile(): Promise<IUserProfile | undefined> {
    return this.repo.get()
  }

  async createProfile(): Promise<IUserProfile> {
    const existing = await this.repo.get()
    if (existing) return existing
    const defaultProfile = { ...DEFAULT_PROFILE }
    await this.repo.save(defaultProfile)
    return defaultProfile
  }

  async patch(partial: Partial<Omit<IUserProfile, 'id'>>): Promise<void> {
    const current = await this.repo.get()
    if (!current) return
    await this.repo.save({ ...current, ...partial })
  }

  async updateFaculty(faculty: IOrganization | null): Promise<void> {
    await this.patch({ faculty })
  }

  async updateSpeciality(speciality: IOrganization | null): Promise<void> {
    await this.patch({ speciality })
  }

  async updateSetupCompleted(setupCompleted: boolean): Promise<void> {
    await this.patch({ setupCompleted })
  }

  async completeSetup(faculty: IOrganization | null, speciality: IOrganization | null): Promise<void> {
    await this.patch({ faculty, speciality, setupCompleted: true })
  }
}
