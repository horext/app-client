import {
  HOUR_IN_MINUTES,
  HOUR_PAD_LENGTH,
  MINUTE_PAD_LENGTH,
} from '../constants/time'
import {
  END_HOUR,
  INTERVAL_MINUTES,
  START_HOUR,
} from '../constants/schedule-interval'
import { INTERVAL_HEIGHT_IN_REM, ROUND_DOWN_TIME } from '../constants/interval'

export function mouseEventDayToMinutes(
  e: MouseEvent,
  {
    startHour = START_HOUR,
    intervalMinutes = INTERVAL_MINUTES,
    intervalHeight = INTERVAL_HEIGHT_IN_REM,
  },
) {
  const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const baseMinutes: number = startHour * HOUR_IN_MINUTES
  const mouseEvent: MouseEvent = e
  const clientY: number = mouseEvent.clientY
  const addIntervals: number = (clientY - bounds.top) / intervalHeight
  const addMinutes: number = Math.floor(addIntervals * intervalMinutes)
  const minutes: number = baseMinutes + addMinutes
  return minutes
}

export const getHours = (
  startHour = START_HOUR,
  endHour = END_HOUR,
  intervalMinutes = INTERVAL_MINUTES,
) => {
  const hours: string[] = []
  for (let i = startHour; i < endHour; i++) {
    for (let j = 0; j < HOUR_IN_MINUTES; j += intervalMinutes) {
      const hour = i.toString().padStart(HOUR_PAD_LENGTH, '0')
      const minute = j.toString().padStart(MINUTE_PAD_LENGTH, '0')
      hours.push(`${hour}:${minute}`)
    }
  }
  return hours
}

export function roundTime(timeInMin: number, down = true) {
  const roundDownTime = ROUND_DOWN_TIME
  return down
    ? timeInMin - (timeInMin % roundDownTime)
    : timeInMin + (roundDownTime - (timeInMin % roundDownTime))
}
