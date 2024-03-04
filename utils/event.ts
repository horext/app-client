import type { IInterval } from '~/interfaces/interval'

export const isIntersects = (
  eventTarget: IInterval,
  eventSource: IInterval,
): boolean =>
  !(
    eventTarget.end <= eventSource.start || eventSource.end <= eventTarget.start
  )
