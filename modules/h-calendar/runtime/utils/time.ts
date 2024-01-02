import { HOUR_IN_MINUTES, HOUR_PAD_LENGTH, MINUTE_PAD_LENGTH } from "../constants/time"


export const timeToHours = (time: string) => {
  const hours = Number(time.split(':')[0])
  const minutes = Number(time.split(':')[1])
  return hours + minutes / 60
}

export function formatedTimeToMinutes(time: string) {
  const hours = Number(time.split(':')[0])
  const minutes = Number(time.split(':')[1])
  return hours * HOUR_IN_MINUTES + minutes
}

export function formatTime(minutes: number) {
  const hours = Math.floor(minutes / HOUR_IN_MINUTES)
  const minutesLeft = minutes % HOUR_IN_MINUTES
  return `${hours.toString().padStart(HOUR_PAD_LENGTH, '0')}:${minutesLeft
    .toString()
    .padStart(MINUTE_PAD_LENGTH, '0')}`
}
