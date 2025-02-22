import { z } from 'zod'
import { Weekday } from '../models/weekday.model'

export const weekdaySchema = z.nativeEnum(Weekday)
