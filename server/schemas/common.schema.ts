import { z } from 'zod'
import { Weekday } from '../constants/weekday.constant'

export const weekdaySchema = z.union([
  z.literal(Weekday.Sunday),
  z.literal(Weekday.Monday),
  z.literal(Weekday.Tuesday),
  z.literal(Weekday.Wednesday),
  z.literal(Weekday.Thursday),
  z.literal(Weekday.Friday),
  z.literal(Weekday.Saturday),
])
