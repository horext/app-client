import { z } from 'zod'
import { entityMetadataSchema, uuidSchema } from './common.schema'

export const hourlyLoadSchema = z.object({
  id: z.number(),
  name: z.string(),
  checkedAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  academicPeriodOrganizationUnit: z.object({
    id: z.number(),
    fromDate: z.string(),
    toDate: z.string(),
    academicPeriod: z.object({ id: z.number() }),
    organizationUnit: z.object({ id: z.number() }),
  }),
})
export const academicConfigCreateSchema = z.object({
  hourlyLoad: hourlyLoadSchema.nullable(),
})
export const academicConfigPatchSchema = academicConfigCreateSchema.partial()
export const academicConfigSchema = academicConfigCreateSchema
  .extend({ id: uuidSchema })
  .extend(entityMetadataSchema.shape)
