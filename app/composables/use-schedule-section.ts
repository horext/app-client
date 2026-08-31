import type { Ref } from 'vue'
import type {
  PlannedSubjectSchedule,
  SessionFieldChange,
} from '~/models/planned-subject'

export interface ScheduleSessionState {
  isModified: boolean
  changeDetails: SessionFieldChange[]
}

export const useScheduleSection = (
  option: Ref<PlannedSubjectSchedule>,
  showChanges: Ref<boolean>,
) => {
  const schedule = computed(() => option.value.current)
  const isAddedToSelection = computed(
    () => showChanges.value && option.value.selectionChange === 'added',
  )
  const sessionStates = computed<Record<number, ScheduleSessionState>>(() =>
    Object.fromEntries(
      schedule.value.sessions.map((session) => {
        const changeDetails =
          showChanges.value && option.value.selected && option.value.wasSelected
            ? option.value.sessionChanges(session.id)
            : []
        return [
          session.id,
          { isModified: changeDetails.length > 0, changeDetails },
        ]
      }),
    ),
  )

  return { schedule, isAddedToSelection, sessionStates }
}
