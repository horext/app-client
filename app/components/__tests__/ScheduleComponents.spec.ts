import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import { ViewMode } from '~/models/ViewMode'
import type {
  IScheduleGenerate,
  IBaseScheduleGenerate,
} from '~/interfaces/schedule'
import ScheduleShareAddFavorite from '~/components/ScheduleShareAddFavorite.vue'
import SchedulesWindow from '~/components/SchedulesWindow.vue'
import SchedulesPresentation from '~/components/SchedulesPresentation.vue'

vi.mock('~/composables/google-oauth2', () => ({
  useGoogleOAuth2: vi.fn(() => ({
    isSignedIn: ref(false),
    isPendingClient: ref(false),
  })),
}))

vi.mock('~/stores/user-preferences', () => ({
  useUserPreferencesStore: vi.fn(() => ({
    weekDays: ref([1, 2, 3, 4, 5]),
    color: ref('primary'),
  })),
}))

vi.mock('~/stores/user-profile', () => ({
  useUserProfileStore: vi.fn(() => ({
    hourlyLoad: ref(null),
  })),
}))

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  return {
    ...actual,
    storeToRefs: vi.fn((store) => store),
  }
})

const vuetify = createVuetify()

function makeSchedule(): IScheduleGenerate {
  return {
    id: crypto.randomUUID(),
    schedulesSubject: [],
    events: [],
    scheduleSubjectKey: 'key-1',
    crossings: 0,
  }
}

describe('ScheduleShareAddFavorite', () => {
  it('renders with no favorites (not a favorite)', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(ScheduleShareAddFavorite, {
      props: {
        schedule: schedule as IBaseScheduleGenerate,
        favoritesSchedules: [],
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders as a favorite when schedule matches', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(ScheduleShareAddFavorite, {
      props: {
        schedule: schedule as IBaseScheduleGenerate,
        favoritesSchedules: [schedule],
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits click:add-favorite when not a favorite', async () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(ScheduleShareAddFavorite, {
      props: {
        schedule: schedule as IBaseScheduleGenerate,
        favoritesSchedules: [],
      },
      global: { plugins: [vuetify] },
    })
    await wrapper.find('v-btn-stub').trigger('click')
    expect(wrapper.emitted('click:add-favorite')).toBeTruthy()
  })
})

describe('SchedulesWindow', () => {
  it('renders with schedules and weekDays', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(SchedulesWindow, {
      props: {
        schedules: [schedule],
        weekDays: [1, 2, 3, 4, 5],
        mode: ViewMode.CALENDAR,
        currentSchedule: schedule,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders in LIST mode', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(SchedulesWindow, {
      props: {
        schedules: [schedule],
        weekDays: [1, 2, 3, 4, 5],
        mode: ViewMode.LIST,
        currentSchedule: schedule,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('SchedulesPresentation', () => {
  it('renders with no schedules (empty state)', () => {
    const wrapper = shallowMount(SchedulesPresentation, {
      props: {
        schedules: [],
        weekDays: [1, 2, 3, 4, 5],
        path: '/generator',
        color: 'primary',
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with schedules present', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(SchedulesPresentation, {
      props: {
        schedules: [schedule],
        weekDays: [1, 2, 3, 4, 5],
        path: '/generator',
        color: 'primary',
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
