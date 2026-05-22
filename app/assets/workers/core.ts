import type { IEvent } from '~/interfaces/event'
import type { ISubjectSchedules } from '~/interfaces/subject'
import type { ScheduleOptions } from '~/utils/core'
import { getSchedules } from '~/utils/core'

self.addEventListener(
  'message',
  function (e) {
    const input: [
      subjects: Array<ISubjectSchedules>,
      myEvents: Array<IEvent>,
      options?: ScheduleOptions,
    ] = JSON.parse(e.data)
    const output = getSchedules(...input)

    self.postMessage(output)
  },
  false,
)
