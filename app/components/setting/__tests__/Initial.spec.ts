import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi, type Mocked, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'
import Initial from '~/components/setting/Initial.vue'
import {
  FACULTY_API_KEY,
  HOURLY_LOAD_API_KEY,
  SPECIALITY_API_KEY,
  STUDY_PLAN_API_KEY,
} from '~~/modules/apis/runtime/registry/keys'
import type { IFacultyApi } from '~~/modules/apis/runtime/resources/faculty'
import type { IHourlyLoadApi } from '~~/modules/apis/runtime/resources/hourly-load'
import type { ISpecialityApi } from '~~/modules/apis/runtime/resources/speciality'
import type { IStudyPlanApi } from '~~/modules/apis/runtime/resources/studyPlan'
import { createTestApiPlugin } from '~~/modules/apis/runtime/testing/test-api.plugin'

vi.mock('~/stores/user-profile', () => ({
  useUserProfileStore: vi.fn(() => ({
    facultyId: ref(null),
    specialityId: ref(null),
    hourlyLoad: ref(null),
    studyPlanId: ref(null),
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

describe('setting/Initial', () => {
  let hourlyLoadApi: Mocked<IHourlyLoadApi>
  let facultyApi: Mocked<IFacultyApi>
  let specialityApi: Mocked<ISpecialityApi>
  let studyPlanApi: Mocked<IStudyPlanApi>

  beforeEach(() => {
    hourlyLoadApi = {
      getLatestByFaculty: vi.fn(),
    }
    facultyApi = {
      getAll: vi.fn().mockResolvedValue([]),
    }
    specialityApi = {
      getById: vi.fn(),
      getAllByFaculty: vi.fn().mockResolvedValue([]),
    }
    studyPlanApi = {
      getAll: vi.fn().mockResolvedValue([]),
      getAllBySpecialityId: vi.fn().mockResolvedValue([]),
      getSubjectsByStudyPlanId: vi.fn().mockResolvedValue([]),
    }
  })
  it('renders the initial settings form', () => {
    const testApiPlugin = createTestApiPlugin({
      mocks: [
        [HOURLY_LOAD_API_KEY, hourlyLoadApi],
        [FACULTY_API_KEY, facultyApi],
        [SPECIALITY_API_KEY, specialityApi],
        [STUDY_PLAN_API_KEY, studyPlanApi],
      ],
    })
    const wrapper = shallowMount(Initial, {
      props: { loading: false },
      global: {
        plugins: [vuetify, testApiPlugin],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders while loading', () => {
    const testApiPlugin = createTestApiPlugin({
      mocks: [
        [HOURLY_LOAD_API_KEY, hourlyLoadApi],
        [FACULTY_API_KEY, facultyApi],
        [SPECIALITY_API_KEY, specialityApi],
        [STUDY_PLAN_API_KEY, studyPlanApi],
      ],
    })
    const wrapper = shallowMount(Initial, {
      props: { loading: true },
      global: {
        plugins: [vuetify, testApiPlugin],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
