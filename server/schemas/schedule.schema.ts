import { z } from 'zod'

export const scheduleSchema = z.object({
  id: z.string(),
  scheduleSubjectIds: z.array(z.number()),
  schedule: z.array(
    z.object({
      id: z.number(),
      section: z.object({
        id: z.string(),
      }),
      scheduleSubject: z.object({
        id: z.number(),
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
          day: z.number(),
          startTime: z.string(),
          endTime: z.string(),
        })
      ),
    })
  ),
  crossings: z.number(),
  events: z.array(
    z.object({
      id: z.string(),
      day: z.number(),
      startTime: z.string(),
      endTime: z.string(),
      title: z.string(),
      description: z.string().optional(),
      location: z.string().optional(),
      color: z.string(),
      category: z.string().optional(),
      type: z.string(),
    })
  ),
})
