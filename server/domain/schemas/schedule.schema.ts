import { z } from 'zod'
import { eventSchema } from './activity.schema'
import {
  entityMetadataSchema,
  requiredStringSchema,
  uuidSchema,
} from './common.schema'
import { subjectScheduleSchema, subjectSchema } from './subject.schema'

const scheduleSubjectSchema = subjectScheduleSchema.extend({
  subject: subjectSchema,
})
export const baseScheduleAggregateSchema = z.object({
  externalId: uuidSchema.optional(),
  scheduleSubjectKey: requiredStringSchema,
  schedulesSubject: z.array(scheduleSubjectSchema),
  crossings: z.number().int().nonnegative(),
  events: z.array(eventSchema),
})
export const scheduleAggregatePatchSchema = baseScheduleAggregateSchema
  .omit({ externalId: true })
  .partial()
export const scheduleAggregateSchema = baseScheduleAggregateSchema.extend({
  id: uuidSchema,
  ...entityMetadataSchema.shape,
})
