import { z } from 'zod'
import type { UUID } from 'crypto'

export const requiredStringSchema = z.string().trim().min(1)
export const optionalStringSchema = z.string().trim().optional()
export const resourceIdSchema = z
  .string()
  .max(128)
  .regex(/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/)
function isUuid(value: unknown): value is UUID {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  )
}

export const uuidSchema = z.custom<UUID>(isUuid, 'Invalid UUID.')
export const weekdaySchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
])
export const entityMetadataSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  updatedBy: z.string(),
})
