import { z } from 'zod'
import { weekdaySchema } from './common.schema'
import {
  EventCategories,
  ScheduleCategory,
} from '../constants/categories.constant'

const subjectScheduleSchema = z.array(
  z.object({
    id: z.number(),
    section: z.object({
      id: z.string(),
    }),
    scheduleSubject: z.object({
      id: z.number(),
    }),
    subject: z.object({
      id: z.number(),
      course: z.object({
        id: z.string(),
        name: z.string(),
      }),
    }),
    sessions: z.array(
      z.object({
        id: z.number(),
        schedule: z.object({
          id: z.number(),
        }),
        classroom: z.object({
          id: z.number(),
          code: z.string(),
        }),
        teacher: z.object({
          id: z.number(),
          fullName: z.string(),
        }),
        type: z.object({
          id: z.number(),
          code: z.string(),
        }),
        day: weekdaySchema,
        startTime: z.string(),
        endTime: z.string(),
      }),
    ),
  }),
)

const eventSchedule = z.object({
  id: z.string(),
  day: weekdaySchema,
  startTime: z.string(),
  endTime: z.string(),
  title: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  color: z.string(),
  category: z
    .literal(EventCategories.COURSE)
    .or(z.literal(EventCategories.MY_EVENT)),
  type: z.string(),
})

export const scheduleCategoryCodeSchema = z
  .literal(ScheduleCategory.GENARATED)
  .or(z.literal(ScheduleCategory.FAVORITE))

export const scheduleSchema = z.object({
  id: z.string(),
  scheduleSubjectIds: z.array(z.number()),
  schedule: subjectScheduleSchema,
  crossings: z.number(),
  events: z.array(eventSchedule),
  categories: z.array(scheduleCategoryCodeSchema),
})
