import { z } from 'zod'
import { eventSchema } from './activity.schema'
import {
  entityMetadataSchema,
  requiredStringSchema,
  uuidSchema,
  weekdaySchema,
} from './common.schema'

const occurrenceSchema = z.object({
  id: z.string(),
  eventKey: z.string(),
  name: z.string(),
  type: z.string(),
  eventTarget: eventSchema,
  eventSource: eventSchema,
})
export const baseGenerationAggregateSchema = z.object({
  externalId: uuidSchema.optional(),
  generatedAt: requiredStringSchema,
  scheduleIds: z.array(uuidSchema),
  crossingsSetting: z.number(),
  weekDays: z.array(weekdaySchema),
  hourlyLoadId: z.number(),
  resultCount: z.number().int().nonnegative(),
  occurrences: z.array(occurrenceSchema),
})
export const generationAggregatePatchSchema = baseGenerationAggregateSchema
  .omit({ externalId: true })
  .partial()
export const generationAggregateSchema = baseGenerationAggregateSchema.extend({
  id: uuidSchema,
  ...entityMetadataSchema.shape,
})
