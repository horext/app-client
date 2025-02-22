import { z } from 'zod'

export const scheduleRouteSchema = z.object({
  scheduleId: z.string(),
})
