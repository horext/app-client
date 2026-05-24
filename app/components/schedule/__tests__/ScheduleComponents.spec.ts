import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import { ViewMode } from '~/models/ViewMode'
import type {
  IScheduleGenerate,
  IScheduleSubjectGenerate,
} from '~/interfaces/schedule'
import FavoriteAction from '~/components/schedule/FavoriteAction.vue'
import FavoriteBanner from '~/components/schedule/FavoriteBanner.vue'
import FavoriteToggle from '~/components/schedule/FavoriteToggle.vue'
import ExportActions from '~/components/schedule/ExportActions.vue'
import ExternalActions from '~/components/schedule/ExternalActions.vue'
import OccurrencesList from '~/components/schedule/OccurrencesList.vue'
import SubjectsTable from '~/components/schedule/SubjectsTable.vue'
import SubjectsTableItemSection from '~/components/schedule/SubjectsTableItemSection.vue'
import CalendarEventCard from '~/components/schedule/CalendarEventCard.vue'
import CalendarEventInfoCard from '~/components/schedule/CalendarEventInfoCard.vue'
import ActionsBar from '~/components/schedule/ActionsBar.vue'
import ShareCard from '~/components/schedule/ShareCard.vue'

vi.mock('~/composables/lottie', () => ({
  useLottie: vi.fn(() => ref(null)),
}))

vi.mock('~/composables/google-oauth2', () => ({
  useGoogleOAuth2: vi.fn(() => ({
    isSignedIn: ref(false),
    isPendingClient: ref(false),
  })),
}))

vi.mock('~/stores/user-profile', () => ({
  useUserProfileStore: vi.fn(() => ({
    hourlyLoad: ref(null),
  })),
}))

const vuetify = createVuetify()

function makeSchedule(): IScheduleGenerate {
  return {
    id: crypto.randomUUID(),
    schedulesSubject: [],
    events: [],
    scheduleSubjectKey: '',
    crossings: 0,
  }
}

function makeScheduleSubject(): IScheduleSubjectGenerate {
  return {
    id: 1,
    sessions: [],
    subject: {
      course: { id: 'CS101', name: 'Intro CS' },
      id: 0,
      type: {
        id: 0,
        name: '',
        code: '',
      },
      studyPlan: {
        id: 0,
        fromDate: '',
        code: '',
        organizationUnit: {
          id: 0,
        },
      },
      credits: 0,
      cycle: null,
    },
    section: { id: 'A' },
    scheduleSubject: {
      id: 0,
    },
  }
}

describe('FavoriteAction', () => {
  it('renders with active=false', () => {
    const wrapper = shallowMount(FavoriteAction, {
      props: { active: false },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with active=true', () => {
    const wrapper = shallowMount(FavoriteAction, {
      props: { active: true },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits update:active when toggled', () => {
    const wrapper = shallowMount(FavoriteAction, {
      props: { active: false },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('update:active', true)
    expect(wrapper.emitted('update:active')?.[0]).toEqual([true])
  })
})

describe('FavoriteBanner', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(FavoriteBanner, {
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('FavoriteToggle', () => {
  it('renders with a schedule and no favorites', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(FavoriteToggle, {
      props: { schedule, favoritesSchedules: [] },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('shows as favorite when schedule is in favoritesSchedules', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(FavoriteToggle, {
      props: { schedule, favoritesSchedules: [schedule] },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits click:addFavorite when not already a favorite', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(FavoriteToggle, {
      props: { schedule, favoritesSchedules: [] },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('click:addFavorite', schedule)
    expect(wrapper.emitted('click:addFavorite')).toBeTruthy()
  })
})

describe('ExportActions', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(ExportActions, {
      props: { loadingPdf: false, loadingImage: false },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits download:pdf on click', () => {
    const wrapper = shallowMount(ExportActions, {
      props: { loadingPdf: false, loadingImage: false },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('download:pdf', new MouseEvent('click'))
    expect(wrapper.emitted('download:pdf')).toBeTruthy()
  })
})

describe('ExternalActions', () => {
  it('renders in CALENDAR mode', () => {
    const wrapper = shallowMount(ExternalActions, {
      props: {
        mode: ViewMode.CALENDAR,
        loadingExportPdf: false,
        loadingExportImage: false,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders in LIST mode', () => {
    const wrapper = shallowMount(ExternalActions, {
      props: {
        mode: ViewMode.LIST,
        loadingExportPdf: false,
        loadingExportImage: false,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('OccurrencesList', () => {
  it('renders with empty occurrences', () => {
    const wrapper = shallowMount(OccurrencesList, {
      props: { modelValue: [], items: [] },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('SubjectsTable', () => {
  it('renders with a schedule', () => {
    const schedule = {
      ...makeSchedule(),
      schedulesSubject: [makeScheduleSubject()],
    }
    const wrapper = shallowMount(SubjectsTable, {
      props: { schedule },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('SubjectsTableItemSection', () => {
  it('renders with a schedule subject', () => {
    const schedule = makeScheduleSubject()
    const wrapper = shallowMount(SubjectsTableItemSection, {
      props: { schedule },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('CalendarEventCard', () => {
  it('renders an event without code (MY_EVENT style)', () => {
    const wrapper = shallowMount(CalendarEventCard, {
      props: {
        event: {
          id: '1',
          title: 'My Event',
          color: 'blue',
          type: 'MY_EVENT',
          name: 'My Event',
        },
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders a course event with code and section', () => {
    const wrapper = shallowMount(CalendarEventCard, {
      props: {
        event: {
          id: '1',
          code: 'CS101',
          section: 'A',
          type: 'THEORY',
          name: 'Intro CS',
          title: 'CS101 A',
          color: 'indigo',
        },
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('CalendarEventInfoCard', () => {
  it('renders with a selected event', () => {
    const wrapper = shallowMount(CalendarEventInfoCard, {
      props: {
        selectedEvent: {
          id: '1',
          title: 'CS101 A',
          description: 'Lecture',
          location: 'Room 101',
          type: 'THEORY',
          color: 'indigo',
          startTime: '09:00',
          endTime: '11:00',
          day: 1,
        },
        dialog: true,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('ActionsBar', () => {
  it('renders with required props', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(ActionsBar, {
      props: {
        currentSchedule: schedule,
        mode: ViewMode.CALENDAR,
        path: '/generator',
      },
      global: {
        plugins: [vuetify],
        stubs: {
          ScheduleExternalActions: true,
          GoogleCalendarConnect: true,
          GoogleSignInDialog: true,
          GoogleCalendarSyncDialog: true,
          ScheduleShare: true,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('ShareCard', () => {
  it('renders with path and schedule', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(ShareCard, {
      props: {
        path: '/generator/1',
        schedule,
        dialog: true,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
