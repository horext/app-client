import { z } from 'zod'
import {
  entityMetadataSchema,
  optionalStringSchema,
  requiredStringSchema,
  uuidSchema,
  weekdaySchema,
} from './common.schema'

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/)

export const activitySessionSchema = z
  .object({
    day: weekdaySchema,
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .refine(({ startTime, endTime }) => startTime < endTime, {
    message: 'The start time must be before the end time.',
    path: ['endTime'],
  })

export const baseActivitySchema = z.object({
  externalId: uuidSchema.optional(),
  title: requiredStringSchema,
  description: optionalStringSchema,
  location: optionalStringSchema,
  color: requiredStringSchema,
  allowOverlap: z.boolean().optional(),
  sessions: z.array(activitySessionSchema),
})
export const activityPatchSchema = baseActivitySchema
  .omit({ externalId: true })
  .partial()
export const activitySchema = baseActivitySchema.extend({
  id: uuidSchema,
  ...entityMetadataSchema.shape,
})

export const eventSchema = z.object({
  id: z.string(),
  title: requiredStringSchema,
  day: weekdaySchema,
  description: z.string().optional(),
  location: z.string().optional(),
  color: requiredStringSchema,
  category: z.enum(['COURSE', 'MY_EVENT']).optional(),
  type: requiredStringSchema,
  startTime: timeSchema,
  endTime: timeSchema,
})
