import { z } from 'zod'
import { entityMetadataSchema, uuidSchema } from './common.schema'

export const profileCreateSchema = z.object({
  facultyId: z.number().finite(),
  specialityId: z.number().finite(),
  setupCompleted: z.boolean().optional(),
})
export const profilePatchSchema = profileCreateSchema.partial()
export const profileSchema = profileCreateSchema
  .extend({ setupCompleted: z.boolean(), id: uuidSchema })
  .extend(entityMetadataSchema.shape)
