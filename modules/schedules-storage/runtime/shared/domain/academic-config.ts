import type { IAcademicConfig } from '../interfaces/academic-config'
import type { IEntityMetadata } from '../interfaces/entity-metadata'
import type {
  IAcademicConfigCreate,
  IAcademicConfigUpdate,
  Clock,
} from './domain-helpers'
import { created, currentTime, restored, updated } from './domain-helpers'

export class AcademicConfig {
  private constructor(private readonly snapshot: IAcademicConfig) {}

  static create(
    input: IAcademicConfigCreate,
    clock: Clock = currentTime,
  ): AcademicConfig {
    return AcademicConfig.build(input, created(clock))
  }

  private static build(
    input: IAcademicConfigCreate,
    metadata: IEntityMetadata,
  ): AcademicConfig {
    return new AcademicConfig({
      id: 'academic-config',
      hourlyLoad: input.hourlyLoad ? structuredClone(input.hourlyLoad) : null,
      ...metadata,
    })
  }

  static restore(snapshot: IAcademicConfig): AcademicConfig {
    return AcademicConfig.build(snapshot, restored(snapshot))
  }

  update(
    input: IAcademicConfigUpdate,
    clock: Clock = currentTime,
  ): AcademicConfig {
    return AcademicConfig.build(
      { ...this.snapshot, ...input },
      updated(this.snapshot, clock),
    )
  }

  toSnapshot(): IAcademicConfig {
    return structuredClone(this.snapshot)
  }
}
