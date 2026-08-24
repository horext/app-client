import { z } from 'zod'
import {
  entityMetadataSchema,
  uuidSchema,
  weekdaySchema,
} from './common.schema'

export const preferencesCreateSchema = z.object({
  weekDays: z.array(weekdaySchema),
  crossings: z.number(),
  maxGenerationHistory: z.number().int().positive(),
})
export const preferencesPatchSchema = preferencesCreateSchema.partial()
export const preferencesSchema = preferencesCreateSchema
  .extend({ id: uuidSchema })
  .extend(entityMetadataSchema.shape)
