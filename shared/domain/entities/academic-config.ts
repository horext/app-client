import type {
  IBaseAcademicConfig,
  IAcademicConfig,
} from '../types/academic-config'
import type {
  IAcademicConfigCreate,
  IAcademicConfigUpdate,
} from '../types/domain-helpers'
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

  private static build<T extends IBaseAcademicConfig | IAcademicConfig>(
    input: T,
  ): AcademicConfig<T> {
    return new AcademicConfig(structuredClone(input))
  }

  static restore(snapshot: IAcademicConfig): AcademicConfig<IAcademicConfig> {
    return AcademicConfig.build(snapshot)
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
    return AcademicConfig.build(snapshot)
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
