import { z } from 'zod'

enum Weekday {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

enum EventCategories {
  COURSE = 'COURSE',
  MY_EVENT = 'MY_EVENT',
}

enum ScheduleCategory {
  GENARATED = 'GENARATED',
  FAVORITE = 'FAVORITE',
}

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
        day: z.nativeEnum(Weekday),
        startTime: z.string(),
        endTime: z.string(),
      }),
    ),
  }),
)

const eventSchedule = z.object({
  id: z.string(),
  day: z.nativeEnum(Weekday),
  startTime: z.string(),
  endTime: z.string(),
  title: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  color: z.string(),
  category: z.nativeEnum(EventCategories),
  type: z.string(),
})

export const scheduleCategoryCodeSchema = z.nativeEnum(ScheduleCategory)

export const scheduleSchema = z.object({
  id: z.string(),
  scheduleSubjectIds: z.array(z.number()),
  schedule: subjectScheduleSchema,
  crossings: z.number(),
  events: z.array(eventSchedule),
  categories: z.array(scheduleCategoryCodeSchema),
})
