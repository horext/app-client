import type {
  IBaseAcademicConfig,
  IAcademicConfig,
} from '../interfaces/academic-config'
import type {
  IAcademicConfigCreate,
  IAcademicConfigUpdate,
} from './domain-helpers'
import type { UUID } from 'crypto'

export class AcademicConfig<
  T extends IBaseAcademicConfig | IAcademicConfig = IAcademicConfig,
> {
  private constructor(private readonly snapshot: T) {}

  static create(
    input: IAcademicConfigCreate,
  ): AcademicConfig<IBaseAcademicConfig> {
    return AcademicConfig.build(input)
  }

  private static build(
    input: IAcademicConfigCreate,
  ): AcademicConfig<IBaseAcademicConfig> {
    return new AcademicConfig({
      hourlyLoad: input.hourlyLoad ? structuredClone(input.hourlyLoad) : null,
    })
  }

  static restore(snapshot: IAcademicConfig): AcademicConfig<IAcademicConfig> {
    return new AcademicConfig(structuredClone(snapshot))
  }

  get id(): UUID {
    if (!('id' in this.snapshot)) throw new Error('Entity is not persisted.')
    return this.snapshot.id
  }

  update(input: IAcademicConfigUpdate): AcademicConfig<IAcademicConfig> {
    if (!('id' in this.snapshot)) throw new Error('Entity is not persisted.')
    const snapshot: IAcademicConfig = {
      ...this.snapshot,
      ...input,
      id: this.snapshot.id,
    }
    return new AcademicConfig(snapshot)
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
