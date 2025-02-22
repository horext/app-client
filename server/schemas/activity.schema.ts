import { z } from 'zod'
import { weekdaySchema } from './common.schema'

export const baseActivitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  day: weekdaySchema,
  description: z.string().optional(),
  location: z.string().optional(),
  color: z.string(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
})

export const activitySchema = baseActivitySchema.extend({
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
