import type { IInterval } from '~/interfaces/interval'
import type { IScheduleSubjectGenerate } from '~/interfaces/schedule'
import { CourseEvent } from '~/models/Event'

export const isIntersects = (
  eventTarget: IInterval,
  eventSource: IInterval,
): boolean =>
  !(
    eventTarget.end <= eventSource.start || eventSource.end <= eventTarget.start
  )

export function scheduleToEvents(
  schedule: IScheduleSubjectGenerate,
  color: string,
): Array<CourseEvent> {
  return CourseEvent.buildFromSchedule(schedule, color)
}
