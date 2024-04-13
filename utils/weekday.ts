import { DateTime } from 'luxon'
import type { Weekdays } from '~/interfaces/event'

export const weekdayToDatetime = (weekday: Weekdays, time: string) => {
  const date = DateTime.fromISO(time).set({
    weekday: weekday === 0 ? 7 : weekday,
  })
  return date.toFormat('yyyy-MM-dd HH:mm')
}

export const weekdayToDate = (weekday: Weekdays) => {
  const date = DateTime.local().set({ weekday: weekday === 0 ? 7 : weekday })
  return date.toFormat('yyyy-MM-dd')
}

export const convertToDate = (weekday: Weekdays, startTime: string) => {
  return weekdayToDatetime(weekday, startTime)
}
