import type { IActivity } from '~/interfaces/event'
import type { ISubjectSchedules } from '~/interfaces/subject'
import type { ScheduleOptions } from '~/utils/core'
import { getSchedules } from '~/utils/core'

self.addEventListener(
  'message',
  function (e) {
    const input: [
      subjects: Array<ISubjectSchedules>,
      myEvents: Array<IActivity>,
      options?: ScheduleOptions,
    ] = JSON.parse(e.data)
    const output = getSchedules(...input)

    self.postMessage(output)
  },
  false,
)
