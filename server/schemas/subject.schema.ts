import { z } from 'zod'

export const subjectSchema = z.object({
  id: z.number(),
  course: z.object({
    id: z.string(),
    name: z.string(),
  }),
  type: z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
  }),
  studyPlan: z.object({
    id: z.number(),
    fromDate: z.string(),
    code: z.string(),
    organizationUnit: z.object({
      id: z.number(),
    }),
  }),
  credits: z.number(),
  cycle: z.number().nullable(),
  schedules: z.array(
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
        }),
      ),
    }),
  ),
})
