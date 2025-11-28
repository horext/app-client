import { DateTime } from 'luxon'
import { WEEK_DAYS_NAMES } from '~/constants/weekdays'
import type { Weekdays } from '~/interfaces/event'
import type { WeekdaysISO } from '~~/modules/h-calendar/runtime/constants/week'

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

export const getWeekdayName = (weekday: Weekdays) => {
  return WEEK_DAYS_NAMES[weekday]
}
export const getWeekdayISONames = (weekday: WeekdaysISO) => {
  return WEEK_DAYS_NAMES[weekday % 7]
}
