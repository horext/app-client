import { z } from 'zod'
import {
  entityMetadataSchema,
  optionalStringSchema,
  uuidSchema,
  weekdaySchema,
} from './common.schema'

export const subjectSchema = z.object({
  id: z.number().finite(),
  course: z.object({ id: z.string(), name: z.string() }),
  type: z.object({ id: z.number(), name: z.string(), code: z.string() }),
  studyPlan: z.object({
    id: z.number(),
    fromDate: z.string(),
    code: z.string(),
    organizationUnit: z.object({ id: z.number() }),
  }),
  credits: z.number(),
  cycle: z.number().nullable(),
})
export const sessionSchema = z.object({
  id: z.number(),
  schedule: z.object({ id: z.number() }),
  classroom: z.object({ id: z.number(), code: z.string() }),
  teacher: z.object({ id: z.number(), fullName: z.string() }).optional(),
  type: z.object({ id: z.number(), code: z.string() }),
  day: weekdaySchema,
  startTime: z.string(),
  endTime: z.string(),
})
export const subjectScheduleSchema = z.object({
  id: z.number(),
  section: z.object({ id: z.string() }),
  scheduleSubject: z.object({ id: z.number() }),
  sessions: z.array(sessionSchema),
})
export const baseSubjectAggregateSchema = z.object({
  externalId: uuidSchema.optional(),
  subject: subjectSchema,
  schedules: z.array(subjectScheduleSchema),
  color: optionalStringSchema,
})
export const subjectAggregatePatchSchema = baseSubjectAggregateSchema
  .omit({ externalId: true })
  .partial()
export const subjectAggregateSchema = baseSubjectAggregateSchema.extend({
  id: uuidSchema,
  ...entityMetadataSchema.shape,
})
