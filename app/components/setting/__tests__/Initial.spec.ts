import { flushPromises, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { createVuetify } from 'vuetify'
import Initial from '~/components/setting/Initial.vue'

const mocks = vi.hoisted(() => ({
  getFaculties: vi.fn().mockResolvedValue([]),
  ensureLocalLoad: vi.fn().mockResolvedValue(null),
}))

vi.mock('~/stores/user-profile', () => ({
  useUserProfileStore: vi.fn(() => ({
    facultyId: ref(null),
    specialityId: ref(null),
    studyPlanId: ref(null),
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

vi.mock('~~/modules/apis/runtime/composables', () => ({
  useFacultyApi: vi.fn(() => ({
    getAll: mocks.getFaculties,
  })),
  useHourlyLoadApi: vi.fn(() => ({
    getAllByFaculty: vi.fn().mockResolvedValue([]),
  })),
  useSpecialityApi: vi.fn(() => ({
    getAllByFaculty: vi.fn().mockResolvedValue([]),
  })),
  useStudyPlanApi: vi.fn(() => ({
    getAllBySpecialityId: vi.fn().mockResolvedValue([]),
  })),
}))

mockNuxtImport('useLocalHourlyLoad', () =>
  vi.fn(() => ({ ensureLoaded: mocks.ensureLocalLoad })),
)

const vuetify = createVuetify()

describe('setting/Initial', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the initial settings form', () => {
    const wrapper = shallowMount(Initial, {
      props: { loading: false },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders while loading', () => {
    const wrapper = shallowMount(Initial, {
      props: { loading: true },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('loads faculties when private storage is unavailable', async () => {
    mocks.ensureLocalLoad.mockRejectedValueOnce(
      new Error('Private storage is unavailable'),
    )
    shallowMount(Initial, {
      global: { plugins: [vuetify] },
    })

    await flushPromises()

    expect(mocks.getFaculties).toHaveBeenCalled()
  })
})
